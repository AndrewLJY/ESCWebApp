
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import {
  getHotelDetailsAPI,
  getRoomPricingAPI,
} from "../middleware/hotelDetailsApi";
import Header from "../components/header";
import FilterBar from "../components/FilterBar";
import "../styles/HotelDetailPage.css";

export default function HotelDetailPage() {
  const { id } = useParams();
  const { search, state } = useLocation();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "/images/default-bg.jpg"
  );

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);

      const hotelDetails = state.hotelDetails;

      // 1) grab your URL params
      const params = new URLSearchParams(search);
      const payload = {
        location: params.get("location") || "",
        hotel: hotelDetails.keyDetails.name || "",
        checkIn: params.get("checkin") || "",
        checkOut: params.get("checkout") || "",
        guests: Number(params.get("guests") || 1),
        destinationId: state.destinationId,
      };

      // 2) load the hotel header exactly as before
      try {
        const resp = await getHotelDetailsAPI(hotelDetails.keyDetails.id);
        // const found = resp.data.hotels.find(
        //   (h) => String(h.keyDetails.id) === id
        // );
        setHotel(resp || null);
      } catch (err) {
        console.error("Error loading hotel:", err);
        setHotel(null);
      }

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

      setLoading(false);
    }

    fetchDetail();
  }, [id, search]);

  const handleBookRoom = (room) => {
    navigate("/checkout", {
      state: {
        roomName: room.keyRoomDetails.name || room.keyRoomDetails.roomDescription,
        roomPrice: room.priceDetails.price,
      },
    });
  };

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
        <div className="room-list">
          {rooms.map((room) => {

            const roomKeyDetails = room.keyRoomDetails;
            const roomPriceDetails = room.priceDetails;
            
            return (
            <div key={roomKeyDetails.keyId} className="room-card">
              <img src={roomKeyDetails.roomImages[0].url || ""} alt={roomKeyDetails.name} />
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
          )})}
        </div>
      )}
    </div>
  );
}
