import React, { useState, useEffect } from "react";
import { Form, Dropdown } from "react-bootstrap";
import "../styles/SortingBar.css";

export default function SortingBar({ hotels, onFilteredHotels }) {
  const [sortBy, setSortBy] = useState("price");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Get all unique amenities from hotels
  const getAllAmenities = () => {
    const amenitiesSet = new Set();
    hotels.forEach(hotel => {
      if (hotel.amenities && Array.isArray(hotel.amenities)) {
        hotel.amenities.forEach(amenity => amenitiesSet.add(amenity));
      }
    });
    console.log("All amenities:", Array.from(amenitiesSet));
    return Array.from(amenitiesSet);
  };

  // Calculate max price from hotels
  useEffect(() => {
    if (hotels.length > 0) {
      const max = Math.max(...hotels.map(h => Math.floor(h.pricingRankingData.lowestPrice)));
      setMaxPrice(max);
      setPriceRange([0, max]);
    }
  }, [hotels]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...hotels];

    // Filter by price range
    filtered = filtered.filter(h => {
      const price = Math.floor(h.pricingRankingData.lowestPrice);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(h => {
        if (!h.amenities || !Array.isArray(h.amenities)) return false;
        return selectedAmenities.every(amenity => h.amenities.includes(amenity));
      });
    }

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return Math.floor(a.pricingRankingData.lowestPrice) - Math.floor(b.pricingRankingData.lowestPrice);
        case "rating":
          const ratingA = a.keyDetails.rating || 0;
          const ratingB = b.keyDetails.rating || 0;
          return ratingB - ratingA;
        case "distance":
          const distA = a.keyDetails.distance || 999;
          const distB = b.keyDetails.distance || 999;
          return distA - distB;
        default:
          return 0;
      }
    });

    onFilteredHotels(filtered);
  }, [hotels, sortBy, priceRange, selectedAmenities, onFilteredHotels]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="sorting-bar">
      <div className="sorting-section">
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Sort by:</Form.Label>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="price">Price (Low to High)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="distance">Distance</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Price Range: ${priceRange[0]} - ${priceRange[1]}</Form.Label>
          <div className="price-range-container">
            <Form.Range
              min={0}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="mb-2"
            />
            <Form.Range
              min={0}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Amenities:</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              {selectedAmenities.length > 0 ? `${selectedAmenities.length} selected` : "Select amenities"}
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {getAllAmenities().map(amenity => (
                <Dropdown.Item
                  key={amenity}
                  as="div"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAmenityToggle(amenity);
                  }}
                >
                  <Form.Check
                    type="checkbox"
                    label={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <button 
          className="btn btn-outline-danger btn-sm w-100"
          onClick={() => {
            setSortBy("price");
            setPriceRange([0, maxPrice]);
            setSelectedAmenities([]);
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}