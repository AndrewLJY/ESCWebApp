// // src/pages/SearchPage.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { searchHotelsAPI } from "../middleware/searchApi";
// import Header from "../components/header";
// import SearchBar from "../components/SearchBar";
// import "../styles/SearchPage.css";

// export default function SearchPage() {
//   const navigate = useNavigate();
//   const { search } = useLocation();

//   const [hotels, setHotels] = useState([]);
//   const [destinationId, setDestinationId] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Fetch hotels (real API or fallback mock)
//   const fetchData = useCallback(async (queryString) => {
//     setLoading(true);

//     const payload = { hotelType: "Hotel" };
//     const params = new URLSearchParams(queryString);
//     if (params.get("location")) payload.location = params.get("location");
//     if (params.get("hotel")) payload.hotel = params.get("hotel");
//     if (params.get("checkin")) payload.checkIn = params.get("checkin");
//     if (params.get("checkout")) payload.checkOut = params.get("checkout");
//     if (params.get("guests")) payload.guests = Number(params.get("guests"));

//     try {
//       const resp = await searchHotelsAPI(payload);
//       console.log(resp);
//       let data = resp.data.hotels || [];
//       if (payload.hotel) {
//         const name = payload.hotel.toLowerCase();
//         data = data.filter((h) =>
//           h.keyDetails.name.toLowerCase().includes(name)
//         );
//       }

//       setHotels(data);
//       setDestinationId(resp.data.destination_id);
//     } catch (err) {
//       console.error("Search error:", err);
//       setHotels([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Run fetch on mount and whenever the query string changes
//   useEffect(() => {
//     const qs = search.startsWith("?") ? search.slice(1) : search;
//     fetchData(qs);
//   }, [search, fetchData]);

//   return (
//     <div className="search-page">
//       <Header />

//       <main className="sp-main">
//         <div className="filter-bar-wrapper">
//           <SearchBar
//             search={search}
//             fetchData={fetchData}
//             isSearchPage={true}
//           />
//         </div>

//         <section className="sp-results">
//           {loading ? (
//             <div className="loading">Loading hotels...</div>
//           ) : hotels.length === 0 ? (
//             <div>No hotels found.</div>
//           ) : (
//             hotels.map((h) => (
//               <div key={h.keyDetails.id} className="hotel-card">
//                 <img
//                   className="hotel-img"
//                   src={
//                     h.imageDetails.imageCounts > 0
//                       ? h.imageDetails.stitchedImageUrls[0]
//                       : "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg"
//                   }
//                   alt={h.keyDetails.name}
//                 />

//                 <div className="hotel-info">
//                   <h3>{h.keyDetails.name}</h3>
//                   <div className="stars">{"★".repeat(h.keyDetails.rating)}</div>
//                   <p className="address">{h.keyDetails.address}</p>
//                   <p className="distance">
//                     {Math.floor(h.keyDetails.distance)} km
//                   </p>
//                   <p className="rating">
//                     Rating:{" "}
//                     {h.keyDetails.rating ? `${h.keyDetails.rating}/5` : "NA"}
//                   </p>
//                 </div>

//                 <div className="hotel-book">
//                   {/* <span className="price">
//                     {h.keyDetails.price
//                       ? `SGD ${h.keyDetails.price}`
//                       : "SGD 140"}
//                   </span> */}
//                   <button
//                     className="btn book-small"
//                     // include the original search query so detail page has the same filters
//                     onClick={() =>
//                       navigate(`/hotel/${h.keyDetails.id}${search}`, {
//                         state: {
//                           hotelDetails: h,
//                           destinationId: destinationId,
//                         },
//                       })
//                     }
//                   >
//                     View More Details
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }
// src/pages/SearchPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import Header from "../components/header";
import SearchBar from "../components/SearchBar";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const [hotels, setHotels] = useState([]);
  const [destinationId, setDestinationId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch hotels (real API or fallback mock)
  const fetchData = useCallback(async (queryString) => {
    setLoading(true);

    const payload = { hotelType: "Hotel" };
    const params = new URLSearchParams(queryString);
    if (params.get("location")) payload.location = params.get("location");
    if (params.get("hotel")) payload.hotel = params.get("hotel");
    if (params.get("checkin")) payload.checkIn = params.get("checkin");
    if (params.get("checkout")) payload.checkOut = params.get("checkout");
    if (params.get("guests")) payload.guests = Number(params.get("guests"));

    try {
      const resp = await searchHotelsAPI(payload);
      console.log(resp);
      let data = resp.data.hotels || [];
      if (payload.hotel) {
        const name = payload.hotel.toLowerCase();
        data = data.filter((h) =>
          h.keyDetails.name.toLowerCase().includes(name)
        );
      }

      setHotels(data);
      setDestinationId(resp.data.destination_id);
    } catch (err) {
      console.error("Search error:", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run fetch on mount and whenever the query string changes
  useEffect(() => {
    const qs = search.startsWith("?") ? search.slice(1) : search;
    fetchData(qs);
  }, [search, fetchData]);

  return (
    <div className="search-page">
      <Header />

      <main className="sp-main">
        <div className="filter-bar-wrapper">
          <SearchBar
            search={search}
            fetchData={fetchData}
            isSearchPage={true}
          />
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
                  src={(() => {
                    // Prefer stitchedImageUrls if available
                    if (
                      Array.isArray(h.imageDetails.stitchedImageUrls) &&
                      h.imageDetails.stitchedImageUrls.length > 0
                    ) {
                      return h.imageDetails.stitchedImageUrls[0];
                    }
                    // Otherwise try a thumbnailUrl if your API provides it
                    if (h.imageDetails.thumbnailUrl) {
                      return h.imageDetails.thumbnailUrl;
                    }
                    // Fallback to default placeholder
                    return "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg";
                  })()}
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
                  <button
                    className="btn book-small"
                    onClick={() =>
                      navigate(`/hotel/${h.keyDetails.id}${search}`, {
                        state: {
                          hotelDetails: h,
                          destinationId: destinationId,
                        },
                      })
                    }
                  >
                    View More Details
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
