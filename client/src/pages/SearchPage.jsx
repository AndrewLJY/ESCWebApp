// src/pages/SearchPage.jsx
import React from 'react';
import '../styles/SearchPage.css';

const dummyResults = [
  {
    id: 1,
    name: 'Hotel Name',
    image: '/images/hotel.jpg',
    stars: 5,
    address: 'Address 123',
    distance: 'x.y km away from city centre',
    price: 'SGD 200',
  },
  {
    id: 2,
    name: 'Hotel Name',
    image: '/images/hotel.jpg',
    stars: 5,
    address: 'Address 123',
    distance: 'x.y km away from city centre',
    price: 'SGD 180',
  },
  {
    id: 3,
    name: 'Hotel Name',
    image: '/images/hotel.jpg',
    stars: 5,
    address: 'Address 123',
    distance: 'x.y km away from city centre',
    price: 'SGD 220',
  },
];

export default function SearchPage() {
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
        {dummyResults.map(hotel => (
          <div key={hotel.id} className="hotel-card">
            <img src={hotel.image} alt={hotel.name} className="hotel-img" />
            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <div className="stars">
                {'★'.repeat(hotel.stars)}
              </div>
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
    </div>
  );
}
