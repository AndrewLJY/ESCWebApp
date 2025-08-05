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
import BookmarkButton from "../components/BookmarkButton";
import "../styles/HotelDetailPage.css";

const env = await import.meta.env;
const MAP_API_KEY = `${env.VITE_GOOGLE_MAPS_API_KEY}`;

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
  const [payload, setPayload] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "/images/default-bg.jpg"
  );

  const isAuthenticated = () =>
    Boolean(localStorage.getItem("token") && localStorage.getItem("user"));

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

        setHotel(detail || null);
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
    <div className="hotel-detail-page">
      <Header />

      {/* —————————————————————————————— */}
      {/* NOW: ALWAYS SHOW MOCK ROOMS BELOW */}
      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <div>
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
                lat: hotel.latitude,
                lng: hotel.longitude,
              }}
              defaultZoom={18}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            >
              <AdvancedMarker
                position={{
                  lat: hotel.latitude,
                  lng: hotel.longitude,
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
