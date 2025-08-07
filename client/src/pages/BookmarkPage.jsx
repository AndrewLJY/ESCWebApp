// src/pages/Bookmark.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../styles/Bookmark.css";
import { getBookmarkedHotels, removeBookmark } from "../middleware/bookmarkApi";

export default function Bookmark() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookmarks() {
    const data = await getBookmarkedHotels();
    setBookmarks(data.data);

    setLoading(false);
  }

  // fetch bookmarked hotels once on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // remove one bookmark
  const handleRemove = async (id) => {
    await removeBookmark(id);
    const updated = await getBookmarkedHotels();
    setBookmarks(updated);
  };

  // navigate exactly like SearchPage's button, using saved searchString & destinationId
  const handleView = (hotel) => {
    const hotelDetails = {
      keyDetails: {
        id: hotel.hotel_id,
        name: hotel.hotel_name,
        address: hotel.hotel_address,
        rating: hotel.hotel_ratings,
        distance: hotel.distance || 0,
      },
      imageDetails: {
        imageCounts:
          hotel.stitchedImageUrls?.length || (hotel.image_url ? 1 : 0),
        stitchedImageUrls:
          hotel.stitchedImageUrls || (hotel.image_url ? [hotel.image_url] : []),
      },
    };

    const destinationId = hotel.destination_id || "";
    const searchString = hotel.search_string || "";

    navigate(`/hotel/${hotel.hotel_id}`, {
      state: { hotelDetails, destinationId },
    });
  };

  return (
    <div className="bookmark-page">
      <Header />

      <main className="bookmark-main">
        <h1 className="bookmark-title">Your Bookmarked Hotels</h1>

        {loading ? (
          <p className="bookmark-empty">Loading…</p>
        ) : bookmarks.length === 0 ? (
          <p className="bookmark-empty">
            You haven’t bookmarked any hotels yet.
          </p>
        ) : (
          <div className="bookmark-grid">
            {Array.isArray(bookmarks) && bookmarks.length > 0
              ? bookmarks.map((hotel) => (
                  <div key={hotel.hotel_id} className="bookmark-card">
                    <img
                      className="bookmark-image"
                      src={
                        hotel.stitchedImageUrls?.[0] ||
                        hotel.image_url ||
                        "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"
                      }
                      alt={hotel.hotel_name}
                    />
                    <div className="bookmark-info">
                      <h3>{hotel.hotel_name}</h3>
                      <p className="address">{hotel.hotel_address}</p>
                      <p className="stars">{"★".repeat(hotel.hotel_ratings)}</p>

                      <button
                        type="button"
                        className="btn book"
                        onClick={() => handleView(hotel)}
                      >
                        View Hotel
                      </button>

                      <button
                        type="button"
                        className="btn remove"
                        onClick={() => handleRemove(hotel.hotel_id)}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  </div>
                ))
              : null}
          </div>
        )}
      </main>
    </div>
  );
}
