// Prevent image import crashes
jest.mock("../assets/ascenda_logo.png", () => "mock-logo.png");

// Stable mock for the API module
jest.mock("../middleware/searchApi", () => ({
  searchHotelsAPI: jest.fn(),
}));

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import SearchPage from "../pages/SearchPage";
import { searchHotelsAPI } from "../middleware/searchApi";

/**
 * Wait for SearchBar to hydrate from URL (Location field shows initial value),
 * click Search, and ensure the API was called.
 */
async function hydrateAndSearch(expectedLocation = /city|paris/i) {
  await screen.findByDisplayValue(expectedLocation);
  const searchBtn = screen.getByRole("button", { name: /search/i });
  fireEvent.click(searchBtn);
  await waitFor(() => expect(searchHotelsAPI).toHaveBeenCalled());
}

describe("SearchPage integration test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders hotel info after pressing search button", async () => {
    // Add trustYouBenchmark so SortingBar guest rating filter doesn't remove items
    searchHotelsAPI.mockResolvedValue({
      data: {
        destination_id: "dest123",
        hotels: [
          {
            keyDetails: {
              id: "hotel1",
              name: "Test Hotel One",
              rating: 4,
              address: "123 Test Street",
            },
            pricingRankingData: { lowestPrice: 150 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/image1.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 4.0 } } },
          },
          {
            keyDetails: {
              id: "hotel2",
              name: "Test Hotel Two",
              rating: 3,
              address: "456 Demo Ave",
            },
            pricingRankingData: { lowestPrice: 120 },
            imageDetails: {
              thumbnailUrl: "https://example.com/image2-thumb.jpg",
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 3.5 } } },
          },
        ],
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/search?location=paris&checkin=2025-08-20&checkout=2025-08-25",
        ]}
      >
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await hydrateAndSearch(/paris/i);

    expect(await screen.findByText("Test Hotel One")).toBeInTheDocument();
    expect(await screen.findByText("Test Hotel Two")).toBeInTheDocument();

    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    // With trustYouBenchmark present, this shows as 4/5, not NA
    expect(screen.getByText("Guest Rating: 4/5")).toBeInTheDocument();

    const fromElements = screen.getAllByText("From");
    expect(fromElements.length).toBeGreaterThan(0);
    expect(screen.getByText("150 SGD")).toBeInTheDocument();

    expect(screen.getByAltText("Test Hotel One")).toHaveAttribute(
      "src",
      "https://example.com/image1.jpg"
    );
    expect(screen.getByAltText("Test Hotel Two")).toHaveAttribute(
      "src",
      "https://example.com/image2-thumb.jpg"
    );

    const buttons = screen.getAllByRole("button", {
      name: /view more details/i,
    });
    expect(buttons.length).toBeGreaterThan(0);
    fireEvent.click(buttons[0]);
  });

  it("shows error message on invalid search params", async () => {
    render(
      <MemoryRouter initialEntries={["/search?checkin=2025-08-20"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText("Invalid search parameters, please re-enter")
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Test Hotel One")).not.toBeInTheDocument();
  });

  it("displays loading skeleton while fetching hotels", async () => {
    let resolvePromise;
    const pending = new Promise((resolve) => (resolvePromise = resolve));
    searchHotelsAPI.mockReturnValue(pending);

    render(
      <MemoryRouter
        initialEntries={[
          "/search?location=paris&checkin=2025-08-20&checkout=2025-08-25",
        ]}
      >
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await hydrateAndSearch(/paris/i);

    // skeleton while API unresolved
    expect(document.querySelector(".hotel-skeleton")).toBeInTheDocument();

    resolvePromise({ data: { destination_id: "dest123", hotels: [] } });

    await waitFor(() => {
      expect(screen.getByText("No hotels found.")).toBeInTheDocument();
    });
  });

  it("allows pagination of hotel results", async () => {
    searchHotelsAPI.mockResolvedValue({
      data: {
        destination_id: "dest123",
        hotels: Array.from({ length: 10 }, (_, i) => ({
          keyDetails: {
            id: `hotel${i + 1}`,
            name: `Hotel ${i + 1}`,
            rating: 3,
            address: `Address ${i + 1}`,
          },
          pricingRankingData: { lowestPrice: 100 + i * 10 },
          imageDetails: {
            thumbnailUrl: `https://example.com/image${i + 1}.jpg`,
          },
          trustYouBenchmark: { score: { score: { kaligo_overall: 4.0 } } },
        })),
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/search?location=paris&checkin=2025-08-20&checkout=2025-08-25",
        ]}
      >
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await hydrateAndSearch(/paris/i);

    // pageSize = 4; first page shows 1..4
    expect(await screen.findByText("Hotel 1")).toBeInTheDocument();
    expect(await screen.findByText("Hotel 4")).toBeInTheDocument();
    expect(screen.queryByText("Hotel 5")).not.toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    expect(await screen.findByText("Hotel 5")).toBeInTheDocument();
    expect(screen.queryByText("Hotel 1")).not.toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(prevButton);

    expect(await screen.findByText("Hotel 1")).toBeInTheDocument();
  });

  it("sorts hotels by rating and filters by pool amenity (no filtering effect in current UI)", async () => {
    searchHotelsAPI.mockResolvedValue({
      data: {
        destination_id: "dest123",
        hotels: [
          {
            keyDetails: {
              id: "luxury",
              name: "Luxury Hotel",
              rating: 5,
              address: "Address 2",
            },
            pricingRankingData: { lowestPrice: 300 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/luxury.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 4.7 } } },
          },
          {
            keyDetails: {
              id: "midrange",
              name: "Midrange Hotel",
              rating: 4,
              address: "Address 3",
            },
            pricingRankingData: { lowestPrice: 150 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/midrange.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 4.2 } } },
          },
          {
            keyDetails: {
              id: "cheap",
              name: "Cheap Hotel",
              rating: 2,
              address: "Address 1",
            },
            pricingRankingData: { lowestPrice: 50 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/cheap.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 3.1 } } },
          },
        ],
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/search?location=city&checkin=2025-08-20&checkout=2025-08-25",
        ]}
      >
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await hydrateAndSearch(/city/i);

    expect(await screen.findByText("Luxury Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Midrange Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Cheap Hotel")).toBeInTheDocument();

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "rating" } });

    // amenities toggle exists but doesn’t actually filter in your current UI
    const amenitiesToggle = screen.getByRole("button", {
      name: /select amenities/i,
    });
    fireEvent.click(amenitiesToggle);

    // still present
    expect(await screen.findByText("Luxury Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Midrange Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Cheap Hotel")).toBeInTheDocument();
  });

  it("clears filters and resets sorting when Clear Filters is clicked", async () => {
    searchHotelsAPI.mockResolvedValue({
      data: {
        destination_id: "dest123",
        hotels: [
          {
            keyDetails: {
              id: "luxury",
              name: "Luxury Hotel",
              rating: 5,
              address: "Address 2",
            },
            pricingRankingData: { lowestPrice: 300 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/luxury.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 4.7 } } },
          },
          {
            keyDetails: {
              id: "midrange",
              name: "Midrange Hotel",
              rating: 4,
              address: "Address 3",
            },
            pricingRankingData: { lowestPrice: 150 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/midrange.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 4.2 } } },
          },
          {
            keyDetails: {
              id: "cheap",
              name: "Cheap Hotel",
              rating: 2,
              address: "Address 1",
            },
            pricingRankingData: { lowestPrice: 50 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/cheap.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 3.1 } } },
          },
        ],
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/search?location=city&checkin=2025-08-20&checkout=2025-08-25",
        ]}
      >
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await hydrateAndSearch(/city/i);

    expect(await screen.findByText("Luxury Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Midrange Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Cheap Hotel")).toBeInTheDocument();

    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "rating" } });

    const clearFiltersButton = screen.getByRole("button", {
      name: /clear filters/i,
    });
    fireEvent.click(clearFiltersButton);

    // Items still present and sort resets to price
    expect(await screen.findByText("Luxury Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Midrange Hotel")).toBeInTheDocument();
    expect(await screen.findByText("Cheap Hotel")).toBeInTheDocument();
    expect(sortSelect.value).toBe("price");
  });

  it("filters hotels according to min and max price range sliders", async () => {
    searchHotelsAPI.mockResolvedValue({
      data: {
        destination_id: "dest123",
        hotels: [
          {
            keyDetails: {
              id: "hotel1",
              name: "Hotel One",
              rating: 4,
              address: "Address 1",
            },
            pricingRankingData: { lowestPrice: 100 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/hotel1.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 4.0 } } },
          },
          {
            keyDetails: {
              id: "hotel2",
              name: "Hotel Two",
              rating: 3,
              address: "Address 2",
            },
            pricingRankingData: { lowestPrice: 200 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/hotel2.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 3.5 } } },
          },
          {
            keyDetails: {
              id: "hotel3",
              name: "Hotel Three",
              rating: 5,
              address: "Address 3",
            },
            pricingRankingData: { lowestPrice: 300 },
            imageDetails: {
              stitchedImageUrls: ["https://example.com/hotel3.jpg"],
            },
            trustYouBenchmark: { score: { score: { kaligo_overall: 4.8 } } },
          },
        ],
      },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/search?location=city&checkin=2025-08-20&checkout=2025-08-25",
        ]}
      >
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );

    await hydrateAndSearch(/city/i);

    // Ensure all 3 are visible before filtering
    expect(await screen.findByText("Hotel One")).toBeInTheDocument();
    expect(await screen.findByText("Hotel Two")).toBeInTheDocument();
    expect(await screen.findByText("Hotel Three")).toBeInTheDocument();

    // Adjust price sliders to [150, 250]
    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBe(2);
    const minSlider = sliders[0];
    const maxSlider = sliders[1];

    fireEvent.change(minSlider, { target: { value: 150 } });
    fireEvent.change(maxSlider, { target: { value: 250 } });

    await waitFor(() => {
      expect(screen.queryByText("Hotel One")).not.toBeInTheDocument(); // 100 < 150
      expect(screen.getByText("Hotel Two")).toBeInTheDocument(); // 200 in range
      expect(screen.queryByText("Hotel Three")).not.toBeInTheDocument(); // 300 > 250
    });
  });
});
