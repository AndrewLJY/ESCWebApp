import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import Header from "../components/header";
import "../styles/HotelDetailPage.css";

export default function HotelDetailPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // fetch a batch of hotels…
        const resp = await searchHotelsAPI({
          hotelType: "Hotel",
          location: "",
          hotel: "",
          checkIn: "",
          checkOut: "",
          guests: 1,
        });
        // pick the one with matching id
        const found = resp.data.hotels.find(
          (h) => String(h.keyDetails.id) === id
        );
        setHotel(found || null);
      } catch (e) {
        console.error("Detail load error:", e);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="hotel-detail-page">
      <Header />

      {loading ? (
        <div className="loading">Loading…</div>
      ) : !hotel ? (
        <div className="loading">Hotel not found</div>
      ) : (
        <>
          <div className="detail-header">
            <h1>{hotel.keyDetails.name}</h1>
            <div className="address">{hotel.keyDetails.address}</div>
            <div className="stars">{"★".repeat(hotel.keyDetails.rating)}</div>
          </div>

          <div className="room-list">
            {hotel.rooms?.map((room) => (
              <div key={room.id} className="room-card">
                <img src={room.imageUrl} alt={room.name} />
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <div className="room-price">SGD {room.price}</div>
                <button className="btn book-room">Book this room</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
