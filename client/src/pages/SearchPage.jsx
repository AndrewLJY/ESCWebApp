import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import Header from "../components/header";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const locationHook = useLocation();

  // Filters state, initialized from URL params
  const initialParams = new URLSearchParams(locationHook.search);
  const [filters, setFilters] = useState({
    location: {
      open: false,
      value: initialParams.get("location") || "Singapore",
    },
    hotel: { open: false, value: initialParams.get("hotel") || "" },
    checkin: {
      open: false,
      value: initialParams.get("checkin") || "2025-07-01",
    },
    checkout: {
      open: false,
      value: initialParams.get("checkout") || "2025-07-24",
    },
    guests: { open: false, value: initialParams.get("guests") || "2" },
  });

  // Hotels data
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to format dates
  const fmtDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "";

  // Toggle input open/close
  const toggle = (key) =>
    setFilters((f) => ({
      ...f,
      [key]: { ...f[key], open: !f[key].open },
    }));

  // Update filter value
  const update = (key, val) =>
    setFilters((f) => ({
      ...f,
      [key]: { ...f[key], value: val },
    }));

  // Build searchParams object for API
  const buildParams = () => ({
    location: filters.location.value,
    hotel: filters.hotel.value,
    checkIn: filters.checkin.value,
    checkOut: filters.checkout.value,
    guests: Number(filters.guests.value),
    hotelType: "Hotel",
  });

  // Fetch hotels whenever URL query changes
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await searchHotelsAPI(buildParams());
        setHotels(response.data.hotels || []);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [locationHook.search]);

  // Submit modified filters -> reload URL
  const onModify = () => {
    const params = new URLSearchParams();
    if (filters.location.value) params.set("location", filters.location.value);
    if (filters.hotel.value) params.set("hotel", filters.hotel.value);
    params.set("checkin", filters.checkin.value);
    params.set("checkout", filters.checkout.value);
    params.set("guests", filters.guests.value);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="search-page">
      <Header showBook={false} />
      
      {/* MAIN CONTENT */}
      <main className="sp-main">
        {/* FILTER BAR */}
        <div className="filter-bar-wrapper">
          <div className="sp-filter-bar">
            {["location", "hotel", "checkin", "checkout", "guests"].map(
              (key) => (
                <React.Fragment key={key}>
                  <div className="filter">
                    {filters[key].open ? (
                      key === "checkin" || key === "checkout" ? (
                        <input
                          type="date"
                          className="filter-input"
                          value={filters[key].value}
                          onChange={(e) => update(key, e.target.value)}
                          onBlur={() => toggle(key)}
                          autoFocus
                        />
                      ) : key === "guests" ? (
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          className="filter-input"
                          value={filters[key].value}
                          onChange={(e) => update(key, e.target.value)}
                          onBlur={() => toggle(key)}
                          autoFocus
                        />
                      ) : (
                        <input
                          className="filter-input"
                          placeholder={
                            key === "location" ? "Where to?" : "Hotel name"
                          }
                          value={filters[key].value}
                          onChange={(e) => update(key, e.target.value)}
                          onBlur={() => toggle(key)}
                          autoFocus
                        />
                      )
                    ) : (
                      <button
                        className="filter-btn"
                        onClick={() => toggle(key)}
                      >
                        <span>
                          {filters[key].value ||
                            (key === "checkin"
                              ? "Check in"
                              : key === "checkout"
                              ? "Check out"
                              : key.charAt(0).toUpperCase() + key.slice(1))}
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="separator" />
                </React.Fragment>
              )
            )}
            <button className="filter-search-btn" onClick={onModify}>
              Modify
            </button>
          </div>
        </div>

        {/* RESULTS LIST */}
        <section className="sp-results">
          {loading ? (
            <div className="loading">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div>No hotels found.</div>
          ) : (
            hotels.map((h) => (
              <div key={h.keyDetails?.id || h.id} className="hotel-card">
                <img src={h.imageDetails?.imageCounts > 0 ? h.imageDetails.stitchedImageUrls[0]: "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"} alt={h.keyDetails?.name || h.name} className="hotel-img" />
                <div className="hotel-info">
                  <h3>{h.keyDetails?.name || h.name}</h3>
                  <div className="stars">{"★".repeat(h.keyDetails?.rating || h.rating || 0)}</div>
                  <p className="address">{h.keyDetails?.address || h.address}</p>
                  <p className="distance">{Math.floor(h.keyDetails?.distance || h.distance || 0)}</p>
                  <p className="rating">Rating: {h.keyDetails?.rating || h.rating ? (h.keyDetails?.rating || h.rating) +"/5": "NA"}</p>
                </div>
                <div className="hotel-book">
                  <span className="price">{h.keyDetails?.price || h.price || 'SGD 140'}</span>
                  <button className="btn book-small">Book</button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}