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

  // fetch bookmarked hotels once on mount
  useEffect(() => {
    async function fetchBookmarks() {
      const data = await getBookmarkedHotels();
      setBookmarks(data);
      setLoading(false);
    }
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
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        rating: hotel.rating,
        price: hotel.price,
        distance: hotel.distance || 0,
      },
      imageDetails: {
        imageCounts:
          hotel.stitchedImageUrls?.length || (hotel.imageUrl ? 1 : 0),
        stitchedImageUrls:
          hotel.stitchedImageUrls || (hotel.imageUrl ? [hotel.imageUrl] : []),
      },
    };

    const destinationId = hotel.destinationId || "";
    const searchString = hotel.searchString || "";

    navigate(`/hotel/${hotel.id}${searchString}`, {
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
            {bookmarks.map((hotel) => (
              <div key={hotel.id} className="bookmark-card">
                <img
                  className="bookmark-image"
                  src={
                    hotel.stitchedImageUrls?.[0] ||
                    hotel.imageUrl ||
                    "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"
                  }
                  alt={hotel.name}
                />
                <div className="bookmark-info">
                  <h3>{hotel.name}</h3>
                  <p className="address">{hotel.address}</p>
                  <p className="stars">{"★".repeat(hotel.rating)}</p>
                  <p className="price">SGD {hotel.price}</p>

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
                    onClick={() => handleRemove(hotel.id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
