import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchPage.css";

const dummyResults = [
  {
    id: 1,
    name: "Hotel Name",
    image: "/images/hotel.jpg",
    stars: 5,
    address: "Address 123",
    distance: "x.y km away from city centre",
    price: "SGD 200",
  },
  {
    id: 2,
    name: "Hotel Name",
    image: "/images/hotel.jpg",
    stars: 5,
    address: "Address 123",
    distance: "x.y km away from city centre",
    price: "SGD 180",
  },
  {
    id: 3,
    name: "Hotel Name",
    image: "/images/hotel.jpg",
    stars: 5,
    address: "Address 123",
    distance: "x.y km away from city centre",
    price: "SGD 220",
  },
];

export default function SearchPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    location: { open: false, value: "Singapore" },
    hotel: { open: false, value: "" },
    checkin: { open: false, value: "2025-07-01" },
    checkout: { open: false, value: "2025-07-24" },
    guests: { open: false, value: "2" },
  });

  const toggle = (key) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
  const update = (key, val) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));

  const fmtDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "";

  const onSearch = () => {
    navigate(
      `/search?location=${filters.location.value}` +
        `&hotel=${filters.hotel.value}` +
        `&checkin=${filters.checkin.value}` +
        `&checkout=${filters.checkout.value}` +
        `&guests=${filters.guests.value}`
    );
  };

  return (
    <div className="search-page">
      {/* HEADER */}
      <header className="sp-header">
        <div className="sp-logo" onClick={() => navigate("/")}>
          Ascenda
        </div>
        <div className="sp-actions">
          <button className="btn login">Login</button>
          <button className="btn book" onClick={() => navigate("/")}>
            Book Now
          </button>
        </div>
      </header>

      <main className="sp-main">
        {/* FILTER BAR */}
        <div className="filter-bar-wrapper">
          <div className="sp-filter-bar">
            {["location", "hotel", "checkin", "checkout", "guests"].map(
              (key, idx, arr) => (
                <React.Fragment key={key}>
                  <div className="filter">
                    {filters[key].open ? (
                      key === "checkin" || key === "checkout" ? (
                        <input
                          className="filter-input"
                          type="date"
                          value={filters[key].value}
                          onChange={(e) => update(key, e.target.value)}
                          onBlur={() => toggle(key)}
                          autoFocus
                        />
                      ) : key === "guests" ? (
                        <input
                          className="filter-input"
                          type="number"
                          min="1"
                          placeholder="1"
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
                            (key === "checkin" || key === "checkout"
                              ? key === "checkin"
                                ? "Check in"
                                : "Check out"
                              : key.charAt(0).toUpperCase() + key.slice(1))}
                        </span>
                      </button>
                    )}
                  </div>
                  {idx < arr.length - 1 && <div className="separator" />}
                </React.Fragment>
              )
            )}
            <button className="filter-search-btn" onClick={onSearch}>
              Modify
            </button>
          </div>
        </div>

        {/* SORT & FILTER CONTROLS WRAPPER */}
        <div className="sp-controls-wrapper">
          <section className="sp-controls">
            <div className="sort-by">
              <label>Sort By:</label>
              <button className="sort-btn">
                Price <i className="icon-arrow-up" />
              </button>
              <button className="sort-btn">
                Review <i className="icon-arrow-down" />
              </button>
              <button className="sort-btn">
                Distance <i className="icon-arrow-up" />
              </button>
            </div>
            <div className="filter-controls">
              <div className="slider-group">
                <label>Min-Max Price</label>
                <input type="range" min="50" max="500" />
              </div>
              <div className="slider-group">
                <label>Distance</label>
                <input type="range" min="0" max="50" />
              </div>
              <button className="btn add-filter">Add Filter ▾</button>
            </div>
          </section>
        </div>

        {/* RESULTS LIST */}
        <section className="sp-results">
          {dummyResults.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <img src={hotel.image} alt={hotel.name} className="hotel-img" />
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <div className="stars">{"★".repeat(hotel.stars)}</div>
                <p className="address">{hotel.address}</p>
                <p className="distance">{hotel.distance}</p>
              </div>
              <div className="hotel-book">
                <span className="price">{hotel.price}</span>
                <button className="btn book-small">Book</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
