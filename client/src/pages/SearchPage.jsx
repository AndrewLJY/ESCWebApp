// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/SearchPage.css";



// const dummyResults = [
//   {
//     id: 1,
//     name: "Hotel Name",
//     image: "/images/hotel.jpg",
//     stars: 5,
//     address: "Address 123",
//     distance: "x.y km away from city centre",
//     price: "SGD 200",
//   },
//   {
//     id: 2,
//     name: "Hotel Name",
//     image: "/images/hotel.jpg",
//     stars: 5,
//     address: "Address 123",
//     distance: "x.y km away from city centre",
//     price: "SGD 180",
//   },
//   {
//     id: 3,
//     name: "Hotel Name",
//     image: "/images/hotel.jpg",
//     stars: 5,
//     address: "Address 123",
//     distance: "x.y km away from city centre",
//     price: "SGD 220",
//   },
// ];

// export default function SearchPage() {
//   const navigate = useNavigate();

//   //Filters sent from landing page
//   const [filters, setFilters] = useState({
//     location: { open: false, value: "Singapore" },
//     hotel: { open: false, value: "" },
//     checkin: { open: false, value: "2025-07-01" },
//     checkout: { open: false, value: "2025-07-24" },
//     guests: { open: false, value: "2" },
//   });

//   // params set as initial dummy variables
//   const [hotels, setHotels] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchParams] = useState({
//       location: 'Singapore',
//       checkIn: '2025-07-01',
//       checkOut: '2025-07-24',
//       guests: 2,
//       hotelType: 'Hotel'
//     });

//   const toggle = (key) =>
//     setFilters((f) => ({ ...f, [key]: { ...f[key], open: !f[key].open } }));
//   const update = (key, val) =>
//     setFilters((f) => ({ ...f, [key]: { ...f[key], value: val } }));

//   const fmtDate = (iso) =>
//     iso
//       ? new Date(iso).toLocaleDateString("en-GB", {
//           weekday: "short",
//           day: "2-digit",
//           month: "2-digit",
//           year: "2-digit",
//         })
//       : "";

//   const onSearch = () => {
//     navigate(
//       `/search?location=${filters.location.value}` +
//         `&hotel=${filters.hotel.value}` +
//         `&checkin=${filters.checkin.value}` +
//         `&checkout=${filters.checkout.value}` +
//         `&guests=${filters.guests.value}`
//     );
//   };

//   return (
//     <div className="search-page">
//       {/* HEADER */}
//       <header className="sp-header">
//         <div className="sp-logo" onClick={() => navigate("/")}>
//           Ascenda
//         </div>
//         <div className="sp-actions">
//           <button className="btn login">Login</button>
//           <button className="btn book" onClick={() => navigate("/")}>
//             Book Now
//           </button>
//         </div>
//       </header>

//       <main className="sp-main">
//         {/* FILTER BAR */}
//         <div className="filter-bar-wrapper">
//           <div className="sp-filter-bar">
//             {["location", "hotel", "checkin", "checkout", "guests"].map(
//               (key, idx, arr) => (
//                 <React.Fragment key={key}>
//                   <div className="filter">
//                     {filters[key].open ? (
//                       key === "checkin" || key === "checkout" ? (
//                         <input
//                           className="filter-input"
//                           type="date"
//                           value={filters[key].value}
//                           onChange={(e) => update(key, e.target.value)}
//                           onBlur={() => toggle(key)}
//                           autoFocus
//                         />
//                       ) : key === "guests" ? (
//                         <input
//                           className="filter-input"
//                           type="number"
//                           min="1"
//                           placeholder="1"
//                           value={filters[key].value}
//                           onChange={(e) => update(key, e.target.value)}
//                           onBlur={() => toggle(key)}
//                           autoFocus
//                         />
//                       ) : (
//                         <input
//                           className="filter-input"
//                           placeholder={
//                             key === "location" ? "Where to?" : "Hotel name"
//                           }
//                           value={filters[key].value}
//                           onChange={(e) => update(key, e.target.value)}
//                           onBlur={() => toggle(key)}
//                           autoFocus
//                         />
//                       )
//                     ) : (
//                       <button
//                         className="filter-btn"
//                         onClick={() => toggle(key)}
//                       >
//                         <span>
//                           {filters[key].value ||
//                             (key === "checkin" || key === "checkout"
//                               ? key === "checkin"
//                                 ? "Check in"
//                                 : "Check out"
//                               : key.charAt(0).toUpperCase() + key.slice(1))}
//                         </span>
//                       </button>
//                     )}
//                   </div>
//                   {idx < arr.length - 1 && <div className="separator" />}
//                 </React.Fragment>
//               )
//             )}
//             <button className="filter-search-btn" onClick={onSearch}>
//               Modify
//             </button>
//           </div>
//         </div>

//         {/* SORT & FILTER CONTROLS WRAPPER */}
//         <div className="sp-controls-wrapper">
//           <section className="sp-controls">
//             <div className="sort-by">
//               <label>Sort By:</label>
//               <button className="sort-btn">
//                 Price <i className="icon-arrow-up" />
//               </button>
//               <button className="sort-btn">
//                 Review <i className="icon-arrow-down" />
//               </button>
//               <button className="sort-btn">
//                 Distance <i className="icon-arrow-up" />
//               </button>
//             </div>
//             <div className="filter-controls">
//               <div className="slider-group">
//                 <label>Min-Max Price</label>
//                 <input type="range" min="50" max="500" />
//               </div>
//               <div className="slider-group">
//                 <label>Distance</label>
//                 <input type="range" min="0" max="50" />
//               </div>
//               <button className="btn add-filter">Add Filter ▾</button>
//             </div>
//           </section>
//         </div>

//         {/* RESULTS LIST */}
//         <section className="sp-results">
//           {dummyResults.map((hotel) => (
//             <div key={hotel.id} className="hotel-card">
//               <img src={hotel.image} alt={hotel.name} className="hotel-img" />
//               <div className="hotel-info">
//                 <h3>{hotel.name}</h3>
//                 <div className="stars">{"★".repeat(hotel.stars)}</div>
//                 <p className="address">{hotel.address}</p>
//                 <p className="distance">{hotel.distance}</p>
//               </div>
//               <div className="hotel-book">
//                 <span className="price">{hotel.price}</span>
//                 <button className="btn book-small">Book</button>
//               </div>
//             </div>
//           ))}
//         </section>
//       </main>
//     </div>
//   );
// }

// // src/pages/SearchPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { searchHotels } from '../middleware/searchApi';
// import '../styles/SearchPage.css';

// export default function SearchPage() {
//   const navigate = useNavigate();

//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Params can later come from useLocation().search
//   const [searchParams] = useState({
//     location: 'Singapore',
//     checkIn: '2025-07-01',
//     checkOut: '2025-07-24',
//     guests: 2,
//     hotelType: 'Hotel'
//   });

//   useEffect(() => {
//     const fetchHotels = async () => {
//       setLoading(true);
//       try {
//         const response = await searchHotels(searchParams);
//         setHotels(response.data.hotels || []);
//       } catch (error) {
//         console.error('Error fetching hotels:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotels();
//   }, []);

//   if (loading) {
//     return <div className="search-page"><div className="loading">Loading hotels...</div></div>;
//   }

//   return (
//     <div className="search-page">
//       {/* HEADER */}
//       <header className="sp-header">
//         <div className="sp-logo" onClick={() => navigate("/")}>Ascenda</div>
//         <div className="sp-actions">
//           <button className="btn login">Login</button>
//           <button className="btn book" onClick={() => navigate("/")}>Book Now</button>
//         </div>
//       </header>

//       <main className="sp-main">
//         {/* FILTER BAR */}
//         <div className="filter-bar-wrapper">
//           <div className="sp-filter-bar">
//             <div className="filter-item"><i className="icon-location-pin" /><span>{searchParams.location}</span></div>
//             <div className="filter-item"><i className="icon-hotel" /><span>{searchParams.hotelType}</span></div>
//             <div className="filter-item"><i className="icon-calendar" /><span>Tue, 01/07/25</span></div>
//             <div className="filter-item"><i className="icon-calendar" /><span>Thu, 24/07/25</span></div>
//             <div className="filter-item"><i className="icon-user" /><span>{searchParams.guests} Guests</span></div>
//             <button className="filter-search-btn">Modify</button>
//           </div>
//         </div>

//         {/* SORT & FILTER CONTROLS */}
//         <div className="sp-controls-wrapper">
//           <section className="sp-controls">
//             <div className="sort-by">
//               <label>Sort By:</label>
//               <button className="sort-btn">Price <i className="icon-arrow-up" /></button>
//               <button className="sort-btn">Review <i className="icon-arrow-down" /></button>
//               <button className="sort-btn">Distance <i className="icon-arrow-up" /></button>
//             </div>
//             <div className="filter-controls">
//               <div className="slider-group">
//                 <label>Min-Max Price</label>
//                 <input type="range" min="50" max="500" />
//               </div>
//               <div className="slider-group">
//                 <label>Distance</label>
//                 <input type="range" min="0" max="50" />
//               </div>
//               <button className="btn add-filter">Add Filter ▾</button>
//             </div>
//           </section>
//         </div>

//         {/* RESULTS LIST */}
//         <section className="sp-results">
//           {hotels.length === 0 ? (
//             <div>No hotels found.</div>
//           ) : (
//             hotels.map((hotel) => (
//               <div key={hotel.id} className="hotel-card">
//                 <img src={hotel.image} alt={hotel.name} className="hotel-img" />
//                 <div className="hotel-info">
//                   <h3>{hotel.name}</h3>
//                   <div className="stars">{'★'.repeat(hotel.stars)}</div>
//                   <p className="address">{hotel.address}</p>
//                   <p className="distance">{hotel.distance}</p>
//                   {hotel.rating && <p className="rating">Rating: {hotel.rating}/5</p>}
//                 </div>
//                 <div className="hotel-book">
//                   <span className="price">{hotel.price}</span>
//                   <button className="btn book-small">Book</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { searchHotels } from '../middleware/searchApi';
// import '../styles/SearchPage.css';

// export default function SearchPage() {
//   const navigate = useNavigate();
//   const locationHook = useLocation();

//   const [loginOpen, setLoginOpen] = useState(false);
//   const [signupOpen, setSignupOpen] = useState(false);

//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const queryParams = new URLSearchParams(locationHook.search);
//   const searchParams = {
//     location: queryParams.get("location") || "Singapore",
//     checkIn: queryParams.get("checkin") || "2025-07-01",
//     checkOut: queryParams.get("checkout") || "2025-07-24",
//     guests: queryParams.get("guests") || 2,
//     hotelType: queryParams.get("hotel") || "Hotel"
//   };

//   useEffect(() => {
//     const fetchHotels = async () => {
//       setLoading(true);
//       try {
//         const response = await searchHotels(searchParams);
//         setHotels(response.data.hotels || []);
//       } catch (error) {
//         console.error('Error fetching hotels:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHotels();
//   }, []);

//   const closeAll = () => {
//     setLoginOpen(false);
//     setSignupOpen(false);
//   };

//   const blurred = loginOpen || signupOpen ? " blurred" : "";

//   return (
//     <div className="search-page">
//       {/* HEADER */}
//       <header className="sp-header">
//         <div className="sp-logo" onClick={() => navigate("/")}>Ascenda</div>
//         <div className="sp-actions">
//           <button className="btn login" onClick={() => {
//             closeAll();
//             setLoginOpen(true);
//           }}>Login</button>
//           <button className="btn book" onClick={() => {
//             closeAll();
//             setLoginOpen(true);
//           }}>Book Now</button>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className={`sp-main${blurred}`}>
//         {/* FILTER BAR */}
//         <div className="filter-bar-wrapper">
//           <div className="sp-filter-bar">
//             <div className="filter-item"><i className="icon-location-pin" /><span>{searchParams.location}</span></div>
//             <div className="filter-item"><i className="icon-hotel" /><span>{searchParams.hotelType}</span></div>
//             <div className="filter-item"><i className="icon-calendar" /><span>{searchParams.checkIn}</span></div>
//             <div className="filter-item"><i className="icon-calendar" /><span>{searchParams.checkOut}</span></div>
//             <div className="filter-item"><i className="icon-user" /><span>{searchParams.guests} Guests</span></div>
//             <button className="filter-search-btn">Modify</button>
//           </div>
//         </div>

//         {/* SORT/FILTER CONTROLS */}
//         <div className="sp-controls-wrapper">
//           <section className="sp-controls">
//             <div className="sort-by">
//               <label>Sort By:</label>
//               <button className="sort-btn">Price <i className="icon-arrow-up" /></button>
//               <button className="sort-btn">Review <i className="icon-arrow-down" /></button>
//               <button className="sort-btn">Distance <i className="icon-arrow-up" /></button>
//             </div>
//             <div className="filter-controls">
//               <div className="slider-group">
//                 <label>Min-Max Price</label>
//                 <input type="range" min="50" max="500" />
//               </div>
//               <div className="slider-group">
//                 <label>Distance</label>
//                 <input type="range" min="0" max="50" />
//               </div>
//               <button className="btn add-filter">Add Filter ▾</button>
//             </div>
//           </section>
//         </div>

//         {/* RESULTS LIST */}
//         <section className="sp-results">
//           {loading ? (
//             <div className="loading">Loading hotels...</div>
//           ) : hotels.length === 0 ? (
//             <div>No hotels found.</div>
//           ) : (
//             hotels.map((hotel) => (
//               <div key={hotel.id} className="hotel-card">
//                 <img src={hotel.image} alt={hotel.name} className="hotel-img" />
//                 <div className="hotel-info">
//                   <h3>{hotel.name}</h3>
//                   <div className="stars">{'★'.repeat(hotel.stars)}</div>
//                   <p className="address">{hotel.address}</p>
//                   <p className="distance">{hotel.distance}</p>
//                   {hotel.rating && <p className="rating">Rating: {hotel.rating}/5</p>}
//                 </div>
//                 <div className="hotel-book">
//                   <span className="price">{hotel.price}</span>
//                   <button className="btn book-small">Book</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </section>
//       </main>

//       {/* LOGIN DROPDOWN */}
//       {loginOpen && !signupOpen && (
//         <div className="login-dropdown">
//           <h2 className="dropdown__title">Sign In</h2>
//           <form className="login-form">
//             <div className="form-group">
//               <label htmlFor="email">Email Address</label>
//               <input id="email" type="email" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input id="password" type="password" required />
//             </div>
//             <button type="submit" className="btn submit">Sign In Now</button>
//             <p className="dropdown__signup">
//               Don’t have an account? Click{" "}
//               <button
//                 type="button"
//                 className="btn signup"
//                 onClick={() => {
//                   setSignupOpen(true);
//                   setLoginOpen(false);
//                 }}
//               >
//                 here
//               </button>
//             </p>
//             <button type="button" className="btn close" onClick={closeAll}>Close</button>
//           </form>
//         </div>
//       )}

//       {/* SIGNUP DROPDOWN */}
//       {signupOpen && !loginOpen && (
//         <div className="signup-dropdown">
//           <h2 className="dropdown__title">Create Account</h2>
//           <form className="login-form">
//             <div className="form-group">
//               <label htmlFor="new-email">Email Address</label>
//               <input id="new-email" type="email" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="new-password">Password</label>
//               <input id="new-password" type="password" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="confirm-password">Confirm Password</label>
//               <input id="confirm-password" type="password" required />
//             </div>
//             <button type="submit" className="btn submit">Sign Up Now</button>
//             <button type="button" className="btn close" onClick={closeAll}>Close</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchHotels } from '../middleware/searchApi';
import '../styles/SearchPage.css';

export default function SearchPage() {
  const navigate = useNavigate();
  const locationHook = useLocation();

  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(locationHook.search);
  const searchParams = {
    location: queryParams.get("location") || "Singapore",
    checkIn: queryParams.get("checkin") || "2025-07-01",
    checkOut: queryParams.get("checkout") || "2025-07-24",
    guests: queryParams.get("guests") || 2,
    hotelType: queryParams.get("hotel") || "Hotel"
  };

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const response = await searchHotels(searchParams);
        setHotels(response.data.hotels || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [locationHook.search]);

  const closeAll = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  // Apply "blurred" class when login or signup modals are open
  const blurClass = loginOpen || signupOpen ? " blurred" : "";

  return (
    <div className="search-page">
      {/* HEADER */}
      <header className="sp-header">
        <div className="sp-logo" onClick={() => navigate("/")}>Ascenda</div>
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

      {/* MAIN CONTENT container with blur */}
      <main className={`sp-main${blurClass}`}>
        {/* FILTER BAR */}
        <div className="filter-bar-wrapper">
          <div className="sp-filter-bar">
            <div className="filter-item"><i className="icon-location-pin" /><span>{searchParams.location}</span></div>
            <div className="filter-item"><i className="icon-hotel" /><span>{searchParams.hotelType}</span></div>
            <div className="filter-item"><i className="icon-calendar" /><span>{searchParams.checkIn}</span></div>
            <div className="filter-item"><i className="icon-calendar" /><span>{searchParams.checkOut}</span></div>
            <div className="filter-item"><i className="icon-user" /><span>{searchParams.guests} Guests</span></div>
            <button className="filter-search-btn">Modify</button>
          </div>
        </div>

        {/* SORT/FILTER CONTROLS */}
        <div className="sp-controls-wrapper">
          <section className="sp-controls">
            <div className="sort-by">
              <label>Sort By:</label>
              <button className="sort-btn">Price <i className="icon-arrow-up" /></button>
              <button className="sort-btn">Review <i className="icon-arrow-down" /></button>
              <button className="sort-btn">Distance <i className="icon-arrow-up" /></button>
            </div>
            <div className="filter-controls">
              <div className="slider-group">
                <label>Min-Max Price</label>
                <input type="range" min="50" max="500" />
              </div>
              <div className="slider-group">
                <label>Distance</label>
                <input type="range" min="0" max="50" />
              </div>
              <button className="btn add-filter">Add Filter ▾</button>
            </div>
          </section>
        </div>

        {/* RESULTS LIST */}
        <section className="sp-results">
          {loading ? (
            <div className="loading">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div>No hotels found.</div>
          ) : (
            hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <img src={hotel.image} alt={hotel.name} className="hotel-img" />
                <div className="hotel-info">
                  <h3>{hotel.name}</h3>
                  <div className="stars">{'★'.repeat(hotel.stars)}</div>
                  <p className="address">{hotel.address}</p>
                  <p className="distance">{hotel.distance}</p>
                  {hotel.rating && <p className="rating">Rating: {hotel.rating}/5</p>}
                </div>
                <div className="hotel-book">
                  <span className="price">{hotel.price}</span>
                  <button className="btn book-small">Book</button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* LOGIN MODAL */}
      {loginOpen && !signupOpen && (
        <div className="login-dropdown">
          <h2 className="dropdown__title">Sign In</h2>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" required />
            </div>
            <button type="submit" className="btn submit">Sign In Now</button>
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
            <button type="button" className="btn close" onClick={closeAll}>Close</button>
          </form>
        </div>
      )}

      {/* SIGNUP MODAL */}
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
            <button type="submit" className="btn submit">Sign Up Now</button>
            <button type="button" className="btn close" onClick={closeAll}>Close</button>
          </form>
        </div>
      )}
    </div>
  );
}



