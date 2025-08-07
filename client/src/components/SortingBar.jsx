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
      const amenityObj = hotel.amenities?.amenities;
      //console.log("Hotel amenities object:", amenityObj);

      if (amenityObj && typeof amenityObj === "object") {
        Object.entries(amenityObj).forEach(([key, value]) => {
          if (value === true) {
            amenitiesSet.add(key);
          }
        });
      }
    });

    const amenitiesList = Array.from(amenitiesSet);
    //console.log("All amenities:", amenitiesList);
    return amenitiesList;
  };

  // Calculate max price from hotels
  useEffect(() => {
    if (hotels.length > 0) {
      const prices = hotels
        .map(h => h?.pricingRankingData?.lowestPrice)
        .filter(price => price != null)
        .map(price => Math.floor(price));
      
      if (prices.length > 0) {
        const max = Math.max(...prices);
        setMaxPrice(max);
        setPriceRange([0, max]);
      }
    }
  }, [hotels]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...hotels];

    // Filter by price range
    filtered = filtered.filter(h => {
      const price = h?.pricingRankingData?.lowestPrice;
      if (price == null) return false;
      const floorPrice = Math.floor(price);
      return floorPrice >= priceRange[0] && floorPrice <= priceRange[1];
    });

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel => {
        const amenityObj = hotel.amenities?.amenities;

        if (!amenityObj || typeof amenityObj !== "object") return false;

        return selectedAmenities.every(amenity => amenityObj[amenity] === true);
      });
    }


    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          const priceA = a?.pricingRankingData?.lowestPrice || 0;
          const priceB = b?.pricingRankingData?.lowestPrice || 0;
          return Math.floor(priceA) - Math.floor(priceB);
        case "rating":
          const ratingA = a?.keyDetails?.rating || 0;
          const ratingB = b?.keyDetails?.rating || 0;
          return ratingB - ratingA;
        case "distance":
          const distA = a?.keyDetails?.distance || 999;
          const distB = b?.keyDetails?.distance || 999;
          return distA - distB;
        default:
          return 0;
      }
    });

    onFilteredHotels(filtered);
  }, [hotels, sortBy, priceRange, selectedAmenities, onFilteredHotels]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
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
