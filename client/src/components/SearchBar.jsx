// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import axios from "axios";

import "../styles/SearchBar.css";

export default function SearchBar({
  search,
  fetchData = () => {},
  isSearchPage = false,
  className = "",
}) {
  const navigate = useNavigate();

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const timeoutRef = useRef();

  // Shared filter state
  const [filters, setFilters] = useState({
    location_filters: { open: false, value: "" },
    hotel_filters: { open: false, value: "" },
    checkin_filters: { open: false, value: "" },
    checkout_filters: { open: false, value: "" },
    guests_filters: { open: false, value: "" },
    rooms_filters: { open: false, value: "" },
  });

  // Standalone state for SearchPage inputs
  const [locationFilter, setLocationFilter] = useState("");
  const [hotelFilter, setHotelFilter] = useState("");
  // Calculate minimum dates
  const getMinCheckinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  const getMinCheckoutDate = (checkinDate) => {
    if (!checkinDate) return getMinCheckinDate();
    const date = new Date(checkinDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("1");
  const [roomNum, setRoomNum] = useState("1");

  // Fetch suggestions
  const fetchSuggestions = async (term, field) => {
    try {
      const resp = await axios.get(
        `http://localhost:8080/search/string/${term}`
      );
      const top3 = (resp.data || []).slice(0, 3).map((i) => i.item ?? i);
      setSuggestions(top3);
      setShowSuggestions(true);
      setActiveField(field);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // When you click a suggestion
  const selectSuggestion = (s) => {
    if (activeField === "location_filters") {
      update("location_filters", s);
    } else if (activeField === "locationFilter") {
      setLocationFilter(s);
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // toggle & update helpers
  const toggle = (key) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
  const update = (key, val) => {
    setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));
    if (key === "location_filters" && val) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fetchSuggestions(val, key), 300);
    }
  };
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

  // Pre-fill SearchPage inputs from ?string
  useEffect(() => {
    if (!isSearchPage) return;
    const qs = search.startsWith("?") ? search.slice(1) : search;
    const p = new URLSearchParams(qs);

    setLocationFilter(p.get("location") || "");
    setHotelFilter(p.get("hotel") || "");
    setCheckin(p.get("checkin") || "");
    setCheckout(p.get("checkout") || "");
    setGuests(p.get("guests") || "1");
    setRoomNum(p.get("roomNum") || "1");
  }, [search, isSearchPage]);

  // Perform search / navigate
  const onSearch = () => {
    const params = new URLSearchParams();
    if (isSearchPage) {
      if (!locationFilter.trim() && !hotelFilter.trim()) {
        alert("Enter a location, Hotel name is optional.");
        return;
      }
      if (!checkin || !checkout) {
        alert("Pick check-in and check-out.");
        return;
      }
      params.set("location", locationFilter.trim());
      params.set("hotel", hotelFilter.trim());
      params.set("checkin", checkin);
      params.set("checkout", checkout);
      params.set("guests", guests);
      params.set("roomNum", roomNum);

      navigate("?" + params.toString(), {
        replace: true,
        state: { shallow: true },
      });

      fetchData(params.toString());
    } else {
      const {
        location_filters,
        hotel_filters,
        checkin_filters,
        checkout_filters,
        guests_filters,
        rooms_filters,
      } = filters;
      if (!location_filters.value.trim() && !hotel_filters.value.trim()) {
        alert("Enter a location, Hotel name is optional.");
        return;
      }
      if (!checkin_filters.value || !checkout_filters.value) {
        alert("Pick check-in and check-out.");
        return;
      }
      params.set("location", location_filters.value.trim());
      params.set("hotel", hotel_filters.value.trim());
      params.set("checkin", checkin_filters.value);
      params.set("checkout", checkout_filters.value);
      params.set("guests", guests_filters.value || 1);
      params.set("roomNum", rooms_filters.value || 1);
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <div className="sorting-bar">
      {isSearchPage ? (
        <Row className="align-items-center g-3">
          <Col>
            <Form.Group style={{ position: "relative" }}>
              <Form.Label className="fw-bold">Location:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Location"
                className="filter-input"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  if (e.target.value) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(
                      () => fetchSuggestions(e.target.value, "locationFilter"),
                      300
                    );
                  } else {
                    setShowSuggestions(false);
                  }
                }}
              />
              {showSuggestions && activeField === "locationFilter" && (
                <ListGroup
                  style={{ position: "absolute", width: "100%", zIndex: 1000 }}
                >
                  {suggestions.map((s, i) => (
                    <ListGroupItem
                      key={i}
                      className="suggestion-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectSuggestion(s);
                      }}
                    >
                      {s}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Hotel:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Hotel Name"
                className="filter-input"
                value={hotelFilter}
                onChange={(e) => setHotelFilter(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Check In:</Form.Label>
              <Form.Control
                type="date"
                className="filter-input"
                value={checkin}
                onChange={(e) => {
                  setCheckin(e.target.value);
                  if (
                    !checkout ||
                    new Date(e.target.value) >= new Date(checkout)
                  ) {
                    setCheckout(getMinCheckoutDate(e.target.value));
                  }
                }}
                min={getMinCheckinDate()}
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Check Out:</Form.Label>
              <Form.Control
                type="date"
                className="filter-input"
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                min={getMinCheckoutDate(checkin)}
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Guests:</Form.Label>
              <Form.Control
                type="number"
                className="filter-input"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label className="fw-bold">Rooms:</Form.Label>
              <Form.Control
                type="number"
                className="filter-input"
                min="1"
                value={roomNum}
                onChange={(e) => setRoomNum(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <Button variant="primary" className="btn btn-sm" onClick={onSearch}>
              Search
            </Button>
          </Col>
        </Row>
      ) : (
        <div className="filter-bar">
          {Object.entries(filters).map(([key, obj]) => (
            <React.Fragment key={key}>
              <div className="filter">
                {obj.open ? (
                  <div style={{ position: "relative" }}>
                    <input
                      autoFocus
                      className="filter-input"
                      type={
                        key.includes("date") || key.includes("check")
                          ? "date"
                          : key.includes("guests") || key.includes("rooms")
                          ? "number"
                          : "text"
                      }
                      placeholder={
                        key.includes("guests") || key.includes("rooms")
                          ? "1"
                          : ""
                      }
                      min={
                        key.includes("guests") || key.includes("rooms")
                          ? "1"
                          : key === "checkin_filters"
                          ? getMinCheckinDate()
                          : key === "checkout_filters"
                          ? getMinCheckoutDate(filters.checkin_filters.value)
                          : undefined
                      }
                      value={obj.value}
                      onChange={(e) => {
                        update(key, e.target.value);
                        if (
                          key === "checkin_filters" &&
                          (!filters.checkout_filters.value ||
                            new Date(e.target.value) >=
                              new Date(filters.checkout_filters.value))
                        ) {
                          update(
                            "checkout_filters",
                            getMinCheckoutDate(e.target.value)
                          );
                        }
                      }}
                      onBlur={() => toggle(key)}
                    />
                    {showSuggestions &&
                      activeField === "location_filters" &&
                      key === "location_filters" && (
                        <div className="suggestions-dropdown">
                          {suggestions.map((s, i) => (
                            <div
                              key={i}
                              className="suggestion-item"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                selectSuggestion(s);
                              }}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <button className="filter-btn" onClick={() => toggle(key)}>
                    <span>
                      {obj.value
                        ? key.includes("guests")
                          ? `Guests: ${obj.value}`
                          : key.includes("rooms")
                          ? `Rooms: ${obj.value}`
                          : key.includes("check")
                          ? fmtDate(obj.value)
                          : obj.value
                        : key
                            .replace("_filters", "")
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </button>
                )}
              </div>
              <div className="separator" />
            </React.Fragment>
          ))}
          <button className="filter-search-btn" onClick={onSearch}>
            Search
          </button>
        </div>
      )}
    </div>
  );
}
