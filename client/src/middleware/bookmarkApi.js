// src/middleware/bookmarkApi.js

const STORAGE_KEY = "bookmarks";

// ✅ Get all bookmarked hotels (relaxed validation)
export async function getBookmarkedHotels() {
  const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  console.log("📦 Loaded bookmarks:", bookmarks);

  // Relaxed filtering to prevent hiding hotels with minor data issues
  return bookmarks.filter(
    (hotel) => hotel && hotel.id && hotel.name && hotel.address // imageUrl and price are now optional
  );
}

// ✅ Add a full hotel object to bookmarks
export async function addBookmark(hotel) {
  if (!hotel || !hotel.id || !hotel.name) {
    console.warn("❌ Invalid hotel object. Skipping addBookmark.");
    return;
  }

  let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const alreadyBookmarked = bookmarks.some((h) => h.id === hotel.id);
  if (!alreadyBookmarked) {
    bookmarks.push(hotel);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    console.log("✅ Hotel saved to localStorage:", hotel);
  } else {
    console.log("⚠️ Hotel already bookmarked:", hotel.id);
  }
}

// ✅ Remove a hotel from bookmarks by ID
export async function removeBookmark(hotelId) {
  let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  bookmarks = bookmarks.filter((h) => h.id !== hotelId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  console.log("🗑️ Removed hotel ID from bookmarks:", hotelId);
}
