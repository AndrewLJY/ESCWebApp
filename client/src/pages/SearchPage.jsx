// src/pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import { loginUserAPI } from "../middleware/authApi";
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

  // Modals
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [userAuthLoading, setUserAuthLoading] = useState(false);
  const closeAll = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };
  const blurClass = loginOpen || signupOpen ? " blurred" : "";

  return (
    <div className={`search-page${blurClass}`}>
      {/* HEADER */}
      <header className="sp-header">
        <div className="sp-logo" onClick={() => navigate("/")}>
          Ascenda
        </div>
        <div className="sp-actions">
          <button
            className="btn login"
            onClick={() => {
              closeAll();
              setLoginOpen(true);
            }}
          >
            Login
          </button>
          <button
            className="btn book"
            onClick={() => {
              closeAll();
              setLoginOpen(true);
            }}
          >
            Book Now
          </button>
        </div>
      </header>
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

        {/* SORT & FILTER CONTROLS */}
        {/* ... unchanged ... */}

        {/* RESULTS LIST */}
        <section className="sp-results">
          {loading ? (
            <div className="loading">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div>No hotels found.</div>
          ) : (
            hotels.map((h) => (
              <div key={h.id} className="hotel-card">
                {/* Tried to add in given photo. If don't have, provided default */}
                <img src={h.image_details.count > 0 ? h.image_details.prefix+"10"+h.image_details.suffix : "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"} alt={h.name} className="hotel-img" />
                <div className="hotel-info">
                  <h3>{h.name}</h3>
                  {/* Currently just the rating due to lack of stars info */}
                  <div className="stars">{"★".repeat(h.rating)}</div>
                  <p className="address">{h.address}</p>
                  <p className="distance">{Math.floor(h.distance)}</p>
                  {/* Rating updated to at least show rating even if dont have */}
                   <p className="rating">Rating: {h.rating ? h.rating +"/5": "NA"}</p>
                </div>
                <div className="hotel-book">
                  {/* Will replace with static value for now */}
                  <span className="price">{h.price ? h.price: 'SGD 140'}</span>
                  <button className="btn book-small">Book</button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
      {/* LOGIN DROPDOWN */}
      {loginOpen && !signupOpen && (
        <div className="login-dropdown">
          <h2 className="dropdown__title">Sign In</h2>
          <form className="login-form" onSubmit={async (e) => {
            e.preventDefault();
            setUserAuthLoading(true);
            try {
              const formData = new FormData(e.target);
              const result = await loginUserAPI({
                email: formData.get('email'),
                password: formData.get('password')
              });
              alert('Login successful!');
              closeAll();
            } catch (error) {
              alert(error.message);
            } finally {
              setUserAuthLoading(false);
            }
          }}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input name="email" id="email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input name="password" id="password" type="password" required />
            </div>
            <button type="submit" className="btn submit" disabled={userAuthLoading}>
              {userAuthLoading ? 'Signing In...' : 'Sign In Now'}
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
      {/* SIGNUP DROPDOWN */}
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
