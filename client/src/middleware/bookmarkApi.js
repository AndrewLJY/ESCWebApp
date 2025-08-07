// // src/middleware/bookmarkApi.js

// const STORAGE_KEY = "bookmarks";

// // Get all bookmarked hotels (relaxed validation)
// export async function getBookmarkedHotels() {
//   const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
//   console.log("Loaded bookmarks:", bookmarks);

//   // Relaxed filtering to prevent hiding hotels with minor data issues
//   return bookmarks.filter(
//     (hotel) => hotel && hotel.id && hotel.name && hotel.address // imageUrl and price are now optional
//   );
// }

// //Add a full hotel object to bookmarks
// export async function addBookmark(hotel) {
//   if (!hotel || !hotel.id || !hotel.name) {
//     console.warn("Invalid hotel object. Skipping addBookmark.");
//     return;
//   }

//   let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

//   const alreadyBookmarked = bookmarks.some((h) => h.id === hotel.id);
//   if (!alreadyBookmarked) {
//     bookmarks.push(hotel);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
//     console.log("Hotel saved to localStorage:", hotel);
//   } else {
//     console.log("Hotel already bookmarked:", hotel.id);
//   }
// }

// //Remove a hotel from bookmarks by ID
// export async function removeBookmark(hotelId) {
//   let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
//   bookmarks = bookmarks.filter((h) => h.id !== hotelId);
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
//   console.log("Removed hotel ID from bookmarks:", hotelId);
// }
// src/middleware/bookmarkApi.js
import axios from "axios";

// Get current user info
function getCurrentUser() {
  try {
    console.log(localStorage);
    const userData = localStorage.getItem("user");
    const userDataJSONObject = JSON.parse(userData); //convert to JSON object first, now keys are: user, token, username, email
    const token = localStorage.getItem("authToken"); // works
    return userDataJSONObject && token
      ? { user: userDataJSONObject, token: token }
      : null;
  } catch (err) {
    console.error("Failed to read user from localStorage:", err);
    return null;
  }
}

// Get auth headers
function getAuthHeaders() {
  let currentUser = getCurrentUser();
  console.log("here", currentUser.token);

  if (currentUser) {
    return {
      Authorization: `Bearer ${currentUser.token}`,
      "Content-Type": "application/json",
    };
  } else {
    return {
      "Content-Type": "application/json",
    };
  }
}

// Get all bookmarked hotels from backend
export async function getBookmarkedHotels() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.log("No user logged in, returning empty bookmarks");
    return [];
  }

  try {
    const response = await axios.get(
      `http://localhost:8080/auth/allBookmarks/${currentUser.user.email}`,
      {
        headers: getAuthHeaders(),
      }
    );
    console.log(`Loaded bookmarks for ${currentUser.user.email}:`, response);
    return response || [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

// Add a hotel to current user's bookmarks via backend
export async function addBookmark(hotelToSave) {
  console.log("hotel to save", hotelToSave);
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn("No user logged in. Cannot add bookmark.");
    return;
  }

  if (!hotelToSave || !hotelToSave.id || !hotelToSave.name) {
    console.warn("Invalid hotel object. Skipping addBookmark.");
    return;
  }

  try {
    // Call backend API
    const response = await axios.post(
      "http://localhost:8080/auth/bookmarks/",
      {
        hotel_id: hotelToSave.hotel_id,
        hotel_name: hotelToSave.hotel_name,
        hotel_address: hotelToSave.hotel_address,
        image_url: hotelToSave.image_url || "",
        hotel_ratings: hotelToSave.rating?.toString() || "NaN",
        user_email: currentUser.user.email,
        search_string: hotelToSave.search_string,
        destination_id: hotelToSave.destination_id,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("Hotel bookmarked via backend:", response.data);

    // Also update localStorage for immediate UI feedback
    const key = `bookmarks_${currentUser.user.email}`;
    let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
    const alreadyBookmarked = bookmarks.some(
      (h) => h.hotel_id === hotelToSave.hotel_id
    );
    if (!alreadyBookmarked) {
      bookmarks.push(hotelToSave);
      localStorage.setItem(key, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error("Error adding bookmark:", error);
    // Fallback to localStorage if backend fails
    const key = `bookmarks_${currentUser.user.email}`;
    let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
    const alreadyBookmarked = bookmarks.some(
      (h) => h.hotel_id === hotelToSave.hotel_id
    );
    if (!alreadyBookmarked) {
      bookmarks.push(hotelToSave);
      localStorage.setItem(key, JSON.stringify(bookmarks));
      console.log(`Hotel saved to localStorage fallback:`, hotelToSave);
    }
  }
}

// Remove a hotel from bookmarks by ID
export async function removeBookmark(hotelId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn("No user logged in. Cannot remove bookmark.");
    return;
  }

  try {
    console.log("hotel id!!!", hotelId);
    const response = await axios.post(
      "http://localhost:8080/auth/deleteBookmark",
      {
        hotel_id: hotelId,
        user_email: currentUser.user.email,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    console.log(`Removed hotel ID ${hotelId}:`, response.data);
    return response.status === 200;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return false;
  }
}
