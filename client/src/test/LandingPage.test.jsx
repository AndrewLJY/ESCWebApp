import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe("LandingPage Search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn(); // ✅ Mock alert
  });

  test("Search fails with missing fields", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const searchBtn = screen.getByText("Search");
    fireEvent.click(searchBtn);

    expect(global.alert).toHaveBeenCalledWith(
      "Please enter a location or a hotel name."
    );
  });

  test("Search proceeds with valid filters", async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Open & fill Location
    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(screen.getByPlaceholderText("Where to?"), {
      target: { value: "Singapore" },
    });

    // Open & fill Check-in
    fireEvent.click(screen.getByText("Check in"));
    const checkinInput = await screen.findByPlaceholderText("Check in");
    fireEvent.change(checkinInput, {
      target: { value: "2025-08-01" },
    });

    // Open & fill Check-out
    fireEvent.click(screen.getByText("Check out"));
    const checkoutInput = await screen.findByPlaceholderText("Check out");
    fireEvent.change(checkoutInput, {
      target: { value: "2025-08-05" },
    });

    // Open & fill Guests
    fireEvent.click(screen.getByText("Guests"));
    const guestsInput = await screen.findByPlaceholderText("1");
    fireEvent.change(guestsInput, {
      target: { value: "2" },
    });

    // Click Search
    fireEvent.click(screen.getByText("Search"));

    // Assert correct navigation URL
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("/search?location=Singapore")
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("checkin=2025-08-01")
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("checkout=2025-08-05")
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("guests=2")
    );

    // No alert expected
    expect(global.alert).not.toHaveBeenCalled();
  });
});
