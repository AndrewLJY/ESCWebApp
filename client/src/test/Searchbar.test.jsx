// src/test/Searchbar.test.jsx
jest.mock("../assets/ascenda_logo.png", () => "mock-logo.png");

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import LandingPage from "../pages/LandingPage";
import axios from "axios";
import { act } from "react-dom/test-utils";

const BACKEND_URL = process.env.REACT_APP_API_URL;

// ─── Mock navigate ─────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("axios");

describe("1) SearchBar Autocomplete", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    axios.get.mockClear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("landing mode: opens Location, types → debounce → shows suggestions", async () => {
    axios.get.mockResolvedValueOnce({
      data: ["Paris", "Parma", "Paradise"],
    });
    const fakeFetch = jest.fn();
    render(
      <MemoryRouter>
        <SearchBar isSearchPage={false} fetchData={fakeFetch} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Location"));
    const locInput = screen.getByRole("textbox");
    fireEvent.change(locInput, { target: { value: "Par" } });

    act(() => jest.advanceTimersByTime(300));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${BACKEND_URL}/search/string/Par`
      );
      ["Paris", "Parma", "Paradise"].forEach((s) =>
        expect(screen.getByText(s)).toBeInTheDocument()
      );
    });
  });

  it("allows selecting a suggestion to fill the input", async () => {
    axios.get.mockResolvedValueOnce({ data: ["Berlin", "Bern"] });
    render(
      <MemoryRouter>
        <SearchBar isSearchPage={false} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Location"));
    const locInput = screen.getByRole("textbox");
    fireEvent.change(locInput, { target: { value: "Be" } });
    act(() => jest.advanceTimersByTime(300));

    await waitFor(() => {
      expect(screen.getByText("Berlin")).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByText("Berlin"));
    expect(locInput.value).toBe("Berlin");
    expect(screen.queryByText("Bern")).toBeNull();
  });

  it("search-page mode: same debounce + suggestions", async () => {
    axios.get.mockResolvedValueOnce({
      data: ["Rome", "Roma", "Romulus"],
    });
    const fakeFetch = jest.fn();
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchBar isSearchPage={true} search="" fetchData={fakeFetch} />
      </MemoryRouter>
    );

    const locInput = screen.getByPlaceholderText("Location");
    fireEvent.change(locInput, { target: { value: "Ro" } });
    act(() => jest.advanceTimersByTime(300));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `${BACKEND_URL}/search/string/Ro`
      );
      ["Rome", "Roma", "Romulus"].forEach((s) =>
        expect(screen.getByText(s)).toBeInTheDocument()
      );
    });
  });
});

describe("2) SearchBar Search (search‐page)", () => {
  let container, fakeFetch;
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
    fakeFetch = jest.fn();
    ({ container } = render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchBar isSearchPage={true} search="" fetchData={fakeFetch} />
      </MemoryRouter>
    ));
  });

  test("alerts when both Location & Hotel are blank", () => {
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith(
      "Enter a location, Hotel name is optional."
    );
    expect(fakeFetch).not.toHaveBeenCalled();
  });

  test("hotel-only → still asks for dates", () => {
    fireEvent.change(screen.getByPlaceholderText("Hotel Name"), {
      target: { value: "Hilton" },
    });
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
  });

  test("location-only → still asks for dates", () => {
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Osaka" },
    });
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
  });

  test("rooms field is optional", () => {
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Osaka" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hotel Name"), {
      target: { value: "Hilton" },
    });
    const dates = container.querySelectorAll('input[type="date"]');
    fireEvent.change(dates[0], { target: { value: "2025-12-01" } });
    fireEvent.change(dates[1], { target: { value: "2025-12-05" } });
    const nums = container.querySelectorAll('input[type="number"]');
    fireEvent.change(nums[0], { target: { value: "3" } });
    fireEvent.click(screen.getByText("Search"));

    expect(global.alert).not.toHaveBeenCalled();
    expect(fakeFetch).toHaveBeenCalledWith(expect.stringContaining("roomNum="));
  });

  test("full valid → calls fetchData with guests & rooms", () => {
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Osaka" },
    });
    fireEvent.change(screen.getByPlaceholderText("Hotel Name"), {
      target: { value: "Hilton" },
    });
    const dates = container.querySelectorAll('input[type="date"]');
    fireEvent.change(dates[0], { target: { value: "2025-12-01" } });
    fireEvent.change(dates[1], { target: { value: "2025-12-05" } });
    const nums = container.querySelectorAll('input[type="number"]');
    fireEvent.change(nums[0], { target: { value: "3" } });
    fireEvent.change(nums[1], { target: { value: "2" } });
    fireEvent.click(screen.getByText("Search"));

    expect(global.alert).not.toHaveBeenCalled();
    expect(fakeFetch).toHaveBeenCalledWith(expect.stringContaining("guests=3"));
    expect(fakeFetch).toHaveBeenCalledWith(
      expect.stringContaining("roomNum=2")
    );
  });
});

describe("3) SearchBar Search (landing‐page)", () => {
  let container;
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
    ({ container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    ));
  });

  test("alerts when both location & hotel missing", () => {
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith(
      "Enter a location, Hotel name is optional."
    );
  });

  test("hotel-only → still asks for dates", () => {
    fireEvent.click(screen.getByText("Hotel"));
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Marriott" },
    });
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
  });

  test("location-only → still asks for dates", () => {
    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Paris" },
    });
    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith("Pick check-in and check-out.");
  });

  test("rooms field is optional", () => {
    const btns = container.querySelectorAll(".filter-btn");
    fireEvent.click(btns[0]);
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Tokyo" },
    });
    fireEvent.click(btns[2]);
    let dateInput = container.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2025-09-01" } });
    fireEvent.click(btns[3]);
    dateInput = container.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2025-09-05" } });
    fireEvent.click(btns[4]);
    fireEvent.change(container.querySelector('input[type="number"]'), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByText("Search"));

    expect(global.alert).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("roomNum=")
    );
  });

  test("full valid → navigates with guests & default rooms", () => {
    const btns = container.querySelectorAll(".filter-btn");
    fireEvent.click(btns[0]);
    fireEvent.change(container.querySelector('input[type="text"]'), {
      target: { value: "Singapore" },
    });
    fireEvent.click(btns[2]);
    let dateInput = container.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2025-08-01" } });
    fireEvent.click(btns[3]);
    dateInput = container.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: "2025-08-05" } });
    fireEvent.click(btns[4]);
    fireEvent.change(container.querySelector('input[type="number"]'), {
      target: { value: "4" },
    });
    fireEvent.click(screen.getByText("Search"));

    expect(global.alert).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("guests=4")
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("roomNum=")
    );
  });
});

describe("4) Date-picker rules", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("search-page: checkin min is today+3 and checkout auto-min is checkin+1", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2025-01-01T00:00:00Z"));

    const fakeFetch = jest.fn();
    const { container } = render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchBar isSearchPage={true} search="" fetchData={fakeFetch} />
      </MemoryRouter>
    );

    const [checkinInput, checkoutInput] =
      container.querySelectorAll('input[type="date"]');

    expect(checkinInput).toHaveAttribute("min", "2025-01-04");
    expect(checkoutInput).toHaveAttribute("min", "2025-01-04");

    fireEvent.change(checkinInput, { target: { value: "2025-02-10" } });
    expect(checkoutInput).toHaveAttribute("min", "2025-02-11");
  });

  test("landing-page: checkin min is today+3 and checkout auto-min is checkin+1", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2025-06-15T00:00:00Z"));

    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const btns = container.querySelectorAll(".filter-btn");

    fireEvent.click(btns[2]);
    let dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).toHaveAttribute("min", "2025-06-18");

    fireEvent.change(dateInput, { target: { value: "2025-07-20" } });

    fireEvent.click(btns[3]);
    dateInput = container.querySelector('input[type="date"]');
    expect(dateInput).toHaveAttribute("min", "2025-07-21");
  });
});
