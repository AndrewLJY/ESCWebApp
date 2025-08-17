// src/test/IntMidBookmarkPage.test.jsx

jest.mock("../assets/ascenda_logo.png", () => "mock-logo.png");

// Mock react-router-dom's useNavigate at top level
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Bookmark from "../pages/BookmarkPage";

jest.mock("../middleware/bookmarkApi", () => {
  let currentBookmarks = [
    {
      hotel_id: "1",
      hotel_name: "Hotel One",
      hotel_address: "Address One",
      hotel_ratings: 4,
      stitchedImageUrls: ["https://images.test/hotel1.jpg"],
      search_string: "?checkin=2025-08-01&checkout=2025-08-05",
      destination_id: 123,
    },
    {
      hotel_id: "2",
      hotel_name: "Hotel Two",
      hotel_address: "Address Two",
      hotel_ratings: 5,
      stitchedImageUrls: ["https://images.test/hotel2.jpg"],
      search_string: "?checkin=2025-08-10&checkout=2025-08-15",
      destination_id: 456,
    },
  ];

  return {
    getBookmarkedHotels: jest.fn(() =>
      Promise.resolve({ data: currentBookmarks })
    ),
    removeBookmark: jest.fn((id) => {
      currentBookmarks = currentBookmarks.filter((b) => b.hotel_id !== id);
      return Promise.resolve();
    }),
    __resetMocks: () => {
      currentBookmarks = [
        {
          hotel_id: "1",
          hotel_name: "Hotel One",
          hotel_address: "Address One",
          hotel_ratings: 4,
          stitchedImageUrls: ["https://images.test/hotel1.jpg"],
          search_string: "?checkin=2025-08-01&checkout=2025-08-05",
          destination_id: 123,
        },
        {
          hotel_id: "2",
          hotel_name: "Hotel Two",
          hotel_address: "Address Two",
          hotel_ratings: 5,
          stitchedImageUrls: ["https://images.test/hotel2.jpg"],
          search_string: "?checkin=2025-08-10&checkout=2025-08-15",
          destination_id: 456,
        },
      ];
    },
  };
});

describe("Bookmark Page Integration Test", () => {
  const bookmarkApi = require("../middleware/bookmarkApi");

  beforeEach(() => {
    jest.clearAllMocks();
    bookmarkApi.__resetMocks();
    mockNavigate.mockClear();
  });

  test("shows loading initially and then empty message if no bookmarks", async () => {
    bookmarkApi.getBookmarkedHotels.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <Bookmark />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/haven[’']t bookmarked any hotels/i)
      ).toBeInTheDocument();
    });
  });

  test("renders bookmarks correctly", async () => {
    render(
      <MemoryRouter>
        <Bookmark />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
      expect(screen.getByText("Hotel Two")).toBeInTheDocument();
    });
  });

  test("removing a bookmark updates the list", async () => {
    render(
      <MemoryRouter>
        <Bookmark />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText("❌ Remove");

    await act(async () => {
      fireEvent.click(removeButtons[0]);
    });

    // Wait for Hotel One to disappear (after removeBookmark and fetchBookmarks finish)
    await waitFor(() => {
      expect(screen.queryByText("Hotel One")).not.toBeInTheDocument();
      expect(screen.getByText("Hotel Two")).toBeInTheDocument();
    });
  });

  test("clicking View Hotel navigates correctly", async () => {
    render(
      <MemoryRouter>
        <Bookmark />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText("View Hotel");

    await act(async () => {
      fireEvent.click(viewButtons[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/hotel/1", expect.any(Object));
  });

  test("does not show loading state during bookmark removal (because component doesn't show it)", async () => {
    render(
      <MemoryRouter>
        <Bookmark />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText("❌ Remove");

    await act(async () => {
      fireEvent.click(removeButtons[0]);
    });

    // Confirm "loading" text does NOT appear during removal
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    // And confirm UI updates after removal
    await waitFor(() => {
      expect(screen.queryByText("Hotel One")).not.toBeInTheDocument();
      expect(screen.getByText("Hotel Two")).toBeInTheDocument();
    });
  });

  test("handles bookmarks with missing images or ratings gracefully", async () => {
    bookmarkApi.getBookmarkedHotels.mockResolvedValueOnce({
      data: [
        {
          hotel_id: "3",
          hotel_name: "Hotel Missing Image",
          hotel_address: "No Image Address",
          hotel_ratings: 0,
          stitchedImageUrls: [],
          search_string: "?checkin=2025-08-20&checkout=2025-08-25",
          destination_id: 789,
        },
        {
          hotel_id: "4",
          hotel_name: "Hotel Missing Ratings",
          hotel_address: "No Ratings Address",
          // No hotel_ratings field
          stitchedImageUrls: ["https://images.test/hotel4.jpg"],
          search_string: "?checkin=2025-08-26&checkout=2025-08-30",
          destination_id: 1011,
        },
      ],
    });

    render(
      <MemoryRouter>
        <Bookmark />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hotel Missing Image")).toBeInTheDocument();
      expect(screen.getByText("Hotel Missing Ratings")).toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    const hotelImages = images.filter(
      (img) => !img.getAttribute("src").includes("mock-logo.png")
    );

    expect(hotelImages[0]).toHaveAttribute(
      "src",
      "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"
    );
    expect(hotelImages[1]).toHaveAttribute(
      "src",
      "https://images.test/hotel4.jpg"
    );

    // Ratings star rendering: hotel_ratings=0 or missing results in empty stars
    expect(
      screen.getByText("Hotel Missing Image").nextSibling.nextSibling
        .textContent
    ).toBe("");
    expect(
      screen.getByText("Hotel Missing Ratings").nextSibling.nextSibling
        .textContent
    ).toBe("");
  });
});
