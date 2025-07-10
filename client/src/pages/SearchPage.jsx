// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { searchHotels } from '../middleware/searchApi';
import '../styles/SearchPage.css';

export default function SearchPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useState({
    location: 'Singapore',
    checkIn: '2025-07-01',
    checkOut: '2025-07-24',
    guests: 2,
    hotelType: 'Hotel'
  });

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const response = await searchHotels(searchParams);
        setHotels(response.data.hotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return <div className="search-page"><div className="loading">Loading hotels...</div></div>;
  }

  return (
    <div className="search-page">
      {/* Header */}
      <header className="sp-header">
        <div className="sp-logo">Ascenda</div>
        <div className="sp-actions">
          <button className="btn login">Login</button>
          <button className="btn book">Book Now</button>
        </div>
      </header>

      {/* Main filter bar */}
      <section className="sp-filter-bar">
        <div className="filter-item">
          <i className="icon-location-pin" />
          <span>Singapore</span>
        </div>
        <div className="filter-item">
          <i className="icon-hotel" />
          <span>Hotel</span>
        </div>
        <div className="filter-item">
          <i className="icon-calendar" />
          <span>Tue, 01/07/25</span>
        </div>
        <div className="filter-item">
          <i className="icon-calendar" />
          <span>Thu, 24/07/25</span>
        </div>
        <div className="filter-item">
          <i className="icon-user" />
          <span>2 Guests</span>
        </div>
        <button className="btn modify">Modify</button>
      </section>

      {/* Sort & filter controls */}
      <section className="sp-controls">
        <div className="sort-by">
          <label>Sort By:</label>
          <button className="sort-btn">Price <i className="icon-arrow-up" /></button>
          <button className="sort-btn">Review <i className="icon-arrow-down" /></button>
          <button className="sort-btn">Distance <i className="icon-arrow-up" /></button>
        </div>
        <div className="filter-controls">
          <button className="btn add-filter">Add Filter ▾</button>
          <div className="slider-group">
            <label>Min‑Max Price</label>
            <input type="range" min="50" max="500" />
          </div>
          <div className="slider-group">
            <label>Distance</label>
            <input type="range" min="0" max="50" />
          </div>
        </div>
      </section>

      {/* Results list */}
      <section className="sp-results">
        {hotels.map(hotel => (
          <div key={hotel.id} className="hotel-card">
            <img src={hotel.image} alt={hotel.name} className="hotel-img" />
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <div className="stars">
                {'★'.repeat(hotel.stars)}
              </div>
              <p className="address">{hotel.address}</p>
              <p className="distance">{hotel.distance}</p>
              <p className="rating">Rating: {hotel.rating}/5</p>
            </div>
            <div className="hotel-book">
              <span className="price">{hotel.price}</span>
              <button className="btn book-small">Book</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
