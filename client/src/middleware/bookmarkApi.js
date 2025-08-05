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
import axios from 'axios';

// Get current user info
function getCurrentUser() {
  try {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");
    return userData && token ? { user: JSON.parse(userData), token } : null;
  } catch (err) {
    console.error("Failed to read user from localStorage:", err);
    return null;
  }
}

// Get auth headers
function getAuthHeaders() {
  const currentUser = getCurrentUser();
  return currentUser ? {
    'Authorization': `Bearer ${currentUser.token}`,
    'Content-Type': 'application/json'
  } : { 'Content-Type': 'application/json' };
}

// Get all bookmarked hotels from backend
export async function getBookmarkedHotels() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.log("No user logged in, returning empty bookmarks");
    return [];
  }

  try {
    // Since backend doesn't have GET endpoint, fallback to localStorage for now
    const key = `bookmarks_${currentUser.user.email}`;
    const bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
    console.log(`Loaded bookmarks for ${currentUser.user.email}:`, bookmarks);

    return bookmarks.filter(
      (hotel) => hotel && hotel.id && hotel.name && hotel.address
    );
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

// Add a hotel to current user's bookmarks via backend
export async function addBookmark(hotel) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn("No user logged in. Cannot add bookmark.");
    return;
  }

  if (!hotel || !hotel.id || !hotel.name) {
    console.warn("Invalid hotel object. Skipping addBookmark.");
    return;
  }

  try {
    // Call backend API
    const response = await axios.post('http://localhost:8080/user/bookmarks/', {
      id: Date.now(), // Generate unique ID
      hotel_id: hotel.icd,
      hotel_name: hotel.name,
      hotel_address: hotel.address,
      image_url: hotel.imageUrl || '',
      hotel_ratings: hotel.rating?.toString() || 'NaN',
      userID: currentUser.user.id
    }, {
      headers: getAuthHeaders()
    });

    console.log("Hotel bookmarked via backend:", response.data);
    
    // Also update localStorage for immediate UI feedback
    const key = `bookmarks_${currentUser.user.email}`;
    let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
    const alreadyBookmarked = bookmarks.some((h) => h.id === hotel.id);
    if (!alreadyBookmarked) {
      bookmarks.push(hotel);
      localStorage.setItem(key, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error("Error adding bookmark:", error);
    // Fallback to localStorage if backend fails
    const key = `bookmarks_${currentUser.user.email}`;
    let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
    const alreadyBookmarked = bookmarks.some((h) => h.id === hotel.id);
    if (!alreadyBookmarked) {
      bookmarks.push(hotel);
      localStorage.setItem(key, JSON.stringify(bookmarks));
      console.log(`Hotel saved to localStorage fallback:`, hotel);
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
    // Since backend doesn't have DELETE endpoint, use localStorage for now
    const response = await axios.post('http://localhost:8080/user/deleteBookmark/', {
      hotel_id: hotelId
    }, {
      headers: getAuthHeaders()
    });
    const key = `bookmarks_${currentUser.user.email}`;
    let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
    bookmarks = bookmarks.filter((h) => h.id !== hotelId);
    localStorage.setItem(key, JSON.stringify(bookmarks));
    console.log(`Removed hotel ID ${hotelId} from ${currentUser.user.email}`);
  } catch (error) {
    console.error("Error removing bookmark:", error);
  }
}
