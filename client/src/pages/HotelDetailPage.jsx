
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
