// // src/pages/HotelDetailPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useLocation } from "react-router-dom";
// import { searchHotelsAPI } from "../middleware/searchApi";
// import Header from "../components/header";
// import FilterBar from "../components/FilterBar.jsx";
// import "../styles/HotelDetailPage.css";

// export default function HotelDetailPage() {
//   const { id } = useParams();
//   const { search } = useLocation();
//   const [hotel, setHotel] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const onSearch = async () => {
//     setLoading(true);
//     const params = new URLSearchParams(search);
//     try {
//       const resp = await searchHotelsAPI({
//         location: params.get("location") || "",
//         hotel: "",
//         checkIn: params.get("checkin") || "",
//         checkOut: params.get("checkout") || "",
//         guests: Number(params.get("guests") || 1),
//       });
//       const found = resp.data.hotels.find(
//         (h) => String(h.keyDetails.id) === id
//       );
//       setHotel(found || null);
//     } catch (e) {
//       console.error("Detail load error:", e);
//       setHotel(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     onSearch();
//   }, [id, search]);

//   const handleBookRoom = (room) => {
//     alert(`Booking room: ${room.name}\nPrice: SGD ${room.price}`);
//   };

//   return (
//     <div className="hotel-detail-page">
//       <Header />
//       <FilterBar
//         search={search}
//         fetchData={onSearch}
//         isSearchPage={true}
//         className="hotel-filter"
//       />

//       {!loading && hotel && (
//         <div className="detail-header">
//           <h1>{hotel.keyDetails.name}</h1>
//           <div className="address">{hotel.keyDetails.address}</div>
//           <div className="stars">{"★".repeat(hotel.keyDetails.rating)}</div>
//         </div>
//       )}

//       {loading ? (
//         <div className="loading">Loading…</div>
//       ) : !hotel ? (
//         <div className="loading">Hotel not found</div>
//       ) : (
//         <div className="room-list">
//           {hotel.rooms?.map((room) => (
//             <div key={room.id} className="room-card">
//               <img src={room.imageUrl} alt={room.name} />
//               <h3>{room.name}</h3>
//               <p>{room.description}</p>
//               <div className="room-price">SGD {room.price}</div>
//               <button
//                 className="btn book-room"
//                 onClick={() => handleBookRoom(room)}
//               >
//                 Book this room
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import { searchRoomsAPI } from "../middleware/searchroomApi";
import Header from "../components/header";
import FilterBar from "../components/FilterBar";
import "../styles/HotelDetailPage.css";

// import PaymentPage from "./pages/PaymentPage"; # Payment Page to be implemented later

export default function HotelDetailPage() {
  const { id } = useParams();
  const { search } = useLocation();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);

      // 1) grab your URL params
      const params = new URLSearchParams(search);
      const payload = {
        location: params.get("location") || "",
        hotel: "",
        checkIn: params.get("checkin") || "",
        checkOut: params.get("checkout") || "",
        guests: Number(params.get("guests") || 1),
      };

      // 2) load the hotel header exactly as before
      try {
        const resp = await searchHotelsAPI(payload);
        const found = resp.data.hotels.find(
          (h) => String(h.keyDetails.id) === id
        );
        setHotel(found || null);
      } catch (err) {
        console.error("Error loading hotel:", err);
        setHotel(null);
      }

      // 3) *always* load mock rooms (never show empty)
      try {
        const roomResp = await searchRoomsAPI(id);
        setRooms(roomResp.data.rooms);
      } catch (err) {
        console.error("Error loading rooms:", err);
        setRooms([]);
      }

      setLoading(false);
    }

    fetchDetail();
  }, [id, search]);

  const handleBookRoom = (room) =>
    alert(`Booking room: ${room.name}\nPrice: SGD ${room.price}`);

  return (
    <div className="hotel-detail-page"> 
      <header>
        {/* your filter bar stays exactly the same */}
        <FilterBar
          search={search}
          fetchData={() => {}}
          isSearchPage={true}
          className="hotel-filter"
        />
      </header>
      <main>
        {/* —————————————————————————————— */}
        {/* HOTEL HEADER (unchanged) */}
        {!loading && hotel && (
          <div className="detail-header">
            <h1>{hotel.keyDetails.name}</h1>
            <div className="address">{hotel.keyDetails.address}</div>
            <div className="stars">{"★".repeat(hotel.keyDetails.rating)}</div>
          </div>
        )}

        {/* —————————————————————————————— */}
        {/* NOW: ALWAYS SHOW MOCK ROOMS BELOW */}
        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <div className="room-list">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <img src={room.imageUrl} alt={room.name} />
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <div className="room-price">SGD {room.price}</div>
                <button
                  className="btn book-room"
                  onClick={() => handleBookRoom(room)}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
          )}
      </main>
    </div>
  );
}
