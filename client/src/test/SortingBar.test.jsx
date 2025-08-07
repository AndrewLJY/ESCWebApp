// src/test/SortingBar.test.jsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SortingBar from "../components/SortingBar";

describe("SortingBar", () => {
  const hotels = [
    {
      id: "A",
      pricingRankingData: { lowestPrice: 100 },
      keyDetails: { rating: 4.2, distance: 2 },
      amenities: { amenities: { wifi: true } },
    },
    {
      id: "B",
      pricingRankingData: { lowestPrice: 200 },
      keyDetails: { rating: 3.8, distance: 1 },
      amenities: { amenities: { wifi: true, pool: true } },
    },
    {
      id: "C",
      pricingRankingData: { lowestPrice: 150 },
      keyDetails: { rating: 4.8, distance: 3 },
      amenities: { amenities: { pool: true } },
    },
  ];
  let onFilteredHotels;

  beforeEach(() => {
    onFilteredHotels = jest.fn();
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
  });

  it("1) lets you change the sort criterion", () => {
    const sortSelect = screen.getByRole("combobox");
    act(() => {
      fireEvent.change(sortSelect, { target: { value: "rating" } });
    });

    // Should now be sorted by rating descending: C, A, B
    const last = onFilteredHotels.mock.calls.slice(-1)[0][0];
    expect(last.map((h) => h.id)).toEqual(["C", "A", "B"]);
  });

  it("2) filters out-of-range prices via min-slider", () => {
    const [minSlider] = screen.getAllByRole("slider");
    act(() => {
      fireEvent.change(minSlider, { target: { value: "120" } });
    });

    // Only B (200) and C (150) are ≥ 120
    const lastIds = onFilteredHotels.mock.calls
      .slice(-1)[0][0]
      .map((h) => h.id)
      .sort();
    expect(lastIds).toEqual(["B", "C"]);
  });

  it("3) filters out-of-range prices via max-slider", () => {
    const [, maxSlider] = screen.getAllByRole("slider");
    act(() => {
      fireEvent.change(maxSlider, { target: { value: "150" } });
    });

    // Only A (100) and C (150) are ≤ 150
    const lastIds = onFilteredHotels.mock.calls
      .slice(-1)[0][0]
      .map((h) => h.id)
      .sort();
    expect(lastIds).toEqual(["A", "C"]);
  });

  it("4) filters by a single amenity", () => {
    const toggle = screen.getByRole("button", { name: /select amenities/i });
    act(() => {
      fireEvent.click(toggle);
    });

    act(() => {
      fireEvent.click(screen.getByText("pool"));
    });

    // Only B & C have pool:true
    const resultIds = onFilteredHotels.mock.calls
      .slice(-1)[0][0]
      .map((h) => h.id)
      .sort();
    expect(resultIds).toEqual(["B", "C"]);
  });

  it("5) filters by multiple amenities", () => {
    const toggle = screen.getByRole("button", { name: /select amenities/i });
    act(() => {
      fireEvent.click(toggle);
    });
    act(() => {
      fireEvent.click(screen.getByText("wifi"));
      fireEvent.click(screen.getByText("pool"));
    });

    // Only B has both wifi & pool
    const resultIds = onFilteredHotels.mock.calls
      .slice(-1)[0][0]
      .map((h) => h.id);
    expect(resultIds).toEqual(["B"]);
  });

  it("6) combines price + amenity filters", () => {
    const [minSlider] = screen.getAllByRole("slider");
    const toggle = screen.getByRole("button", { name: /select amenities/i });

    // 1) set price ≥120
    act(() => {
      fireEvent.change(minSlider, { target: { value: "120" } });
    });
    // 2) open the amenities dropdown
    act(() => {
      fireEvent.click(toggle);
    });
    // 3) now click “pool”
    act(() => {
      fireEvent.click(screen.getByText("pool"));
    });

    // Among those ≥120 (B,C), both have pool → B & C
    const resultIds = onFilteredHotels.mock.calls
      .slice(-1)[0][0]
      .map((h) => h.id)
      .sort();
    expect(resultIds).toEqual(["B", "C"]);
  });

  it("7) switching sort after filtering re-applies current filters", () => {
    const [minSlider] = screen.getAllByRole("slider");
    const toggle = screen.getByRole("button", { name: /select amenities/i });
    const sortSelect = screen.getByRole("combobox");

    act(() => {
      fireEvent.change(minSlider, { target: { value: "120" } });
    });
    act(() => {
      fireEvent.click(toggle);
    });
    act(() => {
      fireEvent.click(screen.getByText("pool"));
    });

    // Now switch sort
    act(() => {
      fireEvent.change(sortSelect, { target: { value: "distance" } });
    });

    // Should still only show B & C
    const resultIds = onFilteredHotels.mock.calls
      .slice(-1)[0][0]
      .map((h) => h.id)
      .sort();
    expect(resultIds).toEqual(["B", "C"]);
  });

  it("8) Clear Filters resets everything", () => {
    const sortSelect = screen.getByRole("combobox");
    const [minSlider] = screen.getAllByRole("slider");
    const toggle = screen.getByRole("button", { name: /select amenities/i });
    const clearBtn = screen.getByRole("button", { name: /clear filters/i });

    // apply some filters
    act(() => {
      fireEvent.change(sortSelect, { target: { value: "distance" } });
      fireEvent.change(minSlider, { target: { value: "120" } });
    });
    act(() => {
      fireEvent.click(toggle);
    });
    act(() => {
      fireEvent.click(screen.getByText("pool"));
    });

    // then clear
    act(() => {
      fireEvent.click(clearBtn);
    });

    // After clearing, all three hotels in default price sort
    const finalIds = onFilteredHotels.mock.calls
      .slice(-1)[0][0]
      .map((h) => h.id)
      .sort();
    expect(finalIds).toEqual(["A", "B", "C"]);
  });

  it("9) empty hotel list calls back with [] once", () => {
    // rerender with empty hotels array
    onFilteredHotels.mockClear();
    render(<SortingBar hotels={[]} onFilteredHotels={onFilteredHotels} />);

    // Should have been called exactly once with []
    expect(onFilteredHotels).toHaveBeenCalledTimes(1);
    expect(onFilteredHotels).toHaveBeenCalledWith([]);
  });
});
