// src/test/Searchbar.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { act } from "react-dom/test-utils";

// ─── Mock react-router’s useNavigate ─────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ─── Mock axios for autocomplete ──────────────────────────────────────────────
jest.mock("axios");

//
// 1) SearchBar Autocomplete (landing vs search-page modes)
//
describe("SearchBar Autocomplete", () => {
  beforeEach(() => {
    axios.get.mockClear();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("– in landing mode: types into Location, debounces, fetches & shows suggestions", async () => {
    axios.get.mockResolvedValueOnce({ data: ["Paris", "Parma", "Paradise"] });
    const fakeFetch = jest.fn();

    render(
      <MemoryRouter>
        <SearchBar
          isSearchPage={false}
          search=""
          fetchData={fakeFetch}
          className=""
        />
      </MemoryRouter>
    );

    // open landing‐mode location field
    fireEvent.click(screen.getByText("Location"));
    const input = screen.getByRole("textbox", { name: "" });
    fireEvent.change(input, { target: { value: "Par" } });

    // advance debounce
    act(() => jest.advanceTimersByTime(300));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8080/search/string/Par"
      );
      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("Parma")).toBeInTheDocument();
      expect(screen.getByText("Paradise")).toBeInTheDocument();
    });
  });

  it("– in search-page mode: same debounce + suggestions", async () => {
    axios.get.mockResolvedValueOnce({ data: ["Rome", "Roma", "Romulus"] });
    const fakeFetch = jest.fn();

    render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchBar
          isSearchPage={true}
          search=""
          fetchData={fakeFetch}
          className=""
        />
      </MemoryRouter>
    );

    const locInput = screen.getByPlaceholderText("Location");
    fireEvent.change(locInput, { target: { value: "Ro" } });

    act(() => jest.advanceTimersByTime(300));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8080/search/string/Ro"
      );
      expect(screen.getByText("Rome")).toBeInTheDocument();
      expect(screen.getByText("Roma")).toBeInTheDocument();
      expect(screen.getByText("Romulus")).toBeInTheDocument();
    });
  });
});

//
// 2) SearchBar “search” behavior (in search-page mode)
//
describe("SearchBar Search (search-page)", () => {
  let fakeFetch;
  let container;

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
    fakeFetch = jest.fn();
    ({ container } = render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchBar
          isSearchPage={true}
          search=""
          fetchData={fakeFetch}
          className=""
        />
      </MemoryRouter>
    ));
  });

  test("alerts if both Location & Hotel are blank", () => {
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith(
      "Enter a location or hotel name."
    );
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  test("calls fetchData with correct params on valid filters", () => {
    // fill Location
    const loc = screen.getByPlaceholderText("Location");
    fireEvent.change(loc, { target: { value: "Osaka" } });

    // fill Hotel name
    const hotel = screen.getByPlaceholderText("Hotel name");
    fireEvent.change(hotel, { target: { value: "Hilton" } });

    // fill checkin & checkout
    const dates = container.querySelectorAll('input[type="date"]');
    fireEvent.change(dates[0], { target: { value: "2025-12-01" } });
    fireEvent.change(dates[1], { target: { value: "2025-12-05" } });

    // fill guests
    const num = container.querySelector('input[type="number"]');
    fireEvent.change(num, { target: { value: "3" } });

    // click Search
    fireEvent.click(screen.getByText("Search"));

    expect(global.alert).not.toHaveBeenCalled();
    expect(fakeFetch).toHaveBeenCalledWith(
      expect.stringContaining("location=Osaka")
    );
    expect(fakeFetch).toHaveBeenCalledWith(
      expect.stringContaining("hotel=Hilton")
    );
    expect(fakeFetch).toHaveBeenCalledWith(
      expect.stringContaining("checkin=2025-12-01")
    );
    expect(fakeFetch).toHaveBeenCalledWith(
      expect.stringContaining("checkout=2025-12-05")
    );
    expect(fakeFetch).toHaveBeenCalledWith(expect.stringContaining("guests=3"));
  });
});

//
// 3) LandingPage Search end-to-end
//
describe("LandingPage Search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  test("fails when both location & hotel missing", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith(
      "Enter a location or hotel name."
    );
  });

  test("proceeds with valid filters", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Singapore" },
    });

    fireEvent.click(screen.getByText("Checkin"));
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2025-08-01" },
    });

    fireEvent.click(screen.getByText("Checkout"));
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2025-08-05" },
    });

    fireEvent.click(screen.getByText("Guests"));
    fireEvent.change(container.querySelector('input[type="number"]'), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Search"));

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("location=Singapore")
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
    expect(global.alert).not.toHaveBeenCalled();
  });

  test("alerts if no dates are selected", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Paris" },
    });

    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
  });

  test("alerts if only check-in is selected", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Paris" },
    });
    fireEvent.click(screen.getByText("Checkin"));
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2025-09-01" },
    });

    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
  });

  test("still navigates when guest count is blank", () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Tokyo" },
    });
    fireEvent.click(screen.getByText("Checkin"));
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2025-10-01" },
    });
    fireEvent.click(screen.getByText("Checkout"));
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2025-10-05" },
    });

    fireEvent.click(screen.getByText("Guests"));
    fireEvent.change(container.querySelector('input[type="number"]'), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Search"));

    expect(global.alert).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("guests=")
    );
  });
});
