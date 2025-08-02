// // src/components/FilterBar.jsx
// import React, { useState, useEffect, useRef } from "react";
// import "../styles/SearchBar.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function SearchBar({
//   search,
//   fetchData,
//   isSearchPage = false,
//   className = "",
// }) {
//   const navigate = useNavigate();
//   const [filters, setFilters] = useState({
//     location_filters: { open: false, value: "" },
//     hotel_filters: { open: false, value: "" },
//     checkin_filters: { open: false, value: "" },
//     checkout_filters: { open: false, value: "" },
//     guests_filters: { open: false, value: "" },
//   });

//   const [locationFilter, setLocationFilter] = useState("");
//   const [hotelFilter, setHotelFilter] = useState("");
//   const [checkin, setCheckin] = useState("");
//   const [checkout, setCheckout] = useState("");
//   const [guests, setGuests] = useState("1");

//   // Autocomplete state
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeField, setActiveField] = useState(null);
//   const timeoutRef = useRef(null);

//   // Fetch suggestions from backend
//   const fetchSuggestions = async (searchTerm, field) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/search/string/${searchTerm}`
//       );
//       const top3 = response.data.slice(0, 3).map((item) => item.item || item);
//       setSuggestions(top3);
//       setShowSuggestions(true);
//       setActiveField(field);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };

//   // Handle suggestion selection
//   const selectSuggestion = (suggestion) => {
//     if (activeField === "location_filters") {
//       update("location_filters", suggestion);
//     } else if (activeField === "locationFilter") {
//       setLocationFilter(suggestion);
//     }
//     setShowSuggestions(false);
//     setSuggestions([]);
//   };

//   const toggle = (key) =>
//     setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
//   const update = (key, val) => {
//     setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));

//     // Trigger autocomplete for location fields
//     if (key === "location_filters" && val.length > 0) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => fetchSuggestions(val, key), 2000);
//       setActiveField(key);
//     } else if (key === "location_filters") {
//       setShowSuggestions(false);
//     }
//   };
//   const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

//   const onSearch = () => {
//     const {
//       location_filters,
//       hotel_filters,
//       checkin_filters,
//       checkout_filters,
//       guests_filters,
//     } = filters;

//     if (
//       !location_filters.value.trim() &&
//       !hotel_filters.value.trim() &&
//       !locationFilter.trim() &&
//       !hotelFilter.trim()
//     ) {
//       alert("Please enter a location or a hotel name.");
//       return;
//     }

//     if (!checkin_filters.value && !checkin) {
//       alert("Please select a check-in date.");
//       return;
//     }
//     if (!checkout_filters.value && !checkout) {
//       alert("Please select a check-out date.");
//       return;
//     }

//     if (isSearchPage) {
//       if (!guests) {
//         alert("Please specify number of guests.");
//         return;
//       }
//     } else {
//       if (!guests_filters.value) {
//         alert("Please specify number of guests.");
//         return;
//       }
//     }

//     const params = new URLSearchParams();
//     if (isSearchPage) {
//       if (locationFilter.trim()) params.set("location", locationFilter.trim());
//       if (hotelFilter.trim()) params.set("hotel", hotelFilter.trim());
//       params.set("checkin", checkin);
//       params.set("checkout", checkout);
//       params.set("guests", guests);
//     } else {
//       if (location_filters.value.trim())
//         params.set("location", location_filters.value.trim());
//       if (hotel_filters.value.trim())
//         params.set("hotel", hotel_filters.value.trim());
//       params.set("checkin", checkin_filters.value);
//       params.set("checkout", checkout_filters.value);
//       params.set("guests", guests_filters.value);
//     }

//     navigate(`/search?${params.toString()}`);
//   };

//   useEffect(() => {
//     if (isSearchPage) {
//       const qs = search.startsWith("?") ? search.slice(1) : search;
//       const params = new URLSearchParams(qs);
//       setLocationFilter(params.get("location") || "");
//       setHotelFilter(params.get("hotel") || "");
//       setCheckin(params.get("checkin") || "");
//       setCheckout(params.get("checkout") || "");
//       setGuests(params.get("guests") || "1");
//     }
//   }, [search, fetchData, isSearchPage]);

//   return (
//     <div className={`filter-bar-wrapper ${className}`}>
//       {isSearchPage ? (
//         <div className="sp-filter-bar">
//           <div style={{ position: "relative" }}>
//             <input
//               type="text"
//               placeholder="Location"
//               className="filter-input"
//               value={locationFilter}
//               onChange={(e) => {
//                 setLocationFilter(e.target.value);
//                 if (e.target.value.length > 0) {
//                   clearTimeout(timeoutRef.current);
//                   timeoutRef.current = setTimeout(
//                     () => fetchSuggestions(e.target.value, "locationFilter"),
//                     2000
//                   );
//                   setActiveField("locationFilter");
//                 } else {
//                   setShowSuggestions(false);
//                 }
//               }}
//             />
//             {showSuggestions &&
//               activeField === "locationFilter" &&
//               suggestions.length > 0 && (
//                 <div className="suggestions-dropdown">
//                   {suggestions.map((suggestion, index) => (
//                     <div
//                       key={index}
//                       className="suggestion-item"
//                       onClick={() => selectSuggestion(suggestion)}
//                     >
//                       {suggestion}
//                     </div>
//                   ))}
//                 </div>
//               )}
//           </div>
//           <input
//             type="text"
//             placeholder="Hotel name"
//             className="filter-input"
//             value={hotelFilter}
//             onChange={(e) => setHotelFilter(e.target.value)}
//           />
//           <input
//             type="date"
//             className="filter-input"
//             value={checkin}
//             onChange={(e) => {
//               setCheckin(e.target.value);
//               // Auto-set checkout to next day if not set or if checkout is before checkin
//               if (!checkout || new Date(e.target.value) >= new Date(checkout)) {
//                 const nextDay = new Date(e.target.value);
//                 nextDay.setDate(nextDay.getDate() + 1);
//                 setCheckout(nextDay.toISOString().split("T")[0]);
//               }
//             }}
//             min={new Date().toISOString().split("T")[0]}
//           />
//           <input
//             type="date"
//             className="filter-input"
//             value={checkout}
//             onChange={(e) => setCheckout(e.target.value)}
//             min={checkin || new Date().toISOString().split("T")[0]}
//           />
//           <input
//             type="number"
//             className="filter-input"
//             min="1"
//             value={guests}
//             onChange={(e) => setGuests(e.target.value)}
//           />
//           <button className="sp-filter-search-btn" onClick={onSearch}>
//             Search
//           </button>
//         </div>
//       ) : (
//         <div className="filter-bar">
//           {Object.entries(filters).map(([key, obj]) => (
//             <React.Fragment key={key}>
//               <div className="filter">
//                 {obj.open ? (
//                   <input
//                     autoFocus
//                     className="filter-input"
//                     type={
//                       key.includes("date") || key.includes("check")
//                         ? "date"
//                         : key.includes("guests")
//                         ? "number"
//                         : "text"
//                     }
//                     placeholder={key.includes("guests") ? "1" : ""}
//                     min={
//                       key.includes("guests")
//                         ? "1"
//                         : key === "checkin_filters"
//                         ? new Date().toISOString().split("T")[0]
//                         : key === "checkout_filters"
//                         ? filters.checkin_filters.value ||
//                           new Date().toISOString().split("T")[0]
//                         : undefined
//                     }
//                     value={obj.value}
//                     onChange={(e) => {
//                       update(key, e.target.value);
//                       // Auto-set checkout when checkin is selected
//                       if (key === "checkin_filters") {
//                         const checkoutValue = filters.checkout_filters.value;
//                         if (
//                           !checkoutValue ||
//                           new Date(e.target.value) >= new Date(checkoutValue)
//                         ) {
//                           const nextDay = new Date(e.target.value);
//                           nextDay.setDate(nextDay.getDate() + 1);
//                           update(
//                             "checkout_filters",
//                             nextDay.toISOString().split("T")[0]
//                           );
//                         }
//                       }
//                     }}
//                     onBlur={() => toggle(key)}
//                   />
//                 ) : (
//                   <button className="filter-btn" onClick={() => toggle(key)}>
//                     <span>
//                       {obj.value
//                         ? key.includes("guests")
//                           ? `Guests: ${obj.value}`
//                           : key.includes("check")
//                           ? fmtDate(obj.value)
//                           : obj.value
//                         : key
//                             .replace("_filters", "")
//                             .replace("_", " ")
//                             .replace(/\b\w/g, (l) => l.toUpperCase())}
//                     </span>
//                   </button>
//                 )}
//               </div>
//               <div className="separator" />
//             </React.Fragment>
//           ))}
//           <button className="filter-search-btn" onClick={onSearch}>
//             Search
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/SearchBar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchBar({
  search,
  fetchData,
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
  });

  // Standalone state for SearchPage inputs
  const [locationFilter, setLocationFilter] = useState("");
  const [hotelFilter, setHotelFilter] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("1");

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

  // Select a suggestion
  const selectSuggestion = (s) => {
    if (activeField === "location_filters") {
      updateFilter("location_filters", s);
    } else if (activeField === "locationFilter") {
      setLocationFilter(s);
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Helpers
  const toggleFilter = (key) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
  const updateFilter = (key, val) => {
    setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));
    if (key === "location_filters" && val) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fetchSuggestions(val, key), 300);
    }
  };
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

  // Pre-fill SearchPage inputs from query string
  useEffect(() => {
    if (!isSearchPage) return;
    const qs = search.startsWith("?") ? search.slice(1) : search;
    const p = new URLSearchParams(qs);
    setLocationFilter(p.get("location") || "");
    setHotelFilter(p.get("hotel") || "");
    setCheckin(p.get("checkin") || "");
    setCheckout(p.get("checkout") || "");
    setGuests(p.get("guests") || "1");
  }, [search, isSearchPage]);

  // Perform search / navigate
  const onSearch = () => {
    const params = new URLSearchParams();
    if (isSearchPage) {
      if (!locationFilter.trim() && !hotelFilter.trim()) {
        alert("Enter a location or hotel name.");
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
      fetchData(params.toString());
    } else {
      const {
        location_filters,
        hotel_filters,
        checkin_filters,
        checkout_filters,
        guests_filters,
      } = filters;
      if (!location_filters.value.trim() && !hotel_filters.value.trim()) {
        alert("Enter a location or hotel name.");
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
      params.set("guests", guests_filters.value);
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <div className={`search-bar-wrapper ${className}`}>
      {isSearchPage ? (
        <div className="sp-filter-bar">
          {/* Location + autocomplete */}
          <div style={{ position: "relative" }}>
            <input
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

          {/* Other search inputs */}
          <input
            type="text"
            placeholder="Hotel name"
            className="filter-input"
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          />
          <input
            type="date"
            className="filter-input"
            value={checkin}
            onChange={(e) => {
              setCheckin(e.target.value);
              // auto-set checkout to next day
              if (!checkout || new Date(e.target.value) >= new Date(checkout)) {
                const d = new Date(e.target.value);
                d.setDate(d.getDate() + 1);
                setCheckout(d.toISOString().split("T")[0]);
              }
            }}
            min={new Date().toISOString().split("T")[0]}
          />
          <input
            type="date"
            className="filter-input"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            min={checkin || new Date().toISOString().split("T")[0]}
          />
          <input
            type="number"
            className="filter-input"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
          <button className="sp-filter-search-btn" onClick={onSearch}>
            Search
          </button>
        </div>
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
                          : key.includes("guests")
                          ? "number"
                          : "text"
                      }
                      placeholder={key.includes("guests") ? "1" : ""}
                      min={
                        key.includes("guests")
                          ? "1"
                          : key === "checkin_filters"
                          ? new Date().toISOString().split("T")[0]
                          : key === "checkout_filters"
                          ? filters.checkin_filters.value ||
                            new Date().toISOString().split("T")[0]
                          : undefined
                      }
                      value={obj.value}
                      onChange={(e) => {
                        updateFilter(key, e.target.value);
                        // auto-set checkout_filters
                        if (key === "checkin_filters") {
                          const cv = filters.checkout_filters.value;
                          if (!cv || new Date(e.target.value) >= new Date(cv)) {
                            const d = new Date(e.target.value);
                            d.setDate(d.getDate() + 1);
                            updateFilter(
                              "checkout_filters",
                              d.toISOString().split("T")[0]
                            );
                          }
                        }
                      }}
                      onBlur={() => toggleFilter(key)}
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
                  <button
                    className="filter-btn"
                    onClick={() => toggleFilter(key)}
                  >
                    <span>
                      {obj.value
                        ? key.includes("guests")
                          ? `Guests: ${obj.value}`
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
