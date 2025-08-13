// src/test/integration/HotelDetailPage.integration.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HotelDetailPage from "../../pages/HotelDetailPage";

// Mock dependencies
jest.mock("../../assets/ascenda_logo.png", () => "mock-logo.png");
jest.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children }) => <div data-testid="map">{children}</div>,
  AdvancedMarker: () => <div data-testid="marker" />,
  MapControl: () => <div data-testid="map-control" />,
  ControlPosition: { BOTTOM_LEFT: "BOTTOM_LEFT" }
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "hotel123" }),
  useLocation: () => ({
    search: "?location=Singapore&checkin=2025-08-01&checkout=2025-08-05&guests=2&roomNum=1",
    state: {
      hotelDetails: {
        keyDetails: {
          id: "hotel123",
          name: "Test Hotel",
          address: "123 Test St",
          rating: 4
        },
        imageDetails: {
          stitchedImageUrls: ["https://example.com/hotel.jpg"]
        }
      },
      destinationId: "dest123"
    }
  })
}));

// Mock axios for backend API calls
jest.mock("axios", () => ({
  get: jest.fn(),
  defaults: { headers: { post: {} } }
}));

const axios = require("axios");

describe("HotelDetailPage Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.alert = jest.fn();
    
    // Mock environment variable
    process.env.VITE_GOOGLE_MAPS_API_KEY = "mock-api-key";
  });

  describe("Hotel Details API Integration", () => {
    it("fetches hotel details from backend API on page load", async () => {
      const mockHotelResponse = {
        data: {
          keyDetails: {
            id: "hotel123",
            name: "Luxury Hotel Singapore",
            address: "Marina Bay, Singapore",
            rating: 5
          },
          image_details: {
            count: 4,
            prefix: "https://example.com/img_",
            suffix: ".jpg"
          },
          description: "A luxurious hotel with stunning views",
          amenities: {
            wifi: true,
            pool: true,
            gym: false,
            spa: true
          },
          latitude: 1.2966,
          longitude: 103.8547
        }
      };

      axios.get.mockResolvedValueOnce(mockHotelResponse);

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/hotel/hotel123");
      });

      await waitFor(() => {
        expect(screen.getByText("Luxury Hotel Singapore")).toBeInTheDocument();
        expect(screen.getByText("Marina Bay, Singapore")).toBeInTheDocument();
      });
    });

    // it("handles hotel details API failure gracefully", async () => {
    //   axios.get.mockRejectedValueOnce(new Error("Network error"));

    //   render(
    //     <MemoryRouter>
    //       <HotelDetailPage />
    //     </MemoryRouter>
    //   );

    //   await waitFor(() => {
    //     expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/hotel/hotel123");
    //   });

    //   // Should handle error gracefully without crashing
    //   expect(screen.getByTestId("no-rooms-available")).toBeInTheDocument();
    // });
  });

  describe("Room Pricing API Integration", () => {
    it("fetches room pricing from backend API", async () => {
      const mockHotelResponse = {
        data: {
          keyDetails: { id: "hotel123", name: "Test Hotel", address: "Test Address", rating: 4 },
          image_details: { count: 2, prefix: "https://example.com/img_", suffix: ".jpg" },
          amenities: { wifi: true },
          latitude: 1.2966,
          longitude: 103.8547
        }
      };

      const mockRoomResponse = {
        data: [
          {
            keyRoomDetails: {
              keyId: "room1",
              name: "Deluxe Room",
              roomDescription: "Spacious deluxe room",
              roomImages: [{ url: "https://example.com/room1.jpg" }],
              freeCancellation: true
            },
            priceDetails: {
              price: 250
            }
          },
          {
            keyRoomDetails: {
              keyId: "room2",
              name: "Standard Room",
              roomDescription: "Comfortable standard room",
              roomImages: [{ url: "https://example.com/room2.jpg" }],
              freeCancellation: false
            },
            priceDetails: {
              price: 180
            }
          }
        ]
      };

      axios.get
        .mockResolvedValueOnce(mockHotelResponse)
        .mockResolvedValueOnce(mockRoomResponse);

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/hotel/hotel123");
      });

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://localhost:8080/search/hotel/prices/hotel123/dest123/2025-08-01/2025-08-05/2/1"
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Spacious deluxe room")).toBeInTheDocument();
        expect(screen.getByText("Comfortable standard room")).toBeInTheDocument();
        expect(screen.getByText("SGD 250")).toBeInTheDocument();
        expect(screen.getByText("SGD 180")).toBeInTheDocument();
      });
    });

    it("handles no rooms available response", async () => {
      const mockHotelResponse = {
        data: {
          keyDetails: { id: "hotel123", name: "Test Hotel", address: "Test Address", rating: 4 },
          image_details: { count: 1, prefix: "https://example.com/img_", suffix: ".jpg" },
          amenities: { wifi: true },
          latitude: 1.2966,
          longitude: 103.8547
        }
      };

      axios.get
        .mockResolvedValueOnce(mockHotelResponse)
        .mockResolvedValueOnce({ status: 404 });

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/hotel/hotel123");
      });

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("No rooms available for the current hotel.");
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });

    it("handles room pricing API error", async () => {
      const mockHotelResponse = {
        data: {
          keyDetails: { id: "hotel123", name: "Test Hotel", address: "Test Address", rating: 4 },
          image_details: { count: 1, prefix: "https://example.com/img_", suffix: ".jpg" },
          amenities: { wifi: true },
          latitude: 1.2966,
          longitude: 103.8547
        }
      };

      axios.get
        .mockResolvedValueOnce(mockHotelResponse)
        .mockRejectedValueOnce(new Error("Room API error"));

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/hotel/hotel123");
      });

      await waitFor(() => {
        expect(screen.getByText("No Rooms Available with the following criteria:")).toBeInTheDocument();
      });
    });
  });

  describe("Room Modification Integration", () => {
    it("updates room search when modify button is clicked", async () => {
      const mockHotelResponse = {
        data: {
          keyDetails: { id: "hotel123", name: "Test Hotel", address: "Test Address", rating: 4 },
          image_details: { count: 1, prefix: "https://example.com/img_", suffix: ".jpg" },
          amenities: { wifi: true },
          latitude: 1.2966,
          longitude: 103.8547
        }
      };

      const mockRoomResponse = {
        data: [
          {
            keyRoomDetails: {
              keyId: "room1",
              name: "Updated Room",
              roomDescription: "Updated room after modification",
              roomImages: [{ url: "https://example.com/room1.jpg" }],
              freeCancellation: true
            },
            priceDetails: { price: 300 }
          }
        ]
      };

      axios.get
        .mockResolvedValueOnce(mockHotelResponse)
        .mockResolvedValueOnce(mockRoomResponse)
        .mockResolvedValueOnce(mockRoomResponse);

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Test Hotel")).toBeInTheDocument();
      });

      // Modify guests
      const guestsInput = screen.getByDisplayValue("2");
      fireEvent.change(guestsInput, { target: { value: "4" } });

      // Click modify button
      const modifyButton = screen.getByText("Modify");
      fireEvent.click(modifyButton);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://localhost:8080/search/hotel/prices/hotel123/dest123/2025-08-01/2025-08-05/4/1"
        );
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("guests=4"),
        expect.objectContaining({
          replace: true,
          state: expect.objectContaining({
            shallow: true
          })
        })
      );
    });
  });

  describe("Authentication Integration", () => {
    it("shows bookmark button when user is authenticated", async () => {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("user", JSON.stringify({ email: "test@example.com" }));

      const mockHotelResponse = {
        data: {
          keyDetails: { id: "hotel123", name: "Test Hotel", address: "Test Address", rating: 4 },
          image_details: { count: 1, prefix: "https://example.com/img_", suffix: ".jpg" },
          amenities: { wifi: true },
          latitude: 1.2966,
          longitude: 103.8547
        }
      };

      axios.get.mockResolvedValueOnce(mockHotelResponse);

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Test Hotel")).toBeInTheDocument();
      });

      // Should show bookmark button when authenticated
      expect(
        screen.getByRole("button", { name: /📌 bookmark/i })
      ).toBeInTheDocument();
    });

    it("navigates to checkout when authenticated user books room", async () => {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        id: "user123", 
        username: "testuser", 
        email: "test@example.com" 
      }));

      const mockHotelResponse = {
        data: {
          keyDetails: { id: "hotel123", name: "Test Hotel", address: "Test Address", rating: 4 },
          image_details: { count: 1, prefix: "https://example.com/img_", suffix: ".jpg" },
          amenities: { wifi: true },
          latitude: 1.2966,
          longitude: 103.8547
        }
      };

      const mockRoomResponse = {
        data: [
          {
            keyRoomDetails: {
              keyId: "room1",
              name: "Test Room",
              roomDescription: "Test room description",
              roomImages: [{ url: "https://example.com/room1.jpg" }],
              freeCancellation: true
            },
            priceDetails: { price: 200 }
          }
        ]
      };

      axios.get
        .mockResolvedValueOnce(mockHotelResponse)
        .mockResolvedValueOnce(mockRoomResponse);

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Test room description")).toBeInTheDocument();
      });

      const bookButton = screen.getByText("Book");
      fireEvent.click(bookButton);

      expect(mockNavigate).toHaveBeenCalledWith("/checkout", {
        state: expect.objectContaining({
          roomName: expect.any(String),
          roomPrice: 200
        })
      });
    });
  });

  describe("Error Handling Integration", () => {
    it("handles malformed hotel API response", async () => {
      axios.get.mockResolvedValueOnce({ data: null });

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/hotel/hotel123");
      });

      // Should handle gracefully without crashing
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("handles network timeout errors", async () => {
      const timeoutError = new Error("timeout of 5000ms exceeded");
      timeoutError.code = "ECONNABORTED";
      axios.get.mockRejectedValueOnce(timeoutError);

      render(
        <MemoryRouter>
          <HotelDetailPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/search/hotel/hotel123");
      });

      // Should handle timeout gracefully
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });
});