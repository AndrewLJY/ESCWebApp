// src/test/integration/SearchBar.integration.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import LandingPage from "../../pages/LandingPage";
import { act } from "react";

// Mock the logo
jest.mock("../../assets/ascenda_logo.png", () => "mock-logo.png");

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock fetch for backend API calls
global.fetch = jest.fn();

// Mock axios for backend API calls
jest.mock("axios", () => ({
  get: jest.fn(),
  defaults: {
    headers: {
      post: {}
    }
  }
}));

const axios = require("axios");

describe("SearchBar API Integration Tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    axios.get.mockClear();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Autocomplete Integration", () => {
    it("fetches suggestions from backend API on location input", async () => {
      axios.get.mockResolvedValueOnce({
        data: ["Paris", "Parma", "Paradise"]
      });

      const mockFetchData = jest.fn();
      
      render(
        <MemoryRouter>
          <SearchBar isSearchPage={false} fetchData={mockFetchData} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Location"));
      const locationInput = screen.getByRole("textbox");
      fireEvent.change(locationInput, { target: { value: "Par" } });

      act(() => jest.advanceTimersByTime(300));

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/string/Par");
        expect(screen.getByText("Paris")).toBeInTheDocument();
        expect(screen.getByText("Parma")).toBeInTheDocument();
        expect(screen.getByText("Paradise")).toBeInTheDocument();
      });
    });

    it("handles backend API errors gracefully", async () => {
      axios.get.mockRejectedValueOnce(new Error("Network error"));

      const mockFetchData = jest.fn();
      
      render(
        <MemoryRouter>
          <SearchBar isSearchPage={false} fetchData={mockFetchData} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Location"));
      const locationInput = screen.getByRole("textbox");
      fireEvent.change(locationInput, { target: { value: "Error" } });

      act(() => jest.advanceTimersByTime(300));

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/string/Error");
      });

      // Should not show suggestions on error
      expect(screen.queryByText("Paris")).not.toBeInTheDocument();
    });

    it("selects suggestion and updates input value", async () => {
      axios.get.mockResolvedValueOnce({
        data: ["Berlin", "Bern"]
      });

      const mockFetchData = jest.fn();
      
      render(
        <MemoryRouter>
          <SearchBar isSearchPage={false} fetchData={mockFetchData} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Location"));
      const locationInput = screen.getByRole("textbox");
      fireEvent.change(locationInput, { target: { value: "Be" } });

      act(() => jest.advanceTimersByTime(300));

      await waitFor(() => {
        expect(screen.getByText("Berlin")).toBeInTheDocument();
      });

      fireEvent.mouseDown(screen.getByText("Berlin"));
      
      expect(locationInput.value).toBe("Berlin");
      expect(screen.queryByText("Bern")).not.toBeInTheDocument();
    });

    it("handles search page autocomplete integration", async () => {
      axios.get.mockResolvedValueOnce({
        data: ["Singapore", "Sintra"]
      });

      const mockFetchData = jest.fn();
      
      render(
        <MemoryRouter initialEntries={["/search"]}>
          <SearchBar isSearchPage={true} search="" fetchData={mockFetchData} />
        </MemoryRouter>
      );

      const locationInput = screen.getByPlaceholderText("Location");
      fireEvent.change(locationInput, { target: { value: "Sin" } });

      act(() => jest.advanceTimersByTime(300));

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/string/Sin");
        expect(screen.getByText("Singapore")).toBeInTheDocument();
        expect(screen.getByText("Sintra")).toBeInTheDocument();
      });
    });
  });

  describe("Search Integration - Search Page Mode", () => {
    it("validates required fields before making API call", () => {
      const mockFetchData = jest.fn();
      global.alert = jest.fn();
      
      render(
        <MemoryRouter initialEntries={["/search"]}>
          <SearchBar isSearchPage={true} search="" fetchData={mockFetchData} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Search"));
      
      expect(global.alert).toHaveBeenCalledWith("Enter a location, Hotel name is optional.");
      expect(mockFetchData).not.toHaveBeenCalled();
    });

    it("validates date fields are required", () => {
      const mockFetchData = jest.fn();
      global.alert = jest.fn();
      
      render(
        <MemoryRouter initialEntries={["/search"]}>
          <SearchBar isSearchPage={true} search="" fetchData={mockFetchData} />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText("Location"), {
        target: { value: "Tokyo" }
      });

      fireEvent.click(screen.getByText("Search"));
      
      expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
      expect(mockFetchData).not.toHaveBeenCalled();
    });

    it("calls fetchData with correct parameters when form is valid", async () => {
      const mockFetchData = jest.fn();
      global.alert = jest.fn();
      
      const { container } = render(
        <MemoryRouter initialEntries={["/search"]}>
          <SearchBar isSearchPage={true} search="" fetchData={mockFetchData} />
        </MemoryRouter>
      );

      // Fill in required fields
      fireEvent.change(screen.getByPlaceholderText("Location"), {
        target: { value: "Singapore" }
      });
      
      fireEvent.change(screen.getByPlaceholderText("Hotel Name"), {
        target: { value: "Marina Bay Sands" }
      });
      
      const dateInputs = container.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2025-12-01" } });
      fireEvent.change(dateInputs[1], { target: { value: "2025-12-05" } });
      
      const numberInputs = container.querySelectorAll('input[type="number"]');
      fireEvent.change(numberInputs[0], { target: { value: "2" } });
      fireEvent.change(numberInputs[1], { target: { value: "1" } });

      fireEvent.click(screen.getByText("Search"));

      expect(global.alert).not.toHaveBeenCalled();
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("location=Singapore")
      );
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("hotel=Marina%20Bay%20Sands")
      );
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("checkin=2025-12-01")
      );
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("checkout=2025-12-05")
      );
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("guests=2")
      );
      expect(mockFetchData).toHaveBeenCalledWith(
        expect.stringContaining("roomNum=1")
      );
    });

    it("handles hotel-only search validation", () => {
      const mockFetchData = jest.fn();
      global.alert = jest.fn();
      
      render(
        <MemoryRouter initialEntries={["/search"]}>
          <SearchBar isSearchPage={true} search="" fetchData={mockFetchData} />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText("Hotel Name"), {
        target: { value: "Hilton" }
      });

      fireEvent.click(screen.getByText("Search"));
      
      expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
      expect(mockFetchData).not.toHaveBeenCalled();
    });
  });

  describe("Search Integration - Landing Page Mode", () => {
    it("navigates to search page with correct query parameters", () => {
      global.alert = jest.fn();
      
      const { container } = render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      );

      const filterButtons = container.querySelectorAll(".filter-btn");
      
      // Set location
      fireEvent.click(filterButtons[0]);
      fireEvent.change(container.querySelector('input[type="text"]'), {
        target: { value: "Tokyo" }
      });
      
      // Set check-in date
      fireEvent.click(filterButtons[2]);
      let dateInput = container.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: "2025-08-01" } });
      
      // Set check-out date
      fireEvent.click(filterButtons[3]);
      dateInput = container.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: "2025-08-05" } });
      
      // Set guests
      fireEvent.click(filterButtons[4]);
      fireEvent.change(container.querySelector('input[type="number"]'), {
        target: { value: "3" }
      });

      fireEvent.click(screen.getByText("Search"));

      expect(global.alert).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("/search?")
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("location=Tokyo")
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("guests=3")
      );
    });

    it("handles missing location validation", () => {
      global.alert = jest.fn();
      
      const { container } = render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Search"));

      expect(global.alert).toHaveBeenCalledWith("Enter a location, Hotel name is optional.");
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("handles missing date validation", () => {
      global.alert = jest.fn();
      
      const { container } = render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      );

      const filterButtons = container.querySelectorAll(".filter-btn");
      
      // Set only location
      fireEvent.click(filterButtons[0]);
      fireEvent.change(container.querySelector('input[type="text"]'), {
        target: { value: "Paris" }
      });

      fireEvent.click(screen.getByText("Search"));

      expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("includes hotel parameter when provided", () => {
      global.alert = jest.fn();
      
      const { container } = render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      );

      const filterButtons = container.querySelectorAll(".filter-btn");
      
      // Set location
      fireEvent.click(filterButtons[0]);
      fireEvent.change(container.querySelector('input[type="text"]'), {
        target: { value: "London" }
      });
      
      // Set hotel
      fireEvent.click(filterButtons[1]);
      fireEvent.change(container.querySelector('input[type="text"]'), {
        target: { value: "Marriott" }
      });
      
      // Set dates
      fireEvent.click(filterButtons[2]);
      let dateInput = container.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: "2025-09-01" } });
      
      fireEvent.click(filterButtons[3]);
      dateInput = container.querySelector('input[type="date"]');
      fireEvent.change(dateInput, { target: { value: "2025-09-05" } });

      fireEvent.click(screen.getByText("Search"));

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("hotel=Marriott")
      );
    });
  });

  describe("Date Validation Integration", () => {
    it("enforces minimum date constraints", () => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date("2025-01-01T00:00:00Z"));

      const mockFetchData = jest.fn();
      const { container } = render(
        <MemoryRouter initialEntries={["/search"]}>
          <SearchBar isSearchPage={true} search="" fetchData={mockFetchData} />
        </MemoryRouter>
      );

      const [checkinInput, checkoutInput] = container.querySelectorAll('input[type="date"]');

      expect(checkinInput).toHaveAttribute("min", "2025-01-04");
      expect(checkoutInput).toHaveAttribute("min", "2025-01-04");

      fireEvent.change(checkinInput, { target: { value: "2025-02-10" } });
      expect(checkoutInput).toHaveAttribute("min", "2025-02-11");
    });

    it("auto-updates checkout date when checkin changes", () => {
      const mockFetchData = jest.fn();
      const { container } = render(
        <MemoryRouter initialEntries={["/search"]}>
          <SearchBar isSearchPage={true} search="" fetchData={mockFetchData} />
        </MemoryRouter>
      );

      const [checkinInput, checkoutInput] = container.querySelectorAll('input[type="date"]');

      fireEvent.change(checkinInput, { target: { value: "2025-06-15" } });
      fireEvent.change(checkoutInput, { target: { value: "2025-06-16" } });

      // Change checkin to after current checkout
      fireEvent.change(checkinInput, { target: { value: "2025-06-20" } });

      expect(checkoutInput.value).toBe("2025-06-21");
    });

    it("handles landing page date constraints", () => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(new Date("2025-06-15T00:00:00Z"));

      const { container } = render(
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      );

      const filterButtons = container.querySelectorAll(".filter-btn");

      fireEvent.click(filterButtons[2]); // Check-in
      let dateInput = container.querySelector('input[type="date"]');
      expect(dateInput).toHaveAttribute("min", "2025-06-18");

      fireEvent.change(dateInput, { target: { value: "2025-07-20" } });

      fireEvent.click(filterButtons[3]); // Check-out
      dateInput = container.querySelector('input[type="date"]');
      expect(dateInput).toHaveAttribute("min", "2025-07-21");
    });
  });

  describe("URL Parameter Integration", () => {
    it("pre-fills search page inputs from URL parameters", () => {
      const mockFetchData = jest.fn();
      const searchParams = "?location=Paris&hotel=Hilton&checkin=2025-08-01&checkout=2025-08-05&guests=2&roomNum=1";
      
      render(
        <MemoryRouter initialEntries={[`/search${searchParams}`]}>
          <SearchBar isSearchPage={true} search={searchParams} fetchData={mockFetchData} />
        </MemoryRouter>
      );

      expect(screen.getByDisplayValue("Paris")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Hilton")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2025-08-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2025-08-05")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    });

    it("handles partial URL parameters", () => {
      const mockFetchData = jest.fn();
      const searchParams = "?location=Tokyo&checkin=2025-09-01";
      
      render(
        <MemoryRouter initialEntries={[`/search${searchParams}`]}>
          <SearchBar isSearchPage={true} search={searchParams} fetchData={mockFetchData} />
        </MemoryRouter>
      );

      expect(screen.getByDisplayValue("Tokyo")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2025-09-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("")).toBeInTheDocument(); // Hotel should be empty
    });
  });
});