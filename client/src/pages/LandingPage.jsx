// src/pages/LandingPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // Each filter now has { open: bool, value: string }
  const [filters, setFilters] = useState({
    location: { open: false, value: "" },
    hotel: { open: false, value: "" },
    checkin: { open: false, value: "" },
    checkout: { open: false, value: "" },
    guests: { open: false, value: "" },
  });

  // Toggle edit mode
  const toggle = (key) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));

  // Update the stored value
  const update = (key, val) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));

  // Format YYYY-MM-DD into locale string
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

  // Search handler with validation + client-side navigation
  const onSearch = () => {
    const { location, hotel, checkin, checkout, guests } = filters;

    if (!location.value.trim() && !hotel.value.trim()) {
      alert("Please enter a location or a hotel name.");
      return;
    }
    if (!checkin.value) {
      alert("Please select a check-in date.");
      return;
    }
    if (!checkout.value) {
      alert("Please select a check-out date.");
      return;
    }
    if (!guests.value) {
      alert("Please specify number of guests.");
      return;
    }

    const params = new URLSearchParams();
    if (location.value.trim()) params.set("location", location.value.trim());
    if (hotel.value.trim()) params.set("hotel", hotel.value.trim());
    params.set("checkin", checkin.value);
    params.set("checkout", checkout.value);
    params.set("guests", guests.value);

    navigate(`/search?${params.toString()}`);
  };

  // Close both dropdowns
  const closeAll = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  return (
    <div className={`landing${loginOpen || signupOpen ? " blurred" : ""}`}>
      {/* Logo */}
      <div className="landing__logo">Ascenda</div>

      {/* Login / Book */}
      <div className="landing__actions">
        <button
          className="btn login"
          onClick={() => {
            closeAll();
            setLoginOpen((o) => !o);
          }}
        >
          Login
        </button>
        <button className="btn book">Book Now</button>
      </div>

      {/* Headlines */}
      <h1 className="landing__headline">
        Start your dream vacation with&nbsp;us
      </h1>
      <h2 className="landing__subheadline">
        Discover the world with Ascenda. You deserve the best.
      </h2>

      {/* Filter bar */}
      <div className="filter-bar">
        {/* Location */}
        <div className="filter">
          {filters.location.open ? (
            <input
              className="filter-input"
              placeholder="Where to?"
              value={filters.location.value}
              onChange={(e) => update("location", e.target.value)}
              onBlur={() => toggle("location")}
              autoFocus
            />
          ) : (
            <button className="filter-btn" onClick={() => toggle("location")}>
              <span>{filters.location.value || "Location"}</span>
            </button>
          )}
        </div>
        <div className="separator" />

        {/* Hotel */}
        <div className="filter">
          {filters.hotel.open ? (
            <input
              className="filter-input"
              placeholder="Hotel name"
              value={filters.hotel.value}
              onChange={(e) => update("hotel", e.target.value)}
              onBlur={() => toggle("hotel")}
              autoFocus
            />
          ) : (
            <button className="filter-btn" onClick={() => toggle("hotel")}>
              <span>{filters.hotel.value || "Hotel"}</span>
            </button>
          )}
        </div>
        <div className="separator" />

        {/* Check-in */}
        <div className="filter">
          {filters.checkin.open ? (
            <input
              className="filter-input"
              type="date"
              value={filters.checkin.value}
              onChange={(e) => update("checkin", e.target.value)}
              onBlur={() => toggle("checkin")}
              autoFocus
            />
          ) : (
            <button className="filter-btn" onClick={() => toggle("checkin")}>
              <span>
                {filters.checkin.value
                  ? fmtDate(filters.checkin.value)
                  : "Check in"}
              </span>
            </button>
          )}
        </div>
        <div className="separator" />

        {/* Check-out */}
        <div className="filter">
          {filters.checkout.open ? (
            <input
              className="filter-input"
              type="date"
              value={filters.checkout.value}
              onChange={(e) => update("checkout", e.target.value)}
              onBlur={() => toggle("checkout")}
              autoFocus
            />
          ) : (
            <button className="filter-btn" onClick={() => toggle("checkout")}>
              <span>
                {filters.checkout.value
                  ? fmtDate(filters.checkout.value)
                  : "Check out"}
              </span>
            </button>
          )}
        </div>
        <div className="separator" />

        {/* Guests */}
        <div className="filter">
          {filters.guests.open ? (
            <input
              className="filter-input"
              type="number"
              min="1"
              placeholder="1"
              value={filters.guests.value}
              onChange={(e) => update("guests", e.target.value)}
              onBlur={() => toggle("guests")}
              autoFocus
            />
          ) : (
            <button className="filter-btn" onClick={() => toggle("guests")}>
              <span>
                {filters.guests.value
                  ? `Guests: ${filters.guests.value}`
                  : "Guests"}
              </span>
            </button>
          )}
        </div>

        {/* Search button */}
        <button className="filter-search-btn" onClick={onSearch}>
          Search
        </button>
      </div>

      {/* Login Dropdown */}
      {loginOpen && !signupOpen && (
        <div className="login-dropdown">
          <h2 className="dropdown__title">Sign In</h2>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required />
            </div>
            <button type="submit" className="btn submit">
              Sign In Now
            </button>
            <p className="dropdown__signup">
              Don’t have an account? Click{" "}
              <button
                type="button"
                className="btn signup"
                onClick={() => {
                  setSignupOpen(true);
                  setLoginOpen(false);
                }}
              >
                here
              </button>
            </p>
            <button type="button" className="btn close" onClick={closeAll}>
              Close
            </button>
          </form>
        </div>
      )}

      {/* Sign Up Dropdown */}
      {signupOpen && !loginOpen && (
        <div className="signup-dropdown">
          <h2 className="dropdown__title">Create Account</h2>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="new-email">Email Address</label>
              <input id="new-email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Password</label>
              <input id="new-password" type="password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input id="confirm-password" type="password" required />
            </div>
            <button type="submit" className="btn submit">
              Sign Up Now
            </button>
            <button type="button" className="btn close" onClick={closeAll}>
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
