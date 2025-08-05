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
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";

import {
  getHotelDetailsAPI,
  getRoomPricingAPI,
} from "../middleware/hotelDetailsApi";
import Header from "../components/header";
import "../styles/HotelDetailPage.css";

const env = await import.meta.env;
const MAP_API_KEY = `${env.VITE_GOOGLE_MAPS_API_KEY}`;

export default function HotelDetailPage() {
  const { id } = useParams();
  const { search, state } = useLocation();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "/images/default-bg.jpg"
  );

  useEffect(() => {
    async function fetchDetail() {
      setHotelDetails(state.hotelDetails);
    }

    fetchDetail();
  }, [id, search]);

  useEffect(() => {
    async function getRooms() {
      // 3) *always* load mock rooms (never show empty)
      try {
        const roomResp = await getRoomPricingAPI(
          hotelDetails.keyDetails.id,
          payload
        );
        setRooms(roomResp.data);
      } catch (err) {
        console.error("Error loading rooms:", err);
        setRooms([]);
      }
    }

    if (payload != null && hotelDetails != null) {
      getRooms();
    }
  }, [payload, hotelDetails]);

  useEffect(() => {
    async function getHotelDetails() {
      // 1) grab your URL params
      const params = new URLSearchParams(search);
      setPayload({
        location: params.get("location") || "",
        hotel: hotelDetails.keyDetails.name || "",
        checkIn: params.get("checkin") || "",
        checkOut: params.get("checkout") || "",
        guests: Number(params.get("guests") || 1),
        destinationId: state.destinationId,
      });

      // 2) load the hotel header exactly as before
      try {
        const resp = await getHotelDetailsAPI(hotelDetails.keyDetails.id);
        setHotel(resp || null);
      } catch (err) {
        console.error("Error loading hotel:", err);
        setHotel(null);
      }
    }

    if (hotelDetails != null) {
      getHotelDetails();
    }
  }, [hotelDetails]);

  useEffect(() => {
    if (hotel != null && rooms.length > 0) {
      setLoading(false);
    }
  }, [hotel, rooms]);

  const handleBookRoom = (room) => {
    var numOfDays = calculateDaysBetweenDates(
      payload.checkIn,
      payload.checkOut
    );

    navigate("/checkout", {
      state: {
        roomName:
          room.keyRoomDetails.name || room.keyRoomDetails.roomDescription,
        roomPrice: room.priceDetails.price,
        roomImages: [room.keyRoomDetails.roomImages[0].url],
        bookingDetails: {
          roomDesc: room.keyRoomDetails.roomDescription,
          bookingDateFrom: payload.checkIn,
          bookingDateTo: payload.checkOut,
          guestNum: payload.guests,
          numOfDays: numOfDays,
        },
      },
    });
  };

  function calculateDaysBetweenDates(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const startMillis = startDate.getTime();
    const endMillis = endDate.getTime();

    const millisDifference = endMillis - startMillis;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const daysDifference = millisDifference / millisecondsPerDay;

    return Math.round(daysDifference);
  }

  return (
    <div
      className="hotel-detail-page"
      // To Be Done - image background
      // style={{
      //   backgroundImage: `url(${!loading && hotel && hotel.data.imgix_url})`
      // }}
    >
      <Header />

      {/* your filter bar stays exactly the same */}
      {/* <FilterBar
        search={search}
        fetchData={() => {}}
        isSearchPage={true}
        className="hotel-filter"
      /> */}

      {/* —————————————————————————————— */}
      {/* HOTEL HEADER (unchanged) */}
      {!loading && hotel && (
        <div className="detail-header">
          <h1>{hotel.data.name}</h1>
          <div className="address">{hotel.data.address}</div>
          <div className="stars">{"★".repeat(hotel.data.rating)}</div>
          <div
            className="desription"
            dangerouslySetInnerHTML={{ __html: hotel.data.description }}
          />
        </div>
      )}

      {/* —————————————————————————————— */}
      {/* NOW: ALWAYS SHOW MOCK ROOMS BELOW */}
      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <div>
          <div className="room-list">
            {rooms.map((room) => {
              const roomKeyDetails = room.keyRoomDetails;
              const roomPriceDetails = room.priceDetails;

              return (
                <div key={roomKeyDetails.keyId} className="room-card">
                  <img
                    src={roomKeyDetails.roomImages[0].url || ""}
                    alt={roomKeyDetails.name}
                  />
                  <h3>{roomKeyDetails.name}</h3>
                  <p>{roomKeyDetails.roomDescription}</p>
                  <div className="room-price">SGD {roomPriceDetails.price}</div>
                  <button
                    className="btn book-room"
                    onClick={() => handleBookRoom(room)}
                  >
                    Book
                  </button>
                </div>
              );
            })}
          </div>
          {/* —————————————————————————————— */}
          {/* GOOGLE MAP VIEW */}
          <APIProvider apiKey={MAP_API_KEY}>
            <Map
              mapId={"8f7e87511ff4f8d15dce6f63"}
              style={{ width: "50vw", height: "50vh" }}
              defaultCenter={{
                lat: hotel.data.latitude,
                lng: hotel.data.longitude,
              }}
              defaultZoom={18}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            >
              <AdvancedMarker
                position={{
                  lat: hotel.data.latitude,
                  lng: hotel.data.longitude,
                }}
              />
              <MapControl position={ControlPosition.BOTTOM_LEFT} />
            </Map>
          </APIProvider>
        </div>
      )}
    </div>
  );
}
