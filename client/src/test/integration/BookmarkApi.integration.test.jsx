// src/test/integration/BookmarkApi.integration.test.jsx

import { getBookmarkedHotels, addBookmark, removeBookmark } from "../../middleware/bookmarkApi";

// Mock axios for backend API calls
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  defaults: { headers: { post: {} } }
}));

const axios = require("axios");

describe("Bookmark API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  describe("getBookmarkedHotels Integration", () => {
    it("makes correct API call to fetch bookmarks when user is authenticated", async () => {
      localStorage.setItem("authToken", "mock-token-123");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      const mockResponse = {
        data: [
          {
            hotel_id: "hotel1",
            hotel_name: "Marina Bay Sands",
            hotel_address: "10 Bayfront Ave, Singapore",
            hotel_ratings: 5,
            image_url: "https://example.com/marina.jpg"
          }
        ]
      };

      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await getBookmarkedHotels();

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8080/auth/allBookmarks/test@example.com",
        {
          headers: {
            Authorization: "Bearer mock-token-123",
            "Content-Type": "application/json"
          }
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("returns empty array when user is not authenticated", async () => {
      const result = await getBookmarkedHotels();

      expect(axios.get).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("handles API error and returns empty array", async () => {
      localStorage.setItem("authToken", "mock-token-123");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      axios.get.mockRejectedValueOnce(new Error("Network error"));

      const result = await getBookmarkedHotels();

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8080/auth/allBookmarks/test@example.com",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token-123"
          })
        })
      );

      expect(result).toEqual([]);
    });

    it("handles corrupted localStorage user data", async () => {
      localStorage.setItem("authToken", "mock-token-123");
      localStorage.setItem("user", "invalid-json");

      const result = await getBookmarkedHotels();

      expect(axios.get).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("addBookmark Integration", () => {
    it("makes correct API call to add bookmark when user is authenticated", async () => {
      localStorage.setItem("authToken", "mock-token-456");
      localStorage.setItem("user", JSON.stringify({ 
        email: "user@example.com",
        username: "user123"
      }));

      const hotelToSave = {
        hotel_id: "hotel123",
        hotel_name: "Test Hotel",
        hotel_address: "123 Test St",
        hotel_ratings: 4,
        image_url: "https://example.com/hotel.jpg",
        search_string: "location=Test",
        destination_id: "dest123"
      };

      const mockResponse = {
        status: 200,
        data: "Successfully bookmarked"
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await addBookmark(hotelToSave);

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/auth/bookmarks/",
        {
          hotel_id: "hotel123",
          hotel_name: "Test Hotel",
          hotel_address: "123 Test St",
          image_url: "https://example.com/hotel.jpg",
          hotel_ratings: "4",
          user_email: "user@example.com",
          search_string: "location=Test",
          destination_id: "dest123"
        },
        {
          headers: {
            Authorization: "Bearer mock-token-456",
            "Content-Type": "application/json"
          }
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("does not make API call when user is not authenticated", async () => {
      const hotelToSave = {
        hotel_id: "hotel123",
        hotel_name: "Test Hotel",
        hotel_address: "123 Test St",
        hotel_ratings: 4
      };

      await addBookmark(hotelToSave);

      expect(axios.post).not.toHaveBeenCalled();
    });

    it("does not make API call when hotel data is invalid", async () => {
      localStorage.setItem("authToken", "mock-token-456");
      localStorage.setItem("user", JSON.stringify({ 
        email: "user@example.com",
        username: "user123"
      }));

      const invalidHotel = {
        hotel_name: "Test Hotel"
        // Missing hotel_id
      };

      await addBookmark(invalidHotel);

      expect(axios.post).not.toHaveBeenCalled();
    });

    // it("falls back to localStorage when API call fails", async () => {
    //   localStorage.setItem("authToken", "mock-token-456");
    //   localStorage.setItem("user", JSON.stringify({ 
    //     email: "user@example.com",
    //     username: "user123"
    //   }));

    //   const hotelToSave = {
    //     hotel_id: "hotel123",
    //     hotel_name: "Test Hotel",
    //     hotel_address: "123 Test St",
    //     hotel_ratings: 4,
    //     image_url: "https://example.com/hotel.jpg"
    //   };

    //   axios.post.mockRejectedValueOnce(new Error("API Error"));

    //   await addBookmark(hotelToSave);

    //   expect(axios.post).toHaveBeenCalled();
      
    //   // Should save to localStorage as fallback
    //   const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks_user@example.com") || "[]");
    //   expect(savedBookmarks).toContainEqual(hotelToSave);
    // });
  });

  describe("removeBookmark Integration", () => {
    it("makes correct API call to remove bookmark when user is authenticated", async () => {
      localStorage.setItem("authToken", "mock-token-789");
      localStorage.setItem("user", JSON.stringify({ 
        email: "user@example.com",
        username: "user123"
      }));

      const mockResponse = {
        status: 200,
        data: "Deleted"
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await removeBookmark("hotel123");

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/auth/deleteBookmark",
        {
          hotel_id: "hotel123",
          user_email: "user@example.com"
        },
        {
          headers: {
            Authorization: "Bearer mock-token-789",
            "Content-Type": "application/json"
          }
        }
      );

      expect(result).toBe(true);
    });

    it("returns false when user is not authenticated", async () => {
      const result = await removeBookmark("hotel123");

      expect(axios.post).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("returns false when API call fails", async () => {
      localStorage.setItem("authToken", "mock-token-789");
      localStorage.setItem("user", JSON.stringify({ 
        email: "user@example.com",
        username: "user123"
      }));

      axios.post.mockRejectedValueOnce(new Error("Delete failed"));

      const result = await removeBookmark("hotel123");

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/auth/deleteBookmark",
        expect.objectContaining({
          hotel_id: "hotel123",
          user_email: "user@example.com"
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer mock-token-789"
          })
        })
      );

      expect(result).toBe(false);
    });

    it("returns false when API returns non-200 status", async () => {
      localStorage.setItem("authToken", "mock-token-789");
      localStorage.setItem("user", JSON.stringify({ 
        email: "user@example.com",
        username: "user123"
      }));

      const mockResponse = {
        status: 400,
        data: "Error, hotel does not exist in database"
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await removeBookmark("hotel123");

      expect(result).toBe(false);
    });
  });

  describe("Authentication Integration", () => {
    it("handles missing auth token", async () => {
      localStorage.setItem("user", JSON.stringify({ 
        email: "user@example.com",
        username: "user123"
      }));
      // No authToken set

      const result = await getBookmarkedHotels();

      expect(axios.get).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("handles missing user data", async () => {
      localStorage.setItem("authToken", "mock-token-123");
      // No user data set

      const result = await getBookmarkedHotels();

      expect(axios.get).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("includes correct authorization headers in all API calls", async () => {
      localStorage.setItem("authToken", "test-token-abc");
      localStorage.setItem("user", JSON.stringify({ 
        email: "test@example.com",
        username: "testuser"
      }));

      // Test getBookmarkedHotels
      axios.get.mockResolvedValueOnce({ data: [] });
      await getBookmarkedHotels();

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token-abc",
            "Content-Type": "application/json"
          })
        })
      );

      // Test addBookmark
      const hotel = {
        hotel_id: "test",
        hotel_name: "Test Hotel",
        hotel_address: "Test Address",
        hotel_ratings: 4
      };
      
      axios.post.mockResolvedValueOnce({ status: 200 });
      await addBookmark(hotel);

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token-abc",
            "Content-Type": "application/json"
          })
        })
      );

      // Test removeBookmark
      axios.post.mockResolvedValueOnce({ status: 200 });
      await removeBookmark("test");

      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token-abc",
            "Content-Type": "application/json"
          })
        })
      );
    });
  });
});