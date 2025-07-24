// // src/pages/SearchPage.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { searchHotelsAPI } from "../middleware/searchApi";
// import Header from "../components/header";
// import "../styles/SearchPage.css";

// export default function SearchPage() {
//   const navigate = useNavigate();
//   const locationHook = useLocation();

//   // URL‑driven filters
//   const ip = new URLSearchParams(locationHook.search);
//   const [filters, setFilters] = useState({
//     location: { open: false, value: ip.get("location") || "Singapore" },
//     hotel: { open: false, value: ip.get("hotel") || "" },
//     checkin: { open: false, value: ip.get("checkin") || "2025-07-01" },
//     checkout: { open: false, value: ip.get("checkout") || "2025-07-24" },
//     guests: { open: false, value: ip.get("guests") || "2" },
//   });
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fmtDate = (iso) =>
//     iso
//       ? new Date(iso).toLocaleDateString("en-GB", {
//           weekday: "short",
//           day: "2-digit",
//           month: "2-digit",
//           year: "2-digit",
//         })
//       : "";

//   const toggle = (key) =>
//     setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
//   const update = (key, v) =>
//     setFilters((f) => ({ ...f, [key]: { ...f[key], value: v } }));

//   // re-navigate on “Search”
//   const onModify = () => {
//     const { location, hotel, checkin, checkout, guests } = filters;
//     if (!location.value.trim() && !hotel.value.trim()) {
//       alert("Enter a location or hotel name.");
//       return;
//     }
//     if (!checkin.value || !checkout.value || !guests.value) {
//       alert("Select check‑in, check‑out, and guest count.");
//       return;
//     }
//     const p = new URLSearchParams();
//     location.value.trim() && p.set("location", location.value.trim());
//     hotel.value.trim() && p.set("hotel", hotel.value.trim());
//     p.set("checkin", checkin.value);
//     p.set("checkout", checkout.value);
//     p.set("guests", guests.value);
//     navigate(`/search?${p.toString()}`);
//   };

//   // fetch on URL change
//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const r = await searchHotelsAPI({
//           location: filters.location.value,
//           hotelType: "Hotel",
//           hotel: filters.hotel.value,
//           checkIn: filters.checkin.value,
//           checkOut: filters.checkout.value,
//           guests: Number(filters.guests.value),
//         });
//         setHotels(r.data.hotels || []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [locationHook.search]);

//   return (
//     <>
//       <Header />
//       <div className="search-page">
//         <main className="sp-main">
//           <div className="filter-bar-wrapper">
//             <div className="sp-filter-bar">
//               {["location", "hotel", "checkin", "checkout", "guests"].map(
//                 (key) => (
//                   <React.Fragment key={key}>
//                     <div className="filter">
//                       {filters[key].open ? (
//                         <input
//                           className="filter-input"
//                           type={
//                             key === "guests"
//                               ? "number"
//                               : key.includes("check")
//                               ? "date"
//                               : "text"
//                           }
//                           placeholder={
//                             key === "location"
//                               ? "Where to?"
//                               : key === "hotel"
//                               ? "Hotel name"
//                               : undefined
//                           }
//                           value={filters[key].value}
//                           onChange={(e) => update(key, e.target.value)}
//                           onBlur={() => toggle(key)}
//                           autoFocus
//                         />
//                       ) : (
//                         <button
//                           className="filter-btn"
//                           onClick={() => toggle(key)}
//                         >
//                           <span>
//                             {filters[key].value ||
//                               (key === "checkin"
//                                 ? "Check in"
//                                 : key === "checkout"
//                                 ? "Check out"
//                                 : key.charAt(0).toUpperCase() + key.slice(1))}
//                           </span>
//                         </button>
//                       )}
//                     </div>
//                     <div className="separator" />
//                   </React.Fragment>
//                 )
//               )}
//               <button className="filter-search-btn" onClick={onModify}>
//                 Search
//               </button>
//             </div>
//           </div>

//           <section className="sp-results">
//             {loading ? (
//               <div className="loading">Loading hotels...</div>
//             ) : hotels.length === 0 ? (
//               <div>No hotels found.</div>
//             ) : (
//               hotels.map((h) => (
//                 <div key={h.keyDetails.id} className="hotel-card">
//                   <img
//                     className="hotel-img"
//                     src={
//                       h.imageDetails.imageCounts > 0
//                         ? h.imageDetails.stitchedImageUrls[0]
//                         : "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"
//                     }
//                     alt={h.keyDetails.name}
//                   />
//                   <div className="hotel-info">
//                     <h3>{h.keyDetails.name}</h3>
//                     <div className="stars">
//                       {"★".repeat(h.keyDetails.rating)}
//                     </div>
//                     <p className="address">{h.keyDetails.address}</p>
//                     <p className="distance">
//                       {Math.floor(h.keyDetails.distance)} km
//                     </p>
//                     <p className="rating">
//                       Rating:{" "}
//                       {h.keyDetails.rating ? `${h.keyDetails.rating}/5` : "NA"}
//                     </p>
//                   </div>
//                   <div className="hotel-book">
//                     <span className="price">
//                       {h.keyDetails.price
//                         ? `SGD ${h.keyDetails.price}`
//                         : "SGD 140"}
//                     </span>
//                     <button className="btn book-small">Book</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </section>
//         </main>
//       </div>
//     </>
//   );
// }
// src/pages/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import Header from "../components/header";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const locationHook = useLocation();

  // Initialize filters from URL params
  const params = new URLSearchParams(locationHook.search);
  const [filters, setFilters] = useState({
    location: { open: false, value: params.get("location") || "Singapore" },
    hotel: { open: false, value: params.get("hotel") || "" },
    checkin: { open: false, value: params.get("checkin") || "2025-07-01" },
    checkout: { open: false, value: params.get("checkout") || "2025-07-24" },
    guests: { open: false, value: params.get("guests") || "2" },
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggle = (key) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
  const update = (key, v) =>
    setFilters((f) => ({ ...f, [key]: { ...f[key], value: v } }));

  const onModify = () => {
    const { location, hotel, checkin, checkout, guests } = filters;
    if (!location.value.trim() && !hotel.value.trim()) {
      alert("Enter a location or hotel name.");
      return;
    }
    if (!checkin.value || !checkout.value || !guests.value) {
      alert("Select check‑in, check‑out, and guest count.");
      return;
    }
    const q = new URLSearchParams();
    location.value.trim() && q.set("location", location.value.trim());
    hotel.value.trim() && q.set("hotel", hotel.value.trim());
    q.set("checkin", checkin.value);
    q.set("checkout", checkout.value);
    q.set("guests", guests.value);
    navigate(`/search?${q.toString()}`);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await searchHotelsAPI({
          location: filters.location.value,
          hotelType: "Hotel",
          hotel: filters.hotel.value,
          checkIn: filters.checkin.value,
          checkOut: filters.checkout.value,
          guests: Number(filters.guests.value),
        });
        setHotels(r.data.hotels || []);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [locationHook.search]);

  return (
    <div className="search-page">
      <Header />

      <main className="sp-main">
        <div className="filter-bar-wrapper">
          <div className="sp-filter-bar">
            {["location", "hotel", "checkin", "checkout", "guests"].map(
              (key) => (
                <React.Fragment key={key}>
                  <div className="filter">
                    {filters[key].open ? (
                      <input
                        className="filter-input"
                        type={
                          key === "guests"
                            ? "number"
                            : key.includes("check")
                            ? "date"
                            : "text"
                        }
                        placeholder={
                          key === "location"
                            ? "Where to?"
                            : key === "hotel"
                            ? "Hotel name"
                            : undefined
                        }
                        value={filters[key].value}
                        onChange={(e) => update(key, e.target.value)}
                        onBlur={() => toggle(key)}
                        autoFocus
                      />
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
              Search
            </button>
          </div>
        </div>

        <section className="sp-results">
          {loading ? (
            <div className="loading">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div>No hotels found.</div>
          ) : (
            hotels.map((h) => (
              <div key={h.keyDetails.id} className="hotel-card">
                <img
                  className="hotel-img"
                  src={
                    h.imageDetails.imageCounts > 0
                      ? h.imageDetails.stitchedImageUrls[0]
                      : "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"
                  }
                  alt={h.keyDetails.name}
                />
                <div className="hotel-info">
                  <h3>{h.keyDetails.name}</h3>
                  <div className="stars">{"★".repeat(h.keyDetails.rating)}</div>
                  <p className="address">{h.keyDetails.address}</p>
                  <p className="distance">
                    {Math.floor(h.keyDetails.distance)} km
                  </p>
                  <p className="rating">
                    Rating:{" "}
                    {h.keyDetails.rating ? `${h.keyDetails.rating}/5` : "NA"}
                  </p>
                </div>
                <div className="hotel-book">
                  <span className="price">
                    {h.keyDetails.price
                      ? `SGD ${h.keyDetails.price}`
                      : "SGD 140"}
                  </span>
                  <button className="btn book-small">Book</button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
