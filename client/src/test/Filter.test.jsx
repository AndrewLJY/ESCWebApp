// // src/test/Filter.test.jsx

// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import LandingPage from "../pages/LandingPage";

// // Mock useNavigate
// const mockNavigate = jest.fn();
// jest.mock("react-router-dom", () => {
//   const original = jest.requireActual("react-router-dom");
//   return {
//     ...original,
//     useNavigate: () => mockNavigate,
//   };
// });

// describe("LandingPage Search", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     global.alert = jest.fn();
//   });

//   test("Search fails with missing fields", () => {
//     render(
//       <MemoryRouter>
//         <LandingPage />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("Search"));

//     expect(global.alert).toHaveBeenCalledWith(
//       "Please enter a location or a hotel name."
//     );
//   });

//   test("Search proceeds with valid filters", async () => {
//     render(
//       <MemoryRouter>
//         <LandingPage />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("Location"));
//     fireEvent.change(screen.getByPlaceholderText("Where to?"), {
//       target: { value: "Singapore" },
//     });

//     fireEvent.click(screen.getByText("Check in"));
//     fireEvent.change(screen.getByDisplayValue(""), {
//       target: { value: "2025-08-01" },
//     });

//     fireEvent.click(screen.getByText("Check out"));
//     const checkoutInput = screen
//       .getAllByDisplayValue("")
//       .find((el) => el.getAttribute("type") === "date");
//     fireEvent.change(checkoutInput, {
//       target: { value: "2025-08-05" },
//     });

//     fireEvent.click(screen.getByText("Guests"));
//     fireEvent.change(screen.getByPlaceholderText("1"), {
//       target: { value: "2" },
//     });

//     fireEvent.click(screen.getByText("Search"));

//     expect(mockNavigate).toHaveBeenCalledWith(
//       expect.stringContaining("/search?location=Singapore")
//     );
//     expect(mockNavigate).toHaveBeenCalledWith(
//       expect.stringContaining("checkin=2025-08-01")
//     );
//     expect(mockNavigate).toHaveBeenCalledWith(
//       expect.stringContaining("checkout=2025-08-05")
//     );
//     expect(mockNavigate).toHaveBeenCalledWith(
//       expect.stringContaining("guests=2")
//     );

//     expect(global.alert).not.toHaveBeenCalled();
//   });

//   test("Shows alert when check-in is missing", () => {
//     render(
//       <MemoryRouter>
//         <LandingPage />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("Location"));
//     fireEvent.change(screen.getByPlaceholderText("Where to?"), {
//       target: { value: "Singapore" },
//     });

//     fireEvent.click(screen.getByText("Check out"));
//     const checkoutInput = screen
//       .getAllByDisplayValue("")
//       .find((el) => el.getAttribute("type") === "date");
//     fireEvent.change(checkoutInput, {
//       target: { value: "2025-08-05" },
//     });

//     fireEvent.click(screen.getByText("Guests"));
//     fireEvent.change(screen.getByPlaceholderText("1"), {
//       target: { value: "2" },
//     });

//     fireEvent.click(screen.getByText("Search"));

//     expect(global.alert).toHaveBeenCalledWith("Please select a check-in date.");
//   });

//   test("Shows alert when check-out is missing", () => {
//     render(
//       <MemoryRouter>
//         <LandingPage />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("Location"));
//     fireEvent.change(screen.getByPlaceholderText("Where to?"), {
//       target: { value: "Singapore" },
//     });

//     fireEvent.click(screen.getByText("Check in"));
//     fireEvent.change(screen.getByDisplayValue(""), {
//       target: { value: "2025-08-01" },
//     });

//     fireEvent.click(screen.getByText("Guests"));
//     fireEvent.change(screen.getByPlaceholderText("1"), {
//       target: { value: "2" },
//     });

//     fireEvent.click(screen.getByText("Search"));

//     expect(global.alert).toHaveBeenCalledWith(
//       "Please select a check-out date."
//     );
//   });

//   test("Shows alert when guest count is missing", () => {
//     render(
//       <MemoryRouter>
//         <LandingPage />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText("Location"));
//     fireEvent.change(screen.getByPlaceholderText("Where to?"), {
//       target: { value: "Singapore" },
//     });

//     fireEvent.click(screen.getByText("Check in"));
//     fireEvent.change(screen.getByDisplayValue(""), {
//       target: { value: "2025-08-01" },
//     });

//     fireEvent.click(screen.getByText("Check out"));
//     const checkoutInput = screen
//       .getAllByDisplayValue("")
//       .find((el) => el.getAttribute("type") === "date");
//     fireEvent.change(checkoutInput, {
//       target: { value: "2025-08-05" },
//     });

//     fireEvent.click(screen.getByText("Guests"));
//     const guestsInput = screen.getByPlaceholderText("1");
//     fireEvent.change(guestsInput, {
//       target: { value: "" },
//     });
//     fireEvent.blur(guestsInput); // Ensure input closes

//     fireEvent.click(screen.getByText("Search"));

//     expect(global.alert).toHaveBeenCalledWith(
//       "Please specify number of guests."
//     );
//   });
// });
// src/test/Filter.test.jsx

// src/test/Filter.test.jsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";

// Mock useNavigate
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
    global.alert = jest.fn(); // Mock alert
  });

  test("Search fails with missing fields", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Search"));
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

    // Fill Location
    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(screen.getByPlaceholderText("Where to?"), {
      target: { value: "Singapore" },
    });

    // Fill Check-in
    fireEvent.click(screen.getByText("Check in"));
    fireEvent.change(screen.getByDisplayValue(""), {
      target: { value: "2025-08-01" },
    });

    // Fill Check-out
    fireEvent.click(screen.getByText("Check out"));
    const checkoutInput = screen
      .getAllByDisplayValue("")
      .find((el) => el.getAttribute("type") === "date");
    fireEvent.change(checkoutInput, {
      target: { value: "2025-08-05" },
    });

    // Fill Guests
    fireEvent.click(screen.getByText("Guests"));
    fireEvent.change(screen.getByPlaceholderText("1"), {
      target: { value: "2" },
    });

    // Execute search
    fireEvent.click(screen.getByText("Search"));

    // Should navigate with correct params
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

    expect(global.alert).not.toHaveBeenCalled();
  });

  test("Shows alert when check-in is missing", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Fill Location
    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(screen.getByPlaceholderText("Where to?"), {
      target: { value: "Singapore" },
    });

    // Fill only Check-out
    fireEvent.click(screen.getByText("Check out"));
    const coInput = screen
      .getAllByDisplayValue("")
      .find((el) => el.getAttribute("type") === "date");
    fireEvent.change(coInput, {
      target: { value: "2025-08-05" },
    });

    // Fill Guests
    fireEvent.click(screen.getByText("Guests"));
    fireEvent.change(screen.getByPlaceholderText("1"), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith("Please select a check-in date.");
  });

  test("Shows alert when check-out is missing", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Fill Location & Check-in
    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(screen.getByPlaceholderText("Where to?"), {
      target: { value: "Singapore" },
    });
    fireEvent.click(screen.getByText("Check in"));
    fireEvent.change(screen.getByDisplayValue(""), {
      target: { value: "2025-08-01" },
    });

    // Fill Guests
    fireEvent.click(screen.getByText("Guests"));
    fireEvent.change(screen.getByPlaceholderText("1"), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith(
      "Please select a check-out date."
    );
  });

  test("Shows alert when guest count is missing", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Fill Location, Check-in & Check-out
    fireEvent.click(screen.getByText("Location"));
    fireEvent.change(screen.getByPlaceholderText("Where to?"), {
      target: { value: "Singapore" },
    });
    fireEvent.click(screen.getByText("Check in"));
    fireEvent.change(screen.getByDisplayValue(""), {
      target: { value: "2025-08-01" },
    });
    fireEvent.click(screen.getByText("Check out"));
    const coInput2 = screen
      .getAllByDisplayValue("")
      .find((el) => el.getAttribute("type") === "date");
    fireEvent.change(coInput2, {
      target: { value: "2025-08-05" },
    });

    // Clear Guests
    fireEvent.click(screen.getByText("Guests"));
    const guestsInput = screen.getByPlaceholderText("1");
    fireEvent.change(guestsInput, { target: { value: "" } });
    fireEvent.blur(guestsInput);

    fireEvent.click(screen.getByText("Search"));
    expect(global.alert).toHaveBeenCalledWith(
      "Please specify number of guests."
    );
  });
});
