// import React, { useState, useEffect, useCallback } from "react";
// import "../styles/FilterBar.css";
// import { useNavigate } from "react-router-dom";

// export default function FilterBar({ search, fetchData, isSearchPage = false }) {
//   const navigate = useNavigate();
//   const [filters, setFilters] = useState({
//     location_filters: { open: false, value: "" },
//     hotel_filters: { open: false, value: "" },
//     checkin_filters: { open: false, value: "" },
//     checkout_filters: { open: false, value: "" },
//     guests_filters: { open: false, value: "" },
//   });

//   // Controlled filter state
//   const [locationFilter, setLocationFilter] = useState("");
//   const [hotelFilter, setHotelFilter] = useState("");
//   const [checkin, setCheckin] = useState("");
//   const [checkout, setCheckout] = useState("");
//   const [guests, setGuests] = useState("1");

//   const toggle = (key) =>
//     setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));

//   const update = (key, val) =>
//     setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));

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
//     if (!guests_filters.value && !guests) {
//       alert("Please specify number of guests.");
//       return;
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
//       const qs = search.startsWith("?") ? search.substring(1) : search;
//       const params = new URLSearchParams(qs);
//       setLocationFilter(params.get("location") || "");
//       setHotelFilter(params.get("hotel") || "");
//       setCheckin(params.get("checkin") || "");
//       setCheckout(params.get("checkout") || "");
//       setGuests(params.get("guests") || "1");
//     }
//   }, [search, fetchData]);

//   return (
//     <div>
//       {isSearchPage ? (
//         <div className="sp-filter-bar">
//           <input
//             className="filter-input"
//             type="text"
//             placeholder="Location"
//             value={locationFilter}
//             onChange={(e) => {
//               setLocationFilter(e.target.value);
//             }}
//           />
//           <input
//             className="filter-input"
//             type="text"
//             placeholder="Hotel name"
//             value={hotelFilter}
//             onChange={(e) => {
//               setHotelFilter(e.target.value);
//             }}
//           />
//           <input
//             placeholder="Check-in"
//             className="filter-input"
//             type="date"
//             value={checkin}
//             onChange={(e) => setCheckin(e.target.value)}
//           />
//           <input
//             placeholder="Check-out"
//             className="filter-input"
//             type="date"
//             value={checkout}
//             onChange={(e) => setCheckout(e.target.value)}
//           />
//           <input
//             className="filter-input"
//             type="number"
//             min="1"
//             placeholder="Guests"
//             value={guests}
//             onChange={(e) => setGuests(e.target.value)}
//           />
//           <button className="sp-filter-search-btn" onClick={onSearch}>
//             Search
//           </button>
//         </div>
//       ) : (
//         <div className="filter-bar">
//           <div className="filter">
//             {filters.location_filters.open ? (
//               <input
//                 className="filter-input"
//                 placeholder="Where to?"
//                 value={filters.location_filters.value}
//                 onChange={(e) => update("location_filters", e.target.value)}
//                 onBlur={() => toggle("location_filters")}
//                 autoFocus
//               />
//             ) : (
//               <button
//                 className="filter-btn"
//                 onClick={() => toggle("location_filters")}
//               >
//                 <span>{filters.location_filters.value || "Location"}</span>
//               </button>
//             )}
//           </div>
//           <div className="separator" />

//           <div className="filter">
//             {filters.hotel_filters.open ? (
//               <input
//                 className="filter-input"
//                 placeholder="Hotel name"
//                 value={filters.hotel_filters.value}
//                 onChange={(e) => update("hotel_filters", e.target.value)}
//                 onBlur={() => toggle("hotel_filters")}
//                 autoFocus
//               />
//             ) : (
//               <button
//                 className="filter-btn"
//                 onClick={() => toggle("hotel_filters")}
//               >
//                 <span>{filters.hotel_filters.value || "Hotel"}</span>
//               </button>
//             )}
//           </div>
//           <div className="separator" />

//           <div className="filter">
//             {filters.checkin_filters.open ? (
//               <input
//                 className="filter-input"
//                 type="date"
//                 value={filters.checkin_filters.value}
//                 onChange={(e) => update("checkin_filters", e.target.value)}
//                 onBlur={() => toggle("checkin_filters")}
//                 autoFocus
//               />
//             ) : (
//               <button
//                 className="filter-btn"
//                 onClick={() => toggle("checkin_filters")}
//               >
//                 <span>
//                   {filters.checkin_filters.value
//                     ? fmtDate(filters.checkin_filters.value)
//                     : "Check in"}
//                 </span>
//               </button>
//             )}
//           </div>
//           <div className="separator" />

//           <div className="filter">
//             {filters.checkout_filters.open ? (
//               <input
//                 className="filter-input"
//                 type="date"
//                 value={filters.checkout_filters.value}
//                 onChange={(e) => update("checkout_filters", e.target.value)}
//                 onBlur={() => toggle("checkout_filters")}
//                 autoFocus
//               />
//             ) : (
//               <button
//                 className="filter-btn"
//                 onClick={() => toggle("checkout_filters")}
//               >
//                 <span>
//                   {filters.checkout_filters.value
//                     ? fmtDate(filters.checkout_filters.value)
//                     : "Check out"}
//                 </span>
//               </button>
//             )}
//           </div>
//           <div className="separator" />

//           <div className="filter">
//             {filters.guests_filters.open ? (
//               <input
//                 className="filter-input"
//                 type="number"
//                 min="1"
//                 placeholder="1"
//                 value={filters.guests_filters.value}
//                 onChange={(e) => update("guests_filters", e.target.value)}
//                 onBlur={() => toggle("guests_filters")}
//                 autoFocus
//               />
//             ) : (
//               <button
//                 className="filter-btn"
//                 onClick={() => toggle("guests_filters")}
//               >
//                 <span>
//                   {filters.guests_filters.value
//                     ? `Guests: ${filters.guests_filters.value}`
//                     : "Guests"}
//                 </span>
//               </button>
//             )}
//           </div>

//           <button className="filter-search-btn" onClick={onSearch}>
//             Search
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
// src/components/FilterBar.jsx
import React, { useState, useEffect } from "react";
import "../styles/FilterBar.css";
import { useNavigate } from "react-router-dom";

export default function FilterBar({ search, fetchData, isSearchPage = false }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location_filters: { open: false, value: "" },
    hotel_filters: { open: false, value: "" },
    checkin_filters: { open: false, value: "" },
    checkout_filters: { open: false, value: "" },
    guests_filters: { open: false, value: "" },
  });

  const [locationFilter, setLocationFilter] = useState("");
  const [hotelFilter, setHotelFilter] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("1");

  const toggle = (key) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
  const update = (key, val) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "");

  const onSearch = () => {
    const {
      location_filters,
      hotel_filters,
      checkin_filters,
      checkout_filters,
      guests_filters,
    } = filters;

    // 1) Location/hotel required
    if (
      !location_filters.value.trim() &&
      !hotel_filters.value.trim() &&
      !locationFilter.trim() &&
      !hotelFilter.trim()
    ) {
      alert("Please enter a location or a hotel name.");
      return;
    }

    // 2) Dates required
    if (!checkin_filters.value && !checkin) {
      alert("Please select a check-in date.");
      return;
    }
    if (!checkout_filters.value && !checkout) {
      alert("Please select a check-out date.");
      return;
    }

    // 3) Guests required — split per mode
    if (isSearchPage) {
      // on the SearchPage view, use the controlled `guests`
      if (!guests) {
        alert("Please specify number of guests.");
        return;
      }
    } else {
      // on the LandingPage view, use filters.guests_filters.value
      if (!guests_filters.value) {
        alert("Please specify number of guests.");
        return;
      }
    }

    // 4) Build query params
    const params = new URLSearchParams();
    if (isSearchPage) {
      if (locationFilter.trim()) params.set("location", locationFilter.trim());
      if (hotelFilter.trim()) params.set("hotel", hotelFilter.trim());
      params.set("checkin", checkin);
      params.set("checkout", checkout);
      params.set("guests", guests);
    } else {
      if (location_filters.value.trim())
        params.set("location", location_filters.value.trim());
      if (hotel_filters.value.trim())
        params.set("hotel", hotel_filters.value.trim());
      params.set("checkin", checkin_filters.value);
      params.set("checkout", checkout_filters.value);
      params.set("guests", guests_filters.value);
    }

    // 5) Navigate
    navigate(`/search?${params.toString()}`);
  };

  // Populate controlled state when on SearchPage
  useEffect(() => {
    if (isSearchPage) {
      const qs = search.startsWith("?") ? search.slice(1) : search;
      const params = new URLSearchParams(qs);
      setLocationFilter(params.get("location") || "");
      setHotelFilter(params.get("hotel") || "");
      setCheckin(params.get("checkin") || "");
      setCheckout(params.get("checkout") || "");
      setGuests(params.get("guests") || "1");
    }
  }, [search, fetchData, isSearchPage]);

  return (
    <div>
      {isSearchPage ? (
        // --- SearchPage filter UI ---
        <div className="sp-filter-bar">
          <input
            type="text"
            placeholder="Location"
            className="filter-input"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Hotel name"
            className="filter-input"
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          />
          <input
            type="date"
            placeholder="Check-in"
            className="filter-input"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
          <input
            type="date"
            placeholder="Check-out"
            className="filter-input"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
          <input
            type="number"
            placeholder="Guests"
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
        // --- LandingPage filter UI ---
        <div className="filter-bar">
          {/* Location */}
          <div className="filter">
            {filters.location_filters.open ? (
              <input
                autoFocus
                className="filter-input"
                placeholder="Where to?"
                value={filters.location_filters.value}
                onChange={(e) => update("location_filters", e.target.value)}
                onBlur={() => toggle("location_filters")}
              />
            ) : (
              <button
                className="filter-btn"
                onClick={() => toggle("location_filters")}
              >
                <span>{filters.location_filters.value || "Location"}</span>
              </button>
            )}
          </div>
          <div className="separator" />

          {/* Hotel */}
          <div className="filter">
            {filters.hotel_filters.open ? (
              <input
                autoFocus
                className="filter-input"
                placeholder="Hotel name"
                value={filters.hotel_filters.value}
                onChange={(e) => update("hotel_filters", e.target.value)}
                onBlur={() => toggle("hotel_filters")}
              />
            ) : (
              <button
                className="filter-btn"
                onClick={() => toggle("hotel_filters")}
              >
                <span>{filters.hotel_filters.value || "Hotel"}</span>
              </button>
            )}
          </div>
          <div className="separator" />

          {/* Check-in */}
          <div className="filter">
            {filters.checkin_filters.open ? (
              <input
                autoFocus
                className="filter-input"
                type="date"
                value={filters.checkin_filters.value}
                onChange={(e) => update("checkin_filters", e.target.value)}
                onBlur={() => toggle("checkin_filters")}
              />
            ) : (
              <button
                className="filter-btn"
                onClick={() => toggle("checkin_filters")}
              >
                <span>
                  {filters.checkin_filters.value
                    ? fmtDate(filters.checkin_filters.value)
                    : "Check in"}
                </span>
              </button>
            )}
          </div>
          <div className="separator" />

          {/* Check-out */}
          <div className="filter">
            {filters.checkout_filters.open ? (
              <input
                autoFocus
                className="filter-input"
                type="date"
                value={filters.checkout_filters.value}
                onChange={(e) => update("checkout_filters", e.target.value)}
                onBlur={() => toggle("checkout_filters")}
              />
            ) : (
              <button
                className="filter-btn"
                onClick={() => toggle("checkout_filters")}
              >
                <span>
                  {filters.checkout_filters.value
                    ? fmtDate(filters.checkout_filters.value)
                    : "Check out"}
                </span>
              </button>
            )}
          </div>
          <div className="separator" />

          {/* Guests */}
          <div className="filter">
            {filters.guests_filters.open ? (
              <input
                autoFocus
                className="filter-input"
                type="number"
                min="1"
                placeholder="1"
                value={filters.guests_filters.value}
                onChange={(e) => update("guests_filters", e.target.value)}
                onBlur={() => toggle("guests_filters")}
              />
            ) : (
              <button
                className="filter-btn"
                onClick={() => toggle("guests_filters")}
              >
                <span>
                  {filters.guests_filters.value
                    ? `Guests: ${filters.guests_filters.value}`
                    : "Guests"}
                </span>
              </button>
            )}
          </div>

          <button className="filter-search-btn" onClick={onSearch}>
            Search
          </button>
        </div>
      )}
    </div>
  );
}
