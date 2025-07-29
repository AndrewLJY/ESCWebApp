// src/middleware/bookmarkApi.js

const STORAGE_KEY = "bookmarks";

// Sample hotel mock data
const HOTEL_DATA = [
  {
    id: 1,
    name: "Hotel Ascenda",
    address: "123 Beach Road, Singapore",
    rating: 4,
    price: 180,
    imageUrl: "https://mockimg.com/hotel1.jpg",
  },
  {
    id: 2,
    name: "Skyline Suites",
    address: "456 Orchard Blvd, Singapore",
    rating: 5,
    price: 220,
    imageUrl: "https://mockimg.com/hotel2.jpg",
  },
  {
    id: 3,
    name: "Orchid Inn",
    address: "789 Marina Bay, Singapore",
    rating: 3,
    price: 160,
    imageUrl: "https://mockimg.com/hotel3.jpg",
  },
];

export async function getBookmarkedHotels() {
  let bookmarkIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  // ✅ Auto-populate mock bookmarks if empty
  if (bookmarkIds.length === 0) {
    bookmarkIds = HOTEL_DATA.map((hotel) => hotel.id); // All mock hotels
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkIds));
  }

  return HOTEL_DATA.filter((hotel) => bookmarkIds.includes(hotel.id));
}

export async function addBookmark(hotelId) {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (!current.includes(hotelId)) {
    current.push(hotelId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
}

export async function removeBookmark(hotelId) {
  let current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  current = current.filter((id) => id !== hotelId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
