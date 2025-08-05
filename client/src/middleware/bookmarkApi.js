// // src/middleware/bookmarkApi.js

// const STORAGE_KEY = "bookmarks";

// // ✅ Get all bookmarked hotels (relaxed validation)
// export async function getBookmarkedHotels() {
//   const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
//   console.log("📦 Loaded bookmarks:", bookmarks);

//   // Relaxed filtering to prevent hiding hotels with minor data issues
//   return bookmarks.filter(
//     (hotel) => hotel && hotel.id && hotel.name && hotel.address // imageUrl and price are now optional
//   );
// }

// // ✅ Add a full hotel object to bookmarks
// export async function addBookmark(hotel) {
//   if (!hotel || !hotel.id || !hotel.name) {
//     console.warn("❌ Invalid hotel object. Skipping addBookmark.");
//     return;
//   }

//   let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

//   const alreadyBookmarked = bookmarks.some((h) => h.id === hotel.id);
//   if (!alreadyBookmarked) {
//     bookmarks.push(hotel);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
//     console.log("✅ Hotel saved to localStorage:", hotel);
//   } else {
//     console.log("⚠️ Hotel already bookmarked:", hotel.id);
//   }
// }

// // ✅ Remove a hotel from bookmarks by ID
// export async function removeBookmark(hotelId) {
//   let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
//   bookmarks = bookmarks.filter((h) => h.id !== hotelId);
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
//   console.log("🗑️ Removed hotel ID from bookmarks:", hotelId);
// }
// src/middleware/bookmarkApi.js

// 🔑 Dynamically generate storage key based on logged-in user's email
function getUserBookmarkKey() {
  try {
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);
    return user?.email ? `bookmarks_${user.email}` : "bookmarks_guest";
  } catch (err) {
    console.error("⚠️ Failed to read user from localStorage:", err);
    return "bookmarks_guest";
  }
}

// ✅ Get all bookmarked hotels (relaxed validation)
export async function getBookmarkedHotels() {
  const key = getUserBookmarkKey();
  const bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
  console.log(`📦 Loaded bookmarks for ${key}:`, bookmarks);

  return bookmarks.filter(
    (hotel) => hotel && hotel.id && hotel.name && hotel.address
  );
}

// ✅ Add a hotel to current user's bookmarks
export async function addBookmark(hotel) {
  const key = getUserBookmarkKey();

  if (!hotel || !hotel.id || !hotel.name) {
    console.warn("❌ Invalid hotel object. Skipping addBookmark.");
    return;
  }

  let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");

  const alreadyBookmarked = bookmarks.some((h) => h.id === hotel.id);
  if (!alreadyBookmarked) {
    bookmarks.push(hotel);
    localStorage.setItem(key, JSON.stringify(bookmarks));
    console.log(`✅ Hotel saved to localStorage under ${key}:`, hotel);
  } else {
    console.log("⚠️ Hotel already bookmarked:", hotel.id);
  }
}

// ✅ Remove a hotel from bookmarks by ID
export async function removeBookmark(hotelId) {
  const key = getUserBookmarkKey();

  let bookmarks = JSON.parse(localStorage.getItem(key) || "[]");
  bookmarks = bookmarks.filter((h) => h.id !== hotelId);
  localStorage.setItem(key, JSON.stringify(bookmarks));
  console.log(`🗑️ Removed hotel ID ${hotelId} from ${key}`);
}
