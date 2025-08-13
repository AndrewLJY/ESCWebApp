// src/test/integration/BookmarkPage.integration.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookmarkPage from "../../pages/BookmarkPage";

// Mock dependencies
jest.mock("../../assets/ascenda_logo.png", () => "mock-logo.png");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

// Mock axios for backend API calls
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  defaults: { headers: { post: {} } }
}));

const axios = require("axios");

describe("BookmarkPage Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Bookmark Fetching Integration", () => {
    it("fetches bookmarks from backend API on page load", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockBookmarksResponse = {
        data: [
          {
            hotel_id: "hotel1",
            hotel_name: "Marina Bay Sands",
            hotel_address: "10 Bayfront Ave, Singapore",
            hotel_ratings: 5,
            image_url: "https://example.com/marina.jpg",
            destination_id: "dest123",
            search_string: "location=Singapore&checkin=2025-08-01"
          },
          {
            hotel_id: "hotel2", 
            hotel_name: "Raffles Hotel",
            hotel_address: "1 Beach Rd, Singapore",
            hotel_ratings: 5,
            image_url: "https://example.com/raffles.jpg",
            destination_id: "dest456",
            search_string: "location=Singapore&checkin=2025-09-01"
          }
        ]
      };

      axios.get.mockResolvedValueOnce(mockBookmarksResponse);

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://localhost:8080/auth/allBookmarks/test@example.com",
          {
            headers: {
              Authorization: "Bearer mock-token",
              "Content-Type": "application/json"
            }
          }
        );
      });

      await waitFor(() => {
        expect(screen.getByText("Marina Bay Sands")).toBeInTheDocument();
        expect(screen.getByText("Raffles Hotel")).toBeInTheDocument();
        expect(screen.getByText("10 Bayfront Ave, Singapore")).toBeInTheDocument();
        expect(screen.getByText("1 Beach Rd, Singapore")).toBeInTheDocument();
      });
    });

    it("handles empty bookmarks response", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      axios.get.mockResolvedValueOnce({ data: [] });

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://localhost:8080/auth/allBookmarks/test@example.com",
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: "Bearer mock-token"
            })
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByText("You haven’t bookmarked any hotels yet.")).toBeInTheDocument();
      });
    });

    it("handles bookmarks API failure", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      axios.get.mockRejectedValueOnce(new Error("Network error"));

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://localhost:8080/auth/allBookmarks/test@example.com",
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: "Bearer mock-token"
            })
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByText("You haven’t bookmarked any hotels yet.")).toBeInTheDocument();
      });
    });

    it("shows empty state when user is not logged in", async () => {
      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("You haven’t bookmarked any hotels yet.")).toBeInTheDocument();
      });

      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  describe("Bookmark Removal Integration", () => {
    it("removes bookmark via backend API when remove button clicked", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockBookmarksResponse = {
        data: [
          {
            hotel_id: "hotel1",
            hotel_name: "Test Hotel",
            hotel_address: "Test Address",
            hotel_ratings: 4,
            image_url: "https://example.com/test.jpg",
            destination_id: "dest123",
            search_string: "location=Test"
          }
        ]
      };

      const mockEmptyResponse = { data: [] };

      axios.get
        .mockResolvedValueOnce(mockBookmarksResponse)
        .mockResolvedValueOnce(mockEmptyResponse);
      
      axios.post.mockResolvedValueOnce({ status: 200, data: "Deleted" });

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Test Hotel")).toBeInTheDocument();
      });

      const removeButton = screen.getByText("❌ Remove");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/auth/deleteBookmark",
          {
            hotel_id: "hotel1",
            user_email: "test@example.com"
          },
          {
            headers: {
              Authorization: "Bearer mock-token",
              "Content-Type": "application/json"
            }
          }
        );
      });

      // Should refetch bookmarks after removal
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(2);
      });
    });

    it("handles bookmark removal API failure", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockBookmarksResponse = {
        data: [
          {
            hotel_id: "hotel1",
            hotel_name: "Test Hotel",
            hotel_address: "Test Address",
            hotel_ratings: 4,
            image_url: "https://example.com/test.jpg"
          }
        ]
      };

      axios.get.mockResolvedValue(mockBookmarksResponse);
      axios.post.mockRejectedValueOnce(new Error("Delete failed"));

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Test Hotel")).toBeInTheDocument();
      });

      const removeButton = screen.getByText("❌ Remove");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/auth/deleteBookmark",
          expect.objectContaining({
            hotel_id: "hotel1",
            user_email: "test@example.com"
          }),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: "Bearer mock-token"
            })
          })
        );
      });

      // Should still refetch bookmarks even if delete failed
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Hotel Navigation Integration", () => {
    it("navigates to hotel detail page when view button clicked", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockBookmarksResponse = {
        data: [
          {
            hotel_id: "hotel123",
            hotel_name: "Luxury Resort",
            hotel_address: "Paradise Island",
            hotel_ratings: 5,
            image_url: "https://example.com/luxury.jpg",
            destination_id: "dest789",
            search_string: "location=Paradise&checkin=2025-12-01"
          }
        ]
      };

      axios.get.mockResolvedValueOnce(mockBookmarksResponse);

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Luxury Resort")).toBeInTheDocument();
      });

      const viewButton = screen.getByText("View Hotel");
      fireEvent.click(viewButton);

      expect(mockNavigate).toHaveBeenCalledWith("/hotel/hotel123", {
        state: {
          hotelDetails: {
            keyDetails: {
              id: "hotel123",
              name: "Luxury Resort",
              address: "Paradise Island",
              rating: 5,
              distance: 0
            },
            imageDetails: {
              imageCounts: 1,
              stitchedImageUrls: ["https://example.com/luxury.jpg"]
            }
          },
          destinationId: "dest789"
        }
      });
    });

    it("handles hotels with multiple images", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockBookmarksResponse = {
        data: [
          {
            hotel_id: "hotel456",
            hotel_name: "Multi Image Hotel",
            hotel_address: "Test Location",
            hotel_ratings: 4,
            stitchedImageUrls: [
              "https://example.com/img1.jpg",
              "https://example.com/img2.jpg",
              "https://example.com/img3.jpg"
            ],
            destination_id: "dest999"
          }
        ]
      };

      axios.get.mockResolvedValueOnce(mockBookmarksResponse);

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Multi Image Hotel")).toBeInTheDocument();
      });

      const viewButton = screen.getByText("View Hotel");
      fireEvent.click(viewButton);

      expect(mockNavigate).toHaveBeenCalledWith("/hotel/hotel456", {
        state: {
          hotelDetails: {
            keyDetails: {
              id: "hotel456",
              name: "Multi Image Hotel",
              address: "Test Location",
              rating: 4,
              distance: 0
            },
            imageDetails: {
              imageCounts: 3,
              stitchedImageUrls: [
                "https://example.com/img1.jpg",
                "https://example.com/img2.jpg",
                "https://example.com/img3.jpg"
              ]
            }
          },
          destinationId: "dest999"
        }
      });
    });

    it("handles hotels with no images", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockBookmarksResponse = {
        data: [
          {
            hotel_id: "hotel789",
            hotel_name: "No Image Hotel",
            hotel_address: "Somewhere",
            hotel_ratings: 3,
            destination_id: "dest111"
          }
        ]
      };

      axios.get.mockResolvedValueOnce(mockBookmarksResponse);

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("No Image Hotel")).toBeInTheDocument();
      });

      const viewButton = screen.getByText("View Hotel");
      fireEvent.click(viewButton);

      expect(mockNavigate).toHaveBeenCalledWith("/hotel/hotel789", {
        state: {
          hotelDetails: {
            keyDetails: {
              id: "hotel789",
              name: "No Image Hotel",
              address: "Somewhere",
              rating: 3,
              distance: 0
            },
            imageDetails: {
              imageCounts: 0,
              stitchedImageUrls: []
            }
          },
          destinationId: "dest111"
        }
      });
    });
  });

  describe("Authentication Integration", () => {
    it("handles corrupted localStorage user data", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", "invalid-json");

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("You haven’t bookmarked any hotels yet.")).toBeInTheDocument();
      });

      expect(axios.get).not.toHaveBeenCalled();
    });

    it("handles missing auth token", async () => {
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("You haven’t bookmarked any hotels yet.")).toBeInTheDocument();
      });

      expect(axios.get).not.toHaveBeenCalled();
    });

    it("handles 401 unauthorized response", async () => {
      localStorage.setItem("authToken", "expired-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const unauthorizedError = new Error("Request failed with status code 401");
      unauthorizedError.response = { status: 401 };
      axios.get.mockRejectedValueOnce(unauthorizedError);

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          "http://localhost:8080/auth/allBookmarks/test@example.com",
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: "Bearer expired-token"
            })
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByText("You haven’t bookmarked any hotels yet.")).toBeInTheDocument();
      });
    });
  });

  describe("UI State Integration", () => {
    it("shows loading spinner while fetching bookmarks", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      // Create a promise that we can control
      let resolvePromise;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      axios.get.mockReturnValueOnce(pendingPromise);

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      // Should show loading spinner
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();

      // Resolve the promise
      resolvePromise({ data: [] });

      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
    });

    it("displays star ratings correctly", async () => {
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockBookmarksResponse = {
        data: [
          {
            hotel_id: "hotel1",
            hotel_name: "Five Star Hotel",
            hotel_address: "Luxury District",
            hotel_ratings: 5,
            image_url: "https://example.com/five-star.jpg"
          },
          {
            hotel_id: "hotel2",
            hotel_name: "Three Star Hotel", 
            hotel_address: "Budget District",
            hotel_ratings: 3,
            image_url: "https://example.com/three-star.jpg"
          }
        ]
      };

      axios.get.mockResolvedValueOnce(mockBookmarksResponse);

      render(
        <MemoryRouter>
          <BookmarkPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Five Star Hotel")).toBeInTheDocument();
        expect(screen.getByText("Three Star Hotel")).toBeInTheDocument();
      });

      // Check star ratings
      const starElements = screen.getAllByText(/★+/);
      expect(starElements[0]).toHaveTextContent("★★★★★");
      expect(starElements[1]).toHaveTextContent("★★★");
    });
  });
});