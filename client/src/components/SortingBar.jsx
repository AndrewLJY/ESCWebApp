import React, { useState, useEffect } from "react";
import { Form, Dropdown, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import "../styles/SortingBar.css";

export default function SortingBar({ hotels, onFilteredHotels }) {
  const [sortBy, setSortBy] = useState("price");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [guestRatingRange, setGuestRatingRange] = useState([0.0, 5.0]);
  const [starRatingChecked, setStarRatingChecked] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Get all unique amenities from hotels
  const getAllAmenities = () => {
    const amenitiesSet = new Set();

    hotels.forEach((hotel) => {
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
        .map((h) => h?.pricingRankingData?.lowestPrice)
        .filter((price) => price != null)
        .map((price) => Math.floor(price));

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
    filtered = filtered.filter((h) => {
      const price = h?.pricingRankingData?.lowestPrice;
      if (price == null) return false;
      const floorPrice = Math.floor(price);
      return floorPrice >= priceRange[0] && floorPrice <= priceRange[1];
    });

    // Filter by price guest rating range
    filtered = filtered.filter((h) => {
      const rating = h?.trustYouBenchmark?.score?.score?.kaligo_overall;
      if (rating == null) return false;
      return rating >= guestRatingRange[0] && rating <= guestRatingRange[1];
    });

    // Filter by star rating
    if (!starRatingChecked.every((checked) => !checked)) {
      // If no star ratings are checked, skip star rating filtering only
      filtered = filtered.filter((hotel) => {
        const starRating = hotel?.keyDetails?.rating;
        if (starRating == null) return false;
        const starIndex = Math.floor(starRating);
        console.log(
          "Star Index:",
          starIndex,
          "Checked:",
          starRatingChecked[starIndex]
        );
        return starRatingChecked[starIndex];
      });
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((hotel) => {
        const amenityObj = hotel.amenities?.amenities;

        if (!amenityObj || typeof amenityObj !== "object") return false;

        return selectedAmenities.every(
          (amenity) => amenityObj[amenity] === true
        );
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
  }, [
    hotels,
    sortBy,
    priceRange,
    guestRatingRange,
    starRatingChecked,
    selectedAmenities,
    onFilteredHotels,
  ]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleStarRatingToggle = (index) => {
    setStarRatingChecked((prev) => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  return (
    <div className="sorting-bar">
      <div className="sorting-section">
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Sort by:</Form.Label>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price">Price (Low to High)</option>
            <option value="rating">Star Rating (High to Low)</option>
            <option value="distance">Distance</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Form.Label>
          <Form.Group as={Row} className="price-range-slider-container">
            <Form.Label column sm={2} className="fw-bold">
              Start:
            </Form.Label>
            <Col sm={10}>
              <Form.Range
                min={0}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([parseInt(e.target.value), priceRange[1]])
                }
                className="slider"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="price-range-slider-container">
            <Form.Label column sm={2} className="fw-bold">
              End:
            </Form.Label>
            <Col sm={10}>
              <Form.Range
                min={0}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="slider"
              />
            </Col>
          </Form.Group>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Group as={Row}>
            <Form.Label className="fw-bold">Guest Rating:</Form.Label>
            <Form.Group>
              <Form.Group as={Row} className="price-range-slider-container">
                <Form.Label column sm={2} className="fw-bold">
                  Min:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    placeholder="Enter minimum guest rating"
                    min={0} // Optional: Set a minimum value
                    max={5} // Optional: Set a maximum value
                    step={0.1} // Optional: Set the step for increment/decrement
                    value={guestRatingRange[0]}
                    onChange={(e) =>
                      setGuestRatingRange([
                        parseFloat(e.target.value),
                        guestRatingRange[1],
                      ])
                    }
                    className="mb-2"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="price-range-slider-container">
                <Form.Label column sm={2} className="fw-bold">
                  Max:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    placeholder="Enter maximum guest rating"
                    min={0} // Optional: Set a minimum value
                    max={5} // Optional: Set a maximum value
                    step={0.1} // Optional: Set the step for increment/decrement
                    value={guestRatingRange[1]}
                    onChange={(e) =>
                      setGuestRatingRange([
                        guestRatingRange[0],
                        parseFloat(e.target.value),
                      ])
                    }
                  />
                </Col>
              </Form.Group>
            </Form.Group>
          </Form.Group>
        </Form.Group>

        <Form.Group className="mb-3 px-3">
          <Form.Group as={Row}>
            <Form.Label className="fw-bold">Star Rating:</Form.Label>
            <Form.Check
              type="checkbox"
              label="☆☆☆☆☆"
              checked={starRatingChecked[0]}
              onChange={() => handleStarRatingToggle(0)}
              className="text-center text-warning"
            />
            <Form.Check
              type="checkbox"
              label="★☆☆☆☆"
              checked={starRatingChecked[1]}
              onChange={() => handleStarRatingToggle(1)}
              className="text-center text-warning"
            />
            <Form.Check
              type="checkbox"
              label="★★☆☆☆"
              checked={starRatingChecked[2]}
              onChange={() => handleStarRatingToggle(2)}
              className="text-center text-warning"
            />
            <Form.Check
              type="checkbox"
              label="★★★☆☆"
              checked={starRatingChecked[3]}
              onChange={() => handleStarRatingToggle(3)}
              className="text-center text-warning"
            />
            <Form.Check
              type="checkbox"
              label="★★★★☆"
              checked={starRatingChecked[4]}
              onChange={() => handleStarRatingToggle(4)}
              className="text-center text-warning"
            />
            <Form.Check
              type="checkbox"
              label="★★★★★"
              checked={starRatingChecked[5]}
              onChange={() => handleStarRatingToggle(5)}
              className="text-center text-warning"
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Amenities:</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100">
              {selectedAmenities.length > 0
                ? `${selectedAmenities.length} selected`
                : "Select amenities"}
            </Dropdown.Toggle>
            <Dropdown.Menu
              className="w-100"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {getAllAmenities().map((amenity) => (
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
            setGuestRatingRange([0.0, 5.0]);
            setStarRatingChecked([false, false, false, false, false, false]);
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
