// src/pages/SearchPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import Header from "../components/header";
import FilterBar from "../components/FilterBar";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the API (backend currently returns static data, so we apply client-side filter)
  const fetchData = useCallback(async (queryString) => {
    setLoading(true);
    const params = new URLSearchParams(queryString);
    const payload = { hotelType: "Hotel" };
    if (params.get("location")) payload.location = params.get("location");
    if (params.get("hotel")) payload.hotel = params.get("hotel");
    if (params.get("checkin")) payload.checkIn = params.get("checkin");
    if (params.get("checkout")) payload.checkOut = params.get("checkout");
    if (params.get("guests")) payload.guests = Number(params.get("guests"));

    try {
      const resp = await searchHotelsAPI(payload);
      let data = resp.data.hotels || [];
      // client-side filter if backend doesn't filter
      if (payload.location) {
        const loc = payload.location.toLowerCase();
        data = data.filter(
          (h) =>
            h.keyDetails.address.toLowerCase().includes(loc) ||
            h.keyDetails.name.toLowerCase().includes(loc)
        );
      }
      if (payload.hotel) {
        const name = payload.hotel.toLowerCase();
        data = data.filter((h) =>
          h.keyDetails.name.toLowerCase().includes(name)
        );
      }
      setHotels(data);
    } catch (err) {
      console.error("Search error:", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync URL → inputs + fetch on change
  useEffect(() => {
    const qs = search.startsWith("?") ? search.substring(1) : search;
    fetchData(qs);
  }, [search, fetchData]);

  // Build query and navigate
  const onSearch = () => {
    if (!locationFilter.trim() && !hotelFilter.trim()) {
      alert("Please enter a location or hotel name.");
      return;
    }
    if (!checkin) {
      alert("Please select a check‑in date.");
      return;
    }
    if (!checkout) {
      alert("Please select a check‑out date.");
      return;
    }
    if (!guests) {
      alert("Please specify number of guests.");
      return;
    }
    const q = new URLSearchParams();
    if (locationFilter.trim()) q.set("location", locationFilter.trim());
    if (hotelFilter.trim()) q.set("hotel", hotelFilter.trim());
    q.set("checkin", checkin);
    q.set("checkout", checkout);
    q.set("guests", guests);

    navigate(`/search?${q.toString()}`);
  };

  return (
    <div className="search-page">
      <Header />
      <main className="sp-main">
        <div className="filter-bar-wrapper">
           <FilterBar 
              search={search}
              fetchData={fetchData}
              isSearchPage={true}
            />
        </div>
        <section className="sp-results">
          {loading ? (
            <div className="loading">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div>No hotels found.</div>
          ) : (
            hotels.map((h) => (
              <div key={h.keyDetails.id} className="hotel-card">
                <img
                  className="hotel-img"
                  src={
                    h.imageDetails.imageCounts > 0
                      ? h.imageDetails.stitchedImageUrls[0]
                      : "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"
                  }
                  alt={h.keyDetails.name}
                />
                <div className="hotel-info">
                  <h3>{h.keyDetails.name}</h3>
                  <div className="stars">{"★".repeat(h.keyDetails.rating)}</div>
                  <p className="address">{h.keyDetails.address}</p>
                  <p className="distance">
                    {Math.floor(h.keyDetails.distance)} km
                  </p>
                  <p className="rating">
                    Rating:{" "}
                    {h.keyDetails.rating ? `${h.keyDetails.rating}/5` : "NA"}
                  </p>
                </div>
                <div className="hotel-book">
                  <span className="price">
                    {h.keyDetails.price
                      ? `SGD ${h.keyDetails.price}`
                      : "SGD 140"}
                  </span>
                  <button
                    className="btn book-small"
                    onClick={() => navigate(`/hotel/${h.keyDetails.id}`)}
                  >
                    Book
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
