// src/test/SearchPage.test.jsx
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

  it("shows an error message when both location and hotel are missing", async () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchPage />
      </MemoryRouter>
    );

    // Should immediately show the error
    expect(
      await screen.findByText("Invalid search parameters, please re-enter")
    ).toBeInTheDocument();

    // API should never have been called
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

    // Mock the API once for mount
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

    // Both hotel names should eventually appear
    for (const h of mockHotels) {
      expect(await screen.findByText(h.keyDetails.name)).toBeInTheDocument();
    }

    // Error should not be shown
    expect(
      screen.queryByText("Invalid search parameters, please re-enter")
    ).toBeNull();

    // API called with correct payload
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

    // 1st call (on mount): no hotels → error
    // 2nd call (after clicking Search): return mockHotels
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

    // 1) Initial error on mount
    expect(
      await screen.findByText("Invalid search parameters, please re-enter")
    ).toBeInTheDocument();

    // 2) Fill Location
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Tokyo" },
    });

    // Fill dates
    const dateInputs = container.querySelectorAll('input[type="date"]');
    const [checkinInput, checkoutInput] = dateInputs;
    fireEvent.change(checkinInput, { target: { value: "2025-09-01" } });
    fireEvent.change(checkoutInput, { target: { value: "2025-09-05" } });

    // Click Search
    fireEvent.click(screen.getByRole("button", { name: /^Search$/i }));

    // 3) Wait for API to be called with correct payload
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

    // 4) Error message should clear
    await waitFor(() =>
      expect(
        screen.queryByText("Invalid search parameters, please re-enter")
      ).toBeNull()
    );

    // 5) Finally, the new hotel appears
    expect(await screen.findByText("Hotel Gamma")).toBeInTheDocument();
  });
});
