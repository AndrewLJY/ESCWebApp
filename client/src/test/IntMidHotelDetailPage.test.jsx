// // Integration test (component-level):
// // Verifies HotelDetailPage + Header + BookmarkButton interaction,
// // routing, auth-driven rendering, payload flow, and UI controls,
// // with external services mocked.

// import {
//   render,
//   screen,
//   fireEvent,
//   waitFor,
//   within,
// } from "@testing-library/react";
// import { MemoryRouter, Routes, Route } from "react-router-dom";

// // --- Light stubs so JSDOM doesn't load heavy libs ---
// jest.mock("@vis.gl/react-google-maps", () => {
//   const React = require("react");
//   return {
//     APIProvider: ({ children }) =>
//       React.createElement("div", { "data-testid": "api-provider" }, children),
//     Map: ({ children }) =>
//       React.createElement("div", { "data-testid": "map" }, children),
//     AdvancedMarker: () =>
//       React.createElement("div", { "data-testid": "marker" }),
//     MapControl: () =>
//       React.createElement("div", { "data-testid": "map-control" }),
//     ControlPosition: { BOTTOM_LEFT: "BOTTOM_LEFT" },
//   };
// });

// jest.mock("@fortawesome/react-fontawesome", () => {
//   const React = require("react");
//   return {
//     FontAwesomeIcon: (props) =>
//       React.createElement("i", { "data-testid": "fa-icon", ...props }),
//   };
// });

// // Mock the HOTEL bookmark button (per-hotel)
// jest.mock("../components/BookmarkButton", () => {
//   const React = require("react");
//   return {
//     __esModule: true,
//     default: ({ hotel }) =>
//       React.createElement(
//         "button",
//         { "aria-label": "bookmark", "data-hotelid": hotel?.hotel_id },
//         "Bookmark"
//       ),
//   };
// });

// // Mock Header with only Login/Logout (no header-level bookmark)
// jest.mock("../components/header.jsx", () => {
//   const React = require("react");
//   return {
//     __esModule: true,
//     default: function Header() {
//       return React.createElement(
//         React.Fragment,
//         null,
//         React.createElement(
//           "button",
//           {
//             onClick: () => {
//               const ls = globalThis.localStorage;
//               ls.setItem(
//                 "user",
//                 JSON.stringify({
//                   id: "u1",
//                   username: "joe",
//                   email: "joe@ex.com",
//                 })
//               );
//               ls.setItem("token", "tok123");
//             },
//           },
//           "Login"
//         ),
//         React.createElement(
//           "button",
//           {
//             onClick: () => {
//               const ls = globalThis.localStorage;
//               ls.removeItem("user");
//               ls.removeItem("token");
//             },
//           },
//           "Logout"
//         )
//       );
//     },
//   };
// });

// // Mock backend middleware
// const mockGetHotelDetailsAPI = jest.fn();
// const mockGetRoomPricingAPI = jest.fn();
// jest.mock("../middleware/hotelDetailsApi", () => ({
//   getHotelDetailsAPI: (...args) => mockGetHotelDetailsAPI(...args),
//   getRoomPricingAPI: (...args) => mockGetRoomPricingAPI(...args),
// }));

// // Import REAL page after mocks
// import HotelDetailPage from "../pages/HotelDetailPage";

// function renderWithRouter(entry) {
//   return render(
//     <MemoryRouter initialEntries={[entry]}>
//       <Routes>
//         <Route path="/hotel/:id" element={<HotelDetailPage />} />
//       </Routes>
//     </MemoryRouter>
//   );
// }

// describe("HotelDetailPage (mocked middleware + auth)", () => {
//   const initialState = {
//     destinationId: 999,
//     hotelDetails: {
//       keyDetails: {
//         id: "123",
//         name: "Mock Hotel From State",
//         address: "123 Mock St",
//         rating: 4,
//         hotel_price: 150,
//       },
//       imageDetails: { stitchedImageUrls: ["https://example.com/stitched.jpg"] },
//     },
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     globalThis.localStorage?.clear?.();

//     mockGetHotelDetailsAPI.mockResolvedValue({
//       data: {
//         hotel: {
//           keyDetails: {
//             id: "123",
//             name: "Mock Hotel",
//             address: "123 Mock St",
//             rating: 4,
//           },
//           description: "Mock description for testing.",
//           amenities: { wifi: true, parking: false, pool: true },
//           image_details: {
//             count: 2,
//             prefix: "https://example.com/img-",
//             suffix: ".jpg",
//           },
//           latitude: 1.3521,
//           longitude: 103.8198,
//         },
//       },
//     });

//     mockGetRoomPricingAPI.mockResolvedValue({
//       data: [
//         {
//           keyRoomDetails: {
//             keyId: "r1",
//             name: "Mock Room",
//             roomDescription: "Room Description",
//             roomImages: [{ url: "https://example.com/room1.jpg" }],
//             freeCancellation: true,
//           },
//           priceDetails: { price: 100 },
//         },
//       ],
//     });
//   });

//   test("loads hotel details, shows rooms, and renders map placeholders", async () => {
//     renderWithRouter({
//       pathname: "/hotel/123",
//       search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
//       state: initialState,
//     });

//     // Spinner first
//     expect(screen.getByRole("status")).toBeInTheDocument();

//     // Hotel title appears after load
//     expect(
//       await screen.findByRole("heading", { name: /mock hotel/i })
//     ).toBeInTheDocument();

//     // Address, stars
//     expect(screen.getByText(/123 mock st/i)).toBeInTheDocument();
//     expect(screen.getByText("★★★★")).toBeInTheDocument();

//     // Room list data
//     expect(await screen.findByText(/room description/i)).toBeInTheDocument();
//     expect(screen.getByText(/sgd 100/i)).toBeInTheDocument();

//     // Map stubs
//     expect(screen.getByTestId("api-provider")).toBeInTheDocument();
//     expect(screen.getByTestId("map")).toBeInTheDocument();
//     expect(screen.getByTestId("marker")).toBeInTheDocument();

//     // Middleware calls
//     expect(mockGetHotelDetailsAPI).toHaveBeenCalledWith("123");
//     expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(1);
//   });

//   test("renders Header and the search bar controls", async () => {
//     renderWithRouter({
//       pathname: "/hotel/123",
//       search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
//       state: initialState,
//     });

//     // Header rendered (from mock)
//     expect(screen.getByText("Login")).toBeInTheDocument();
//     expect(screen.getByText("Logout")).toBeInTheDocument();

//     // Wait for hotel to load so the page content is present
//     await screen.findByRole("heading", { name: /mock hotel/i });

//     // Search bar container exists
//     const searchBar = document.querySelector(".search-bar-wrapper");
//     expect(searchBar).toBeInTheDocument();

//     // Labels and inputs (labels aren't associated, so assert texts + inputs via id)
//     expect(screen.getByText(/check in:/i)).toBeInTheDocument();
//     expect(screen.getByText(/check out:/i)).toBeInTheDocument();
//     expect(screen.getByText(/guests:/i)).toBeInTheDocument();
//     expect(screen.getByText(/rooms:/i)).toBeInTheDocument();

//     expect(document.getElementById("filter-checkin")).toBeInTheDocument();
//     expect(document.getElementById("filter-checkout")).toBeInTheDocument();
//     expect(document.getElementById("filter-guests")).toBeInTheDocument();
//     expect(document.getElementById("filter-roomNum")).toBeInTheDocument();

//     // Modify button present
//     expect(screen.getByRole("button", { name: /modify/i })).toBeInTheDocument();
//   });

//   test("shows HOTEL bookmark only after login", async () => {
//     const entry = {
//       pathname: "/hotel/123",
//       search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
//       state: initialState,
//     };

//     renderWithRouter(entry);

//     // Wait for hotel header
//     const heading = await screen.findByRole("heading", { name: /mock hotel/i });
//     const detailHeader = heading.closest(".detail-header") || document.body;

//     // Logged out → no per-hotel bookmark present
//     expect(within(detailHeader).queryByLabelText(/bookmark/i)).toBeNull();

//     // Login via mocked Header (page auto re-renders due to auth watcher)
//     fireEvent.click(screen.getByText("Login"));

//     // Now the per-hotel bookmark button should be present
//     const hotelBookmark = await within(detailHeader).findByLabelText(
//       /bookmark/i
//     );
//     expect(hotelBookmark).toBeInTheDocument();
//     expect(hotelBookmark).toHaveAttribute("data-hotelid", "123");
//   });

//   test("calls getRoomPricingAPI with id and payload from URL/state", async () => {
//     renderWithRouter({
//       pathname: "/hotel/123",
//       search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
//       state: initialState,
//     });

//     await screen.findByRole("heading", { name: /mock hotel/i });

//     expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(1);
//     const [idArg, payloadArg] = mockGetRoomPricingAPI.mock.calls[0];

//     expect(idArg).toBe("123");
//     expect(payloadArg).toMatchObject({
//       location: "",
//       hotel: "Mock Hotel From State",
//       checkIn: "2025-08-20",
//       checkOut: "2025-08-23",
//       guests: 2,
//       roomNum: 1,
//       destinationId: 999,
//     });
//   });

//   test("Modify fetches again with updated payload (Guests changed)", async () => {
//     renderWithRouter({
//       pathname: "/hotel/123",
//       search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
//       state: initialState,
//     });

//     await screen.findByRole("heading", { name: /mock hotel/i });
//     expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(1);

//     // Labels aren't associated via htmlFor; target by id
//     const guestsInput = document.getElementById("filter-guests");
//     fireEvent.change(guestsInput, { target: { value: "3" } });

//     fireEvent.click(screen.getByRole("button", { name: /modify/i }));

//     await waitFor(() => expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(2));

//     const [, secondPayload] = mockGetRoomPricingAPI.mock.calls[1];
//     expect(secondPayload.guests === 3 || secondPayload.guests === "3").toBe(
//       true
//     );
//   });

//   test("unauthenticated Book shows login toast", async () => {
//     renderWithRouter({
//       pathname: "/hotel/123",
//       search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
//       state: initialState,
//     });

//     await screen.findByRole("heading", { name: /mock hotel/i });

//     fireEvent.click(screen.getByRole("button", { name: /book/i }));

//     expect(
//       await screen.findByText(/please login to book a room/i)
//     ).toBeInTheDocument();
//   });
// });

// Integration test (component-level):
// Verifies HotelDetailPage + Header + BookmarkButton interaction,
// routing, auth-driven rendering, payload flow, and UI controls,
// with external services mocked.

import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";

// --- Light stubs so JSDOM doesn't load heavy libs ---
jest.mock("@vis.gl/react-google-maps", () => {
  const React = require("react");
  return {
    APIProvider: ({ children }) =>
      React.createElement("div", { "data-testid": "api-provider" }, children),
    Map: ({ children }) =>
      React.createElement("div", { "data-testid": "map" }, children),
    AdvancedMarker: () =>
      React.createElement("div", { "data-testid": "marker" }),
    MapControl: () =>
      React.createElement("div", { "data-testid": "map-control" }),
    ControlPosition: { BOTTOM_LEFT: "BOTTOM_LEFT" },
  };
});

jest.mock("@fortawesome/react-fontawesome", () => {
  const React = require("react");
  return {
    FontAwesomeIcon: (props) =>
      React.createElement("i", { "data-testid": "fa-icon", ...props }),
  };
});

// Mock the HOTEL bookmark button (per-hotel)
jest.mock("../components/BookmarkButton", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ hotel }) =>
      React.createElement(
        "button",
        { "aria-label": "bookmark", "data-hotelid": hotel?.hotel_id },
        "Bookmark"
      ),
  };
});

// Mock Header with only Login/Logout (no header-level bookmark)
jest.mock("../components/header.jsx", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: function Header() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "button",
          {
            onClick: () => {
              const ls = globalThis.localStorage;
              ls.setItem(
                "user",
                JSON.stringify({
                  id: "u1",
                  username: "joe",
                  email: "joe@ex.com",
                })
              );
              ls.setItem("token", "tok123");
            },
          },
          "Login"
        ),
        React.createElement(
          "button",
          {
            onClick: () => {
              const ls = globalThis.localStorage;
              ls.removeItem("user");
              ls.removeItem("token");
            },
          },
          "Logout"
        )
      );
    },
  };
});

// Mock backend middleware
const mockGetHotelDetailsAPI = jest.fn();
const mockGetRoomPricingAPI = jest.fn();
jest.mock("../middleware/hotelDetailsApi", () => ({
  getHotelDetailsAPI: (...args) => mockGetHotelDetailsAPI(...args),
  getRoomPricingAPI: (...args) => mockGetRoomPricingAPI(...args),
}));

// Import REAL page after mocks
import HotelDetailPage from "../pages/HotelDetailPage";

function renderWithRouter(entry) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("HotelDetailPage (mocked middleware + auth)", () => {
  const initialState = {
    destinationId: 999,
    hotelDetails: {
      keyDetails: {
        id: "123",
        name: "Mock Hotel From State",
        address: "123 Mock St",
        rating: 4,
        hotel_price: 150,
      },
      imageDetails: { stitchedImageUrls: ["https://example.com/stitched.jpg"] },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.localStorage?.clear?.();

    mockGetHotelDetailsAPI.mockResolvedValue({
      data: {
        hotel: {
          keyDetails: {
            id: "123",
            name: "Mock Hotel",
            address: "123 Mock St",
            rating: 4,
          },
          description: "Mock description for testing.",
          amenities: { wifi: true, parking: false, pool: true },
          image_details: {
            count: 2,
            prefix: "https://example.com/img-",
            suffix: ".jpg",
          },
          latitude: 1.3521,
          longitude: 103.8198,
        },
      },
    });

    mockGetRoomPricingAPI.mockResolvedValue({
      data: [
        {
          keyRoomDetails: {
            keyId: "r1",
            name: "Mock Room",
            roomDescription: "Room Description",
            roomImages: [{ url: "https://example.com/room1.jpg" }],
            freeCancellation: true,
          },
          priceDetails: { price: 100 },
        },
      ],
    });
  });

  test("loads hotel details, shows rooms, and renders map placeholders", async () => {
    renderWithRouter({
      pathname: "/hotel/123",
      search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
      state: initialState,
    });

    // Spinner first
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Hotel title appears after load
    expect(
      await screen.findByRole("heading", { name: /mock hotel/i })
    ).toBeInTheDocument();

    // Address, stars
    expect(screen.getByText(/123 mock st/i)).toBeInTheDocument();
    expect(screen.getByText("★★★★")).toBeInTheDocument();

    // Room list data
    expect(await screen.findByText(/room description/i)).toBeInTheDocument();
    expect(screen.getByText(/sgd 100/i)).toBeInTheDocument();

    // Map stubs
    expect(screen.getByTestId("api-provider")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("marker")).toBeInTheDocument();

    // Middleware calls
    expect(mockGetHotelDetailsAPI).toHaveBeenCalledWith("123");
    expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(1);
  });

  test("renders Header and the search bar controls", async () => {
    renderWithRouter({
      pathname: "/hotel/123",
      search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
      state: initialState,
    });

    // Header rendered (from mock)
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();

    // Wait for hotel to load so the page content is present
    await screen.findByRole("heading", { name: /mock hotel/i });

    // Search bar container exists
    const searchBar = document.querySelector(".search-bar-wrapper");
    expect(searchBar).toBeInTheDocument();

    // Labels and inputs (labels aren't associated, so assert texts + inputs via id)
    expect(screen.getByText(/check in:/i)).toBeInTheDocument();
    expect(screen.getByText(/check out:/i)).toBeInTheDocument();
    expect(screen.getByText(/guests:/i)).toBeInTheDocument();
    expect(screen.getByText(/rooms:/i)).toBeInTheDocument();

    expect(document.getElementById("filter-checkin")).toBeInTheDocument();
    expect(document.getElementById("filter-checkout")).toBeInTheDocument();
    expect(document.getElementById("filter-guests")).toBeInTheDocument();
    expect(document.getElementById("filter-roomNum")).toBeInTheDocument();

    // Modify button present
    expect(screen.getByRole("button", { name: /modify/i })).toBeInTheDocument();
  });

  test("shows HOTEL bookmark only after login", async () => {
    const entry = {
      pathname: "/hotel/123",
      search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
      state: initialState,
    };

    renderWithRouter(entry);

    // Wait for hotel header
    const heading = await screen.findByRole("heading", { name: /mock hotel/i });
    const detailHeader = heading.closest(".detail-header") || document.body;

    // Logged out → no per-hotel bookmark present
    expect(within(detailHeader).queryByLabelText(/bookmark/i)).toBeNull();

    // Login via mocked Header (page auto re-renders due to auth watcher)
    fireEvent.click(screen.getByText("Login"));

    // Now the per-hotel bookmark button should be present
    const hotelBookmark = await within(detailHeader).findByLabelText(
      /bookmark/i
    );
    expect(hotelBookmark).toBeInTheDocument();
    expect(hotelBookmark).toHaveAttribute("data-hotelid", "123");
  });

  test("calls getRoomPricingAPI with id and payload from URL/state", async () => {
    renderWithRouter({
      pathname: "/hotel/123",
      search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
      state: initialState,
    });

    await screen.findByRole("heading", { name: /mock hotel/i });

    expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(1);
    const [idArg, payloadArg] = mockGetRoomPricingAPI.mock.calls[0];

    expect(idArg).toBe("123");
    expect(payloadArg).toMatchObject({
      location: "",
      hotel: "Mock Hotel From State",
      checkIn: "2025-08-20",
      checkOut: "2025-08-23",
      guests: 2,
      roomNum: 1,
      destinationId: 999,
    });
  });

  test("Modify fetches again with updated payload (Guests changed)", async () => {
    renderWithRouter({
      pathname: "/hotel/123",
      search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
      state: initialState,
    });

    await screen.findByRole("heading", { name: /mock hotel/i });
    expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(1);

    // Labels aren't associated via htmlFor; target by id
    const guestsInput = document.getElementById("filter-guests");
    fireEvent.change(guestsInput, { target: { value: "3" } });

    fireEvent.click(screen.getByRole("button", { name: /modify/i }));

    await waitFor(() => expect(mockGetRoomPricingAPI).toHaveBeenCalledTimes(2));

    const [, secondPayload] = mockGetRoomPricingAPI.mock.calls[1];
    expect(secondPayload.guests === 3 || secondPayload.guests === "3").toBe(
      true
    );
  });

  test("unauthenticated Book shows login toast", async () => {
    renderWithRouter({
      pathname: "/hotel/123",
      search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
      state: initialState,
    });

    await screen.findByRole("heading", { name: /mock hotel/i });

    fireEvent.click(screen.getByRole("button", { name: /book/i }));

    expect(
      await screen.findByText(/please login to book a room/i)
    ).toBeInTheDocument();
  });

  // ---------- NEW: Logged-in user can Book and navigates to /checkout ----------
  function TestCheckout() {
    const { state } = useLocation();
    return (
      <div>
        <h1>Checkout</h1>
        <pre data-testid="checkout-state">{JSON.stringify(state)}</pre>
      </div>
    );
  }

  test("when logged in, clicking Book navigates to /checkout with booking state", async () => {
    const entry = {
      pathname: "/hotel/123",
      search: "?checkin=2025-08-20&checkout=2025-08-23&guests=2&roomNum=1",
      state: initialState,
    };

    // render with both routes: hotel detail and checkout
    render(
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/checkout" element={<TestCheckout />} />
        </Routes>
      </MemoryRouter>
    );

    // wait for the page to load
    await screen.findByRole("heading", { name: /mock hotel/i });

    // log in (mock header writes localStorage; page's auth watcher re-renders)
    fireEvent.click(screen.getByText("Login"));

    // click "Book" on the room card
    fireEvent.click(await screen.findByRole("button", { name: /book/i }));

    // we should now be on the Checkout page
    expect(
      await screen.findByRole("heading", { name: /checkout/i })
    ).toBeInTheDocument();

    // verify key fields were passed in location.state
    const state = JSON.parse(
      screen.getByTestId("checkout-state").textContent || "{}"
    );

    expect(state.roomName).toMatch(/mock room|room description/i);
    expect(state.roomPrice).toBe(100);
    expect(state.roomImages?.[0]).toBe("https://example.com/room1.jpg");

    // bookingDetails come from payload + localStorage user + hotelDetails
    expect(state.bookingDetails.hotelId).toBe("123");
    expect(state.bookingDetails.fullName).toBe("joe");
    expect(state.bookingDetails.userId).toBe("u1");
    expect(state.bookingDetails.checkIn).toBe("2025-08-20");
    expect(state.bookingDetails.checkOut).toBe("2025-08-23");
  });
});
