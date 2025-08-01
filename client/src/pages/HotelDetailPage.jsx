// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { searchHotelsAPI } from "../middleware/searchApi";
// import {
//   getHotelDetailsAPI,
//   getRoomPricingAPI,
// } from "../middleware/hotelDetailsApi";
// import Header from "../components/header";
// import FilterBar from "../components/SearchBar";
// import BookmarkButton from "../components/BookmarkButton";
// import "../styles/HotelDetailPage.css";

// export default function HotelDetailPage() {
//   const { id } = useParams();
//   const { search, state } = useLocation();
//   const navigate = useNavigate();

//   const [hotel, setHotel] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [backgroundImageUrl, setBackgroundImageUrl] = useState(
//     "/images/default-bg.jpg"
//   );

//   const isAuthenticated = () => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");
//     return !!token && !!user;
//   };

//   async function fetchDetail() {
//     const hotelDetails = state.hotelDetails;

//     // 1) grab your URL params
//     const params = new URLSearchParams(search);
//     const payload = {
//       location: params.get("location") || "",
//       hotel: hotelDetails.keyDetails.name || "",
//       checkIn: params.get("checkin") || "",
//       checkOut: params.get("checkout") || "",
//       guests: Number(params.get("guests") || 1),
//       destinationId: state.destinationId,
//     };

//     // 2) load the hotel header exactly as before
//     try {
//       const resp = await getHotelDetailsAPI(hotelDetails.keyDetails.id);
//       // const found = resp.data.hotels.find(
//       //   (h) => String(h.keyDetails.id) === id
//       // );
//       setHotel(resp || null);
//     } catch (err) {
//       console.error("Error loading hotel:", err);
//       setHotel(null);
//     }

//     // 3) *always* load mock rooms (never show empty)
//     try {
//       const roomResp = await getRoomPricingAPI(
//         hotelDetails.keyDetails.id,
//         payload
//       );
//       setRooms(roomResp.data);
//     } catch (err) {
//       console.error("Error loading rooms:", err);
//       setRooms([]);
//     }

//     setLoading(false);
//   }

//   useEffect(() => {
//     fetchDetail();
//   }, [id, search]);

//   const handleBookRoom = (room) => {
//     navigate("/checkout", {
//       state: {
//         roomName:
//           room.keyRoomDetails.name || room.keyRoomDetails.roomDescription,
//         roomPrice: room.priceDetails.price,
//       },
//     });
//   };

//   return (
//     <div
//       className="hotel-detail-page"
//       // To Be Done - image background
//       // style={{
//       //   backgroundImage: `url(${!loading && hotel && hotel.data.imgix_url})`
//       // }}
//     >
//       <Header />

//       {/* your filter bar stays exactly the same */}
//       {/* <SearchBar
//         search={search}
//         fetchData={fetchDetail}
//         isSearchPage={true}
//         className="hotel-filter"
//       /> */}

//       {!loading && hotel && (
//         <div className="detail-header">
//           <h1>{hotel.data.name}</h1>
//           <div className="address">{hotel.data.address}</div>
//           <div className="stars">{"★".repeat(hotel.data.rating)}</div>
//           <div
//             className="desription"
//             dangerouslySetInnerHTML={{ __html: hotel.data.description }}
//           />
//           {isAuthenticated() && (
//             <BookmarkButton
//               hotel={{
//                 id: hotel.keyDetails.id,
//                 name: hotel.keyDetails.name,
//                 address: hotel.keyDetails.address,
//                 rating: hotel.keyDetails.rating,
//                 price: hotel.keyDetails.price,
//                 imageUrl:
//                   hotel?.imageDetails?.stitchedImageUrls?.[0] ||
//                   "https://via.placeholder.com/300x200?text=No+Image",
//               }}
//             />
//           )}
//         </div>
//       )}

//       {loading ? (
//         <div className="loading">Loading…</div>
//       ) : (
//         <div className="room-list">
//           {rooms.map((room) => {
//             const roomKeyDetails = room.keyRoomDetails;
//             const roomPriceDetails = room.priceDetails;

//             return (
//               <div key={roomKeyDetails.keyId} className="room-card">
//                 <img
//                   src={roomKeyDetails.roomImages[0].url || ""}
//                   alt={roomKeyDetails.name}
//                 />
//                 <h3>{roomKeyDetails.name}</h3>
//                 <p>{roomKeyDetails.roomDescription}</p>
//                 <div className="room-price">SGD {roomPriceDetails.price}</div>
//                 <button
//                   className="btn book-room"
//                   onClick={() => handleBookRoom(room)}
//                 >
//                   Book
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/HotelDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getHotelDetailsAPI,
  getRoomPricingAPI,
} from "../middleware/hotelDetailsApi";
import Header from "../components/header";
import BookmarkButton from "../components/BookmarkButton";
import "../styles/HotelDetailPage.css";

export default function HotelDetailPage() {
  const { id } = useParams();
  const { search, state } = useLocation();
  const navigate = useNavigate();

  // stubbed hotel from SearchPage
  const stub = state?.hotelDetails;
  const destinationId = state?.destinationId;

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = () =>
    Boolean(localStorage.getItem("token") && localStorage.getItem("user"));

  async function fetchDetail() {
    setLoading(true);
    try {
      // 1) fetch full hotel details
      const resp = await getHotelDetailsAPI(stub.keyDetails.id);
      let detail;

      // depending on API shape:
      if (Array.isArray(resp.data.hotels)) {
        detail = resp.data.hotels.find(
          (h) => String(h.keyDetails.id) === String(id)
        );
      } else if (resp.data.hotel) {
        detail = resp.data.hotel;
      } else {
        detail = resp.data;
      }

      setHotel(detail || stub);

      // 2) fetch room pricing
      const params = new URLSearchParams(search);
      const payload = {
        location: params.get("location") || "",
        hotel: stub.keyDetails.name,
        checkIn: params.get("checkin") || "",
        checkOut: params.get("checkout") || "",
        guests: Number(params.get("guests") || 1),
        destinationId,
      };
      const roomResp = await getRoomPricingAPI(stub.keyDetails.id, payload);
      setRooms(roomResp.data || []);
    } catch (err) {
      console.error("Error loading hotel or rooms:", err);
      setHotel(stub);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (stub) fetchDetail();
  }, [id, search, stub]);

  if (loading) {
    return <div className="loading">Loading…</div>;
  }
  if (!hotel) {
    return <div>Unable to load hotel details.</div>;
  }

  return (
    <div className="hotel-detail-page">
      <Header />

      <div className="detail-header">
        <h1>{hotel.keyDetails?.name || hotel.name}</h1>
        <div className="address">
          {hotel.keyDetails?.address || hotel.address}
        </div>
        <div className="stars">
          {"★".repeat(hotel.keyDetails?.rating || hotel.rating || 0)}
        </div>
        {hotel.description && (
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: hotel.description }}
          />
        )}

        {isAuthenticated() && (
          <BookmarkButton
            hotel={{
              id: stub.keyDetails.id,
              name: stub.keyDetails.name,
              address: stub.keyDetails.address,
              rating: stub.keyDetails.rating,
              price: stub.keyDetails.price,
              imageUrl:
                stub.imageDetails?.stitchedImageUrls?.[0] ||
                "https://via.placeholder.com/300x200?text=No+Image",
            }}
          />
        )}
      </div>

      <div className="room-list">
        {rooms.map((room) => {
          const rd = room.keyRoomDetails;
          const pd = room.priceDetails;
          return (
            <div key={rd.keyId} className="room-card">
              <img
                src={rd.roomImages[0]?.url}
                alt={rd.name || rd.roomDescription}
              />
              <h3>{rd.name || rd.roomDescription}</h3>
              <p>{rd.roomDescription}</p>
              <div className="room-price">SGD {pd.price}</div>
              <button
                className="btn book-room"
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      roomName: rd.name || rd.roomDescription,
                      roomPrice: pd.price,
                    },
                  })
                }
              >
                Book
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
