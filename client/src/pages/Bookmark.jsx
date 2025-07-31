import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/Bookmark.css";
import { getBookmarkedHotels } from "../middleware/bookmarkApi";

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      const data = await getBookmarkedHotels();
      setBookmarks(data);
      setLoading(false);
    }

    fetchBookmarks();
  }, []);

  return (
    <div className="bookmark-page">
      <Header />
      <main className="bookmark-main">
        <h1 className="bookmark-title">Your Bookmarked Hotels</h1>

        {loading ? (
          <p className="bookmark-empty">Loading...</p>
        ) : bookmarks.length === 0 ? (
          <p className="bookmark-empty">
            You haven’t bookmarked any hotels yet.
          </p>
        ) : (
          <div className="bookmark-grid">
            {bookmarks.map((hotel) => (
              <div key={hotel.id} className="bookmark-card">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="bookmark-image"
                />
                <div className="bookmark-info">
                  <h3>{hotel.name}</h3>
                  <p className="address">{hotel.address}</p>
                  <p className="stars">{"★".repeat(hotel.rating)}</p>
                  <p className="price">SGD {hotel.price}</p>
                  <button
                    className="btn book"
                    onClick={() =>
                      (window.location.href = `/hotel/${hotel.id}`)
                    }
                  >
                    View Hotel
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
