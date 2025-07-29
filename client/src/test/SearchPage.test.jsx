// src/test/SearchPage.test.jsx
//integration test
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchPage from "../pages/SearchPage";

// Mock the search API
jest.mock("../middleware/searchApi", () => ({
  searchHotelsAPI: jest.fn(() =>
    Promise.resolve({
      data: {
        hotels: [
          {
            keyDetails: {
              id: 1,
              name: "Hotel Ascenda",
              address: "123 Beach Road, Singapore",
              distance: 5,
              rating: 4,
              price: 200,
            },
            imageDetails: {
              imageCounts: 1,
              stitchedImageUrls: ["https://mockimg.com/hotel.jpg"],
            },
          },
        ],
      },
    })
  ),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SearchPage Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  test("❌ Shows alert when both location and hotel are missing", async () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByPlaceholderText("Hotel name"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByPlaceholderText("Check-in"), {
      target: { value: "2025-08-01" },
    });

    fireEvent.change(screen.getByPlaceholderText("Check-out"), {
      target: { value: "2025-08-05" },
    });

    fireEvent.change(screen.getByPlaceholderText("Guests"), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Please enter a location or a hotel name."
      );
    });
  });

  test("✅ Navigates and displays result when location is filled", async () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Singapore" },
    });

    fireEvent.change(screen.getByPlaceholderText("Hotel name"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByPlaceholderText("Check-in"), {
      target: { value: "2025-08-01" },
    });

    fireEvent.change(screen.getByPlaceholderText("Check-out"), {
      target: { value: "2025-08-05" },
    });

    fireEvent.change(screen.getByPlaceholderText("Guests"), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("/search?location=Singapore")
      );
    });

    expect(await screen.findByText("Hotel Ascenda")).toBeInTheDocument();
    expect(screen.getByText("123 Beach Road, Singapore")).toBeInTheDocument();
    expect(screen.getByText("SGD 200")).toBeInTheDocument();
  });
});
