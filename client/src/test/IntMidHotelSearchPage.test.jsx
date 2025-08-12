// src/test/SearchPage.test.jsx

// Mock react-loading-skeleton BEFORE any imports
jest.mock("react-loading-skeleton", () => () => "Skeleton Mock");

jest.mock("../assets/ascenda_logo.png", () => "mock-logo.png");

jest.mock("../middleware/searchApi", () => ({
  searchHotelsAPI: jest.fn(),
}));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPage from "../pages/SearchPage";
import { searchHotelsAPI } from "../middleware/searchApi";

describe("SearchPage Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Header component on page load", () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchPage />
      </MemoryRouter>
    );

    // Find logo by alt text "Ascenda logo"
    const logo = screen.getByRole("img", { name: /ascenda/i });
    expect(logo).toBeInTheDocument();

    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("shows an error message when both location and hotel are missing", async () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Invalid search parameters, please re-enter")
    ).toBeInTheDocument();

    expect(searchHotelsAPI).not.toHaveBeenCalled();
  });

  it("fetches and displays hotels when location + valid dates are provided", async () => {
    const mockHotels = [
      {
        keyDetails: {
          id: "h1",
          name: "Hotel Alpha",
          address: "Addr A",
          rating: 4.1,
        },
        pricingRankingData: { lowestPrice: 123.45 },
        imageDetails: { stitchedImageUrls: [], thumbnailUrl: "" },
      },
      {
        keyDetails: {
          id: "h2",
          name: "Hotel Beta",
          address: "Addr B",
          rating: 3.9,
        },
        pricingRankingData: { lowestPrice: 200 },
        imageDetails: { stitchedImageUrls: [], thumbnailUrl: "" },
      },
    ];

    searchHotelsAPI.mockResolvedValueOnce({
      data: { hotels: mockHotels, destination_id: 999 },
    });

    render(
      <MemoryRouter
        initialEntries={[
          "/search?location=Paris&checkin=2025-08-01&checkout=2025-08-05",
        ]}
      >
        <SearchPage />
      </MemoryRouter>
    );

    for (const h of mockHotels) {
      expect(await screen.findByText(h.keyDetails.name)).toBeInTheDocument();
    }

    expect(
      screen.queryByText("Invalid search parameters, please re-enter")
    ).toBeNull();

    expect(searchHotelsAPI).toHaveBeenCalledWith({
      hotelType: "Hotel",
      location: "Paris",
      checkIn: "2025-08-01",
      checkOut: "2025-08-05",
      guests: 1,
      roomNum: 1,
    });
  });

  it("lets the user fill filters, click Search, and then displays results", async () => {
    const mockHotels = [
      {
        keyDetails: {
          id: "h3",
          name: "Hotel Gamma",
          address: "Addr G",
          rating: 4.0,
        },
        pricingRankingData: { lowestPrice: 150 },
        imageDetails: { stitchedImageUrls: [], thumbnailUrl: "" },
      },
    ];

    searchHotelsAPI
      .mockResolvedValueOnce({ data: { hotels: [], destination_id: 0 } })
      .mockResolvedValueOnce({
        data: { hotels: mockHotels, destination_id: 42 },
      });

    const { container } = render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Invalid search parameters, please re-enter")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Tokyo" },
    });

    const dateInputs = container.querySelectorAll('input[type="date"]');
    const [checkinInput, checkoutInput] = dateInputs;
    fireEvent.change(checkinInput, { target: { value: "2025-09-01" } });
    fireEvent.change(checkoutInput, { target: { value: "2025-09-05" } });

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() =>
      expect(searchHotelsAPI).toHaveBeenCalledWith({
        hotelType: "Hotel",
        location: "Tokyo",
        checkIn: "2025-09-01",
        checkOut: "2025-09-05",
        guests: 1,
        roomNum: 1,
      })
    );

    await waitFor(() =>
      expect(
        screen.queryByText("Invalid search parameters, please re-enter")
      ).toBeNull()
    );

    expect(await screen.findByText("Hotel Gamma")).toBeInTheDocument();
  });
});
