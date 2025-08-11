import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Form, Row, Col, Button } from "react-bootstrap";

import {
  getHotelDetailsAPI,
  getRoomPricingAPI,
} from "../middleware/hotelDetailsApi";

import Header from "../components/header.jsx";
import BookmarkButton from "../components/BookmarkButton";

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
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [modifyParams, setModifyParams] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "/images/default-bg.jpg"
  );

  const isAuthenticated = () =>
    Boolean(localStorage.getItem("token") && localStorage.getItem("user"));

  // Set Hotel Details
  useEffect(() => {
    setHotelDetails(state?.hotelDetails);
  }, [id, search]);

  // Get Rooms
  useEffect(() => {
    if (payload != null && hotelDetails != null && !modifyParams) {
      getRooms();
    }
  }, [payload, hotelDetails]);

  // Get Hotel Details
  useEffect(() => {
    async function getHotelDetails() {
      initPage();

      // 2) load the hotel header exactly as before
      try {
        const resp = await getHotelDetailsAPI(hotelDetails?.keyDetails.id);

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

  // Set Loading to false
  useEffect(() => {
    if (hotel != null) {
      setLoading(false);
    }
  }, [hotel, rooms]);

  async function getRooms() {
    // 3) *always* load mock rooms (never show empty)
    try {
      setRoomsLoading(true);
      const roomResp = await getRoomPricingAPI(
        hotelDetails?.keyDetails.id,
        payload
      );
      if (roomResp === "No Room Available") {
        setRooms([]);
      } else {
        setRooms(roomResp.data);
      }
    } catch (err) {
      console.error("Error loading rooms:", err);
      setRooms([]);
    }
    setRoomsLoading(false);
  }

  function handleBookRoom(room) {
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
          userId: JSON.parse(localStorage.getItem("user")).id,
          fullName: JSON.parse(localStorage.getItem("user")).full_name,
          destinationId: payload.destinationId,
          hotelId: hotelDetails?.keyDetails.id,
          hotelName: hotelDetails?.keyDetails.name,
          roomDesc: room.keyRoomDetails.roomDescription,
          checkIn: payload.checkIn,
          checkOut: payload.checkOut,
          guestNum: payload.guests,
          roomNum: payload.roomNum,
          numOfDays: numOfDays,
        },
      },
    });
  }

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

  function initPage() {
    const params = new URLSearchParams(search);

    const defCheckIn = new Date();
    const defCheckOut = new Date();

    defCheckIn.setDate(defCheckIn.getDate() + 3);
    defCheckOut.setDate(defCheckOut.getDate() + 4);

    setPayload({
      location: params.get("location") || "",
      hotel: hotelDetails?.keyDetails.name || "",
      checkIn: params.get("checkin") || defCheckIn.toISOString().split("T")[0],
      checkOut:
        params.get("checkout") || defCheckOut.toISOString().split("T")[0],
      guests: Number(params.get("guests") || 1),
      roomNum: Number(params.get("roomNum") || 1),
      destinationId: state.destinationId,
    });
  }

  function modifyParam() {
    if (payload != null && hotelDetails != null && modifyParams) {
      console.log("fowesfhiuwhfiuwh");
      getRooms();

      const params = new URLSearchParams(search);

      params.set("checkin", payload.checkIn);
      params.set("checkout", payload.checkOut);
      params.set("guests", payload.guests);
      params.set("roomNum", payload.roomNum);

      navigate("?" + params.toString(), {
        replace: true,
        state: {
          hotelDetails: hotelDetails,
          destinationId: payload.destinationId,
          shallow: true,
        },
      });
    }
    setModifyParams(false);
  }

  return (
    <>
      <Header />
      <div className="hotel-detail-page">
        {/* —————————————————————————————— */}
        {/* NOW: ALWAYS SHOW MOCK ROOMS BELOW */}
        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <div>
            <div className={`search-bar-wrapper`}>
              <div className="sp-filter-bar">
                <Row className="align-items-center g-3">
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold filter-label">
                        Check In:
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className="filter-input"
                        id="filter-checkin"
                        value={payload.checkIn}
                        disabled={roomsLoading}
                        onChange={(e) => {
                          setModifyParams(true);
                          setPayload((prevState) => ({
                            ...prevState,
                            checkIn: e.target.value,
                          }));
                          if (
                            !payload.checkOut ||
                            new Date(e.target.value) >=
                              new Date(payload.checkOut)
                          ) {
                            const d = new Date(e.target.value);
                            d.setDate(d.getDate() + 3);
                            setPayload((prevState) => ({
                              ...prevState,
                              checkOut: d.toISOString().split("T")[0],
                            }));
                          }
                        }}
                        min={new Date().toISOString().split("T")[0]}
                      ></Form.Control>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold filter-label">
                        Check Out:
                      </Form.Label>
                      <Form.Control
                        type="date"
                        className="filter-input"
                        id="filter-checkout"
                        value={payload.checkOut}
                        disabled={roomsLoading}
                        onChange={(e) => {
                          setModifyParams(true);
                          setPayload((prevState) => ({
                            ...prevState,
                            checkOut: e.target.value,
                          }));
                        }}
                        min={
                          (
                            new Date(
                              new Date(payload.checkIn).setDate(
                                new Date(payload.checkIn).getDate() + 1
                              )
                            ) || new Date()
                          )
                            .toISOString()
                            .split("T")[0]
                        }
                      ></Form.Control>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold filter-label">
                        Guests:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="filter-input"
                        id="filter-guests"
                        min="1"
                        value={payload.guests}
                        disabled={roomsLoading}
                        onChange={(e) => {
                          setModifyParams(true);
                          setPayload((prevState) => ({
                            ...prevState,
                            guests: e.target.value,
                          }));
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold filter-label">
                        Rooms:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        className="filter-input"
                        id="filter-roomNum"
                        min="1"
                        value={payload.roomNum}
                        disabled={roomsLoading}
                        onChange={(e) => {
                          setModifyParams(true);
                          setPayload((prevState) => ({
                            ...prevState,
                            roomNum: e.target.value,
                          }));
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Button
                      variant="primary"
                      className="btn btn-sm"
                      onClick={modifyParam}
                    >
                      Modify
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
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
                    hotel_id: hotelDetails.keyDetails.id,
                    hotel_name: hotelDetails.keyDetails.name,
                    hotel_address: hotelDetails.keyDetails.address,
                    hotel_ratings: hotelDetails.keyDetails.rating,
                    hotel_price: hotelDetails.keyDetails.price,
                    image_url:
                      hotelDetails.imageDetails?.stitchedImageUrls?.[0] ||
                      "https://via.placeholder.com/300x200?text=No+Image",
                    user_email: JSON.parse(localStorage.getItem("user")).email,
                  }}
                />
              )}
            </div>
            <div className="room-list">
              {roomsLoading ? (
                <div>Loading Rooms ...</div>
              ) : rooms.length > 0 ? (
                rooms.map((room) => {
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
                      <div className="room-price">
                        SGD {roomPriceDetails.price}
                      </div>
                      <button
                        className="btn book-room"
                        onClick={() => handleBookRoom(room)}
                      >
                        Book
                      </button>
                    </div>
                  );
                })
              ) : (
                <div>
                  <p>No Rooms Available with the following criteria:</p>
                  <p>Check In Date: {payload.checkIn}</p>
                  <p>Check Out Date: {payload.checkOut}</p>
                  <p>Guests: {payload.guests}</p>
                  <p>Rooms: {payload.roomNum}</p>
                </div>
              )}
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
    </>
  );
}
