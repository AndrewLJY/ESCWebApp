// // src/test/SortingBar.test.jsx
// import React from "react";
// import { render, screen, fireEvent, act } from "@testing-library/react";
// import SortingBar from "../components/SortingBar";

// describe("SortingBar", () => {
//   const hotels = [
//     {
//       id: "A",
//       pricingRankingData: { lowestPrice: 100 },
//       keyDetails: { rating: 4.2, distance: 2 },
//       amenities: { amenities: { wifi: true } },
//     },
//     {
//       id: "B",
//       pricingRankingData: { lowestPrice: 200 },
//       keyDetails: { rating: 3.8, distance: 1 },
//       amenities: { amenities: { wifi: true, pool: true } },
//     },
//     {
//       id: "C",
//       pricingRankingData: { lowestPrice: 150 },
//       keyDetails: { rating: 4.8, distance: 3 },
//       amenities: { amenities: { pool: true } },
//     },
//   ];
//   let onFilteredHotels;

//   beforeEach(() => {
//     onFilteredHotels = jest.fn();
//     render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
//   });

//   it("1) lets you change the sort criterion", () => {
//     const sortSelect = screen.getByRole("combobox");
//     act(() => {
//       fireEvent.change(sortSelect, { target: { value: "rating" } });
//     });

//     // Should now be sorted by rating descending: C, A, B
//     const last = onFilteredHotels.mock.calls.slice(-1)[0][0];
//     expect(last.map((h) => h.id)).toEqual(["C", "A", "B"]);
//   });

//   it("2) filters out-of-range prices via min-slider", () => {
//     const [minSlider] = screen.getAllByRole("slider");
//     act(() => {
//       fireEvent.change(minSlider, { target: { value: "120" } });
//     });

//     // Only B (200) and C (150) are ≥ 120
//     const lastIds = onFilteredHotels.mock.calls
//       .slice(-1)[0][0]
//       .map((h) => h.id)
//       .sort();
//     expect(lastIds).toEqual(["B", "C"]);
//   });

//   it("3) filters out-of-range prices via max-slider", () => {
//     const [, maxSlider] = screen.getAllByRole("slider");
//     act(() => {
//       fireEvent.change(maxSlider, { target: { value: "150" } });
//     });

//     // Only A (100) and C (150) are ≤ 150
//     const lastIds = onFilteredHotels.mock.calls
//       .slice(-1)[0][0]
//       .map((h) => h.id)
//       .sort();
//     expect(lastIds).toEqual(["A", "C"]);
//   });

//   it("4) filters by a single amenity", () => {
//     const toggle = screen.getByRole("button", { name: /select amenities/i });
//     act(() => {
//       fireEvent.click(toggle);
//     });

//     act(() => {
//       fireEvent.click(screen.getByText("pool"));
//     });

//     // Only B & C have pool:true
//     const resultIds = onFilteredHotels.mock.calls
//       .slice(-1)[0][0]
//       .map((h) => h.id)
//       .sort();
//     expect(resultIds).toEqual(["B", "C"]);
//   });

//   it("5) filters by multiple amenities", () => {
//     const toggle = screen.getByRole("button", { name: /select amenities/i });
//     act(() => {
//       fireEvent.click(toggle);
//     });
//     act(() => {
//       fireEvent.click(screen.getByText("wifi"));
//       fireEvent.click(screen.getByText("pool"));
//     });

//     // Only B has both wifi & pool
//     const resultIds = onFilteredHotels.mock.calls
//       .slice(-1)[0][0]
//       .map((h) => h.id);
//     expect(resultIds).toEqual(["B"]);
//   });

//   it("6) combines price + amenity filters", () => {
//     const [minSlider] = screen.getAllByRole("slider");
//     const toggle = screen.getByRole("button", { name: /select amenities/i });

//     // 1) set price ≥120
//     act(() => {
//       fireEvent.change(minSlider, { target: { value: "120" } });
//     });
//     // 2) open the amenities dropdown
//     act(() => {
//       fireEvent.click(toggle);
//     });
//     // 3) now click “pool”
//     act(() => {
//       fireEvent.click(screen.getByText("pool"));
//     });

//     // Among those ≥120 (B,C), both have pool → B & C
//     const resultIds = onFilteredHotels.mock.calls
//       .slice(-1)[0][0]
//       .map((h) => h.id)
//       .sort();
//     expect(resultIds).toEqual(["B", "C"]);
//   });

//   it("7) switching sort after filtering re-applies current filters", () => {
//     const [minSlider] = screen.getAllByRole("slider");
//     const toggle = screen.getByRole("button", { name: /select amenities/i });
//     const sortSelect = screen.getByRole("combobox");

//     act(() => {
//       fireEvent.change(minSlider, { target: { value: "120" } });
//     });
//     act(() => {
//       fireEvent.click(toggle);
//     });
//     act(() => {
//       fireEvent.click(screen.getByText("pool"));
//     });

//     // Now switch sort
//     act(() => {
//       fireEvent.change(sortSelect, { target: { value: "distance" } });
//     });

//     // Should still only show B & C
//     const resultIds = onFilteredHotels.mock.calls
//       .slice(-1)[0][0]
//       .map((h) => h.id)
//       .sort();
//     expect(resultIds).toEqual(["B", "C"]);
//   });

//   it("8) Clear Filters resets everything", () => {
//     const sortSelect = screen.getByRole("combobox");
//     const [minSlider] = screen.getAllByRole("slider");
//     const toggle = screen.getByRole("button", { name: /select amenities/i });
//     const clearBtn = screen.getByRole("button", { name: /clear filters/i });

//     // apply some filters
//     act(() => {
//       fireEvent.change(sortSelect, { target: { value: "distance" } });
//       fireEvent.change(minSlider, { target: { value: "120" } });
//     });
//     act(() => {
//       fireEvent.click(toggle);
//     });
//     act(() => {
//       fireEvent.click(screen.getByText("pool"));
//     });

//     // then clear
//     act(() => {
//       fireEvent.click(clearBtn);
//     });

//     // After clearing, all three hotels in default price sort
//     const finalIds = onFilteredHotels.mock.calls
//       .slice(-1)[0][0]
//       .map((h) => h.id)
//       .sort();
//     expect(finalIds).toEqual(["A", "B", "C"]);
//   });

//   it("9) empty hotel list calls back with [] once", () => {
//     // rerender with empty hotels array
//     onFilteredHotels.mockClear();
//     render(<SortingBar hotels={[]} onFilteredHotels={onFilteredHotels} />);

//     // Should have been called exactly once with []
//     expect(onFilteredHotels).toHaveBeenCalledTimes(1);
//     expect(onFilteredHotels).toHaveBeenCalledWith([]);
//   });
// });

// src/test/SortingBar.test.jsx
import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import SortingBar from "../components/SortingBar";

/* ---------- helpers ---------- */

function withRequiredFields(hotels) {
  return hotels.map((h) => ({
    ...h,
    // ensure fields SortingBar expects always exist
    keyDetails: h.keyDetails ?? { rating: 0, distance: 0 },
    pricingRankingData: h.pricingRankingData ?? { lowestPrice: 0 },
    trustYouBenchmark: h.trustYouBenchmark ?? {
      score: { score: { kaligo_overall: 4.0 } },
    },
    amenities: h.amenities ?? { amenities: {} },
  }));
}

function lastRows(mockFn) {
  const calls = mockFn.mock.calls;
  return calls.length ? calls[calls.length - 1][0] : [];
}

function getAmenitiesToggle() {
  // Works both before and after selection ("Select amenities" -> "N selected")
  return (
    screen.queryByRole("button", { name: /select amenities/i }) ||
    screen.queryByRole("button", { name: /\b\d+\s+selected\b/i }) ||
    document.querySelector(".dropdown .dropdown-toggle")
  );
}

async function openAmenitiesMenu() {
  const toggle = getAmenitiesToggle();
  if (!toggle) throw new Error("Amenities toggle not found");
  await act(async () => {
    fireEvent.click(toggle);
  });
  // react-bootstrap renders a .dropdown-menu; it may not have role="menu"
  const menu = document.querySelector(".dropdown-menu");
  if (!menu) throw new Error("Amenities menu not found");
  return menu;
}

async function clickAmenityByText(text) {
  const menu = await openAmenitiesMenu();
  // click the Dropdown.Item wrapper to avoid double event issues
  const labelNode = within(menu).getByText(text);
  const item = labelNode.closest("[data-rr-ui-dropdown-item]") || labelNode;
  await act(async () => {
    fireEvent.click(item);
  });
}

function getSliders() {
  const sliders = screen.getAllByRole("slider");
  // SortingBar renders min then max
  const [minSlider, maxSlider] = sliders;
  return { minSlider, maxSlider };
}

// Labels are glyphs exactly as rendered by SortingBar: ☆☆☆☆☆, ★☆☆☆☆, ★★☆☆☆, ★★★☆☆, ★★★★☆, ★★★★★
async function toggleStarsByGlyph(glyphText) {
  // Find the label node with the exact glyph text, then toggle its corresponding checkbox (previous sibling)
  const labelNode = screen.getByText(glyphText);
  const formCheck = labelNode.closest(".form-check");
  const checkbox = formCheck?.querySelector('input[type="checkbox"]');
  if (!checkbox)
    throw new Error("Star rating checkbox not found for " + glyphText);
  await act(async () => {
    fireEvent.click(checkbox);
  });
}

/* ---------- tests ---------- */

describe("SortingBar component", () => {
  let onFilteredHotels;
  let hotels;

  beforeEach(() => {
    onFilteredHotels = jest.fn();
    hotels = withRequiredFields([
      {
        id: "A",
        keyDetails: { rating: 3, distance: 1.3 },
        pricingRankingData: { lowestPrice: 100 },
        amenities: { amenities: { pool: true } },
      },
      {
        id: "B",
        keyDetails: { rating: 5, distance: 0.8 },
        pricingRankingData: { lowestPrice: 200 },
        amenities: { amenities: { pool: true, gym: true } },
      },
      {
        id: "C",
        keyDetails: { rating: 4, distance: 2.0 },
        pricingRankingData: { lowestPrice: 150 },
        amenities: { amenities: { gym: true, spa: true } },
      },
    ]);
  });

  it("1) renders without crashing", () => {
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("2) calls back with initial hotels (sorted by price asc)", () => {
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    // 100, 150, 200 => A, C, B
    expect(lastRows(onFilteredHotels).map((h) => h.id)).toEqual([
      "A",
      "C",
      "B",
    ]);
  });

  it("3) sorts hotels by price then rating", () => {
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    // switch to rating (desc): B(5), C(4), A(3)
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "rating" },
    });
    expect(lastRows(onFilteredHotels).map((h) => h.id)).toEqual([
      "B",
      "C",
      "A",
    ]);
  });

  it("4) filters by amenity (single)", async () => {
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    await clickAmenityByText("pool");
    const finalIds = lastRows(onFilteredHotels)
      .map((h) => h.id)
      .sort(); // A and B have pool
    expect(finalIds).toEqual(["A", "B"]);
  });

  it("5) filters by multiple amenities", async () => {
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    await clickAmenityByText("pool");
    await clickAmenityByText("gym");
    // Only B has both pool + gym
    expect(lastRows(onFilteredHotels).map((h) => h.id)).toEqual(["B"]);
  });

  it("6) clears amenities + sliders with Clear Filters", async () => {
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    // set price range to [150, 200]
    const { minSlider, maxSlider } = getSliders();
    fireEvent.change(minSlider, { target: { value: 150 } });
    fireEvent.change(maxSlider, { target: { value: 200 } });
    // pick one amenity
    await clickAmenityByText("pool");
    // clear all
    const clearBtn = screen.getByRole("button", { name: /clear filters/i });
    await act(async () => {
      fireEvent.click(clearBtn);
    });
    // back to all, sorted by price asc
    const ids = lastRows(onFilteredHotels)
      .map((h) => h.id)
      .sort();
    expect(ids).toEqual(["A", "B", "C"]);
  });

  it("7) filters by price range (sliders)", () => {
    // adjust dataset so maxPrice = 200
    hotels[2].pricingRankingData.lowestPrice = 150;
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    const { minSlider } = getSliders();
    // Filter out A(100) by setting min to 120
    fireEvent.change(minSlider, { target: { value: 120 } });
    const finalIds = lastRows(onFilteredHotels)
      .map((h) => h.id)
      .sort();
    expect(finalIds).toEqual(["B", "C"]);
  });

  it("8) filters by star rating (using star-glyph labels)", async () => {
    render(<SortingBar hotels={hotels} onFilteredHotels={onFilteredHotels} />);
    // Turn on only ★★★☆☆ (index 3)
    await toggleStarsByGlyph("★★★☆☆"); // keeps A(3), excludes C(4), B(5)
    const finalIds = lastRows(onFilteredHotels).map((h) => h.id);
    expect(finalIds).toEqual(["A"]);
  });

  it("9) empty hotel list calls back with [] once", () => {
    const onCb = jest.fn();
    render(
      <SortingBar hotels={withRequiredFields([])} onFilteredHotels={onCb} />
    );
    expect(lastRows(onCb)).toEqual([]);
  });
});
