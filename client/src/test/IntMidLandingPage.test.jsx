// src/test/IntMidLandingPage.test.jsx
jest.mock("../assets/ascenda_logo.png", () => "mock-logo.png");
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import this
import LandingPage from "../pages/LandingPage";

describe("LandingPage Basic Integration Test", () => {
  test("renders header logo", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    const logo = screen.getByAltText(/ascenda logo/i);
    expect(logo).toBeInTheDocument();
  });

  test("renders search bar with a Search button", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });
});
