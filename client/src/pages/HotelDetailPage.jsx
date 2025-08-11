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
  Accordion,
  Badge,
  Carousel,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

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
  const [carIndex, setCarIndex] = useState(0);
  const [modifyParams, setModifyParams] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "/images/default-bg.jpg"
  );

  library.add(fas, far, fab);

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
          <div className="w-100 m-0">
   
            <div className="carousel-div d-flex flex-row">
              <Carousel
                indicators={false}
                className="w-100"
                interval={2000}
                activeIndex={carIndex}
                onSelect={(ind, e) => setCarIndex(ind)}
                id="hotel_carousel"
              >
                {Array.from({ length: hotel.image_details.count }, (_, i) => i)
                  .filter((j) => j % 2 == 0)
                  .map((num) => {
                    return (
                      <Carousel.Item key={num} id={"caritem-" + num}>
                        <img
                          id="hotel_image"
                          src={
                            hotel.image_details.prefix +
                            num +
                            hotel.image_details.suffix
                          }
                        />

                        {num + 1 < hotel.image_details.count ? (
                          <img
                            id="hotel_image"
                            src={
                              hotel.image_details.prefix +
                              (num + 1) +
                              hotel.image_details.suffix
                            }
                          />
                        ) : (
                          <img
                            id="hotel_image"
                            src={
                              hotel.image_details.prefix +
                              "0" +
                              hotel.image_details.suffix
                            }
                          />
                        )}
                      </Carousel.Item>
                    );
                  })}
              </Carousel>
            </div>
            <div className="detail-header w-100 ps-5 pe-5 d-flex flex-row">
              <div className="col me-3">
                <div className="d-flex flex-row">
                  <h1 className="pt-2">
                    {hotel.keyDetails?.name || hotel.name}
                  </h1>

                  {isAuthenticated() && (
                    <BookmarkButton
                      hotel={{
                        hotel_id: hotelDetails.keyDetails.id,
                        hotel_name: hotelDetails.keyDetails.name,
                        hotel_address: hotelDetails.keyDetails.address,
                        hotel_ratings: hotelDetails.keyDetails.rating,
                        price: hotelDetails.keyDetails.hotel_price,
                        image_url:
                          hotelDetails.imageDetails?.stitchedImageUrls?.[0] ||
                          "https://via.placeholder.com/300x200?text=No+Image",
                        user_email: JSON.parse(localStorage.getItem("user"))
                          .email,
                      }}
                    />
                  )}
                </div>
                <div className="d-flex flex-row">
                  <div className="stars me-2">
                    {"★".repeat(hotel.keyDetails?.rating || hotel.rating || 0)}
                  </div>
                  <div className="address">
                    {hotel.keyDetails?.address || hotel.address}
                  </div>
                </div>

                {hotel.description && (
                  <Accordion flush className="accordion mt-2">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header className="border-bottom p-0">
                        <div
                          className="description"
                          dangerouslySetInnerHTML={{
                            __html:
                              hotel.description.slice(
                                0,
                                hotel.description.length / 5
                              ) + "...",
                          }}
                        />
                      </Accordion.Header>
                      <Accordion.Body>
                        <div
                          className="description"
                          dangerouslySetInnerHTML={{
                            __html: hotel.description.slice(
                              hotel.description.length / 5
                            ),
                          }}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}
              </div>
              <div className="col-5">
                <p className="mb-1">Amenities Available: </p>
                {Object.keys(hotel.amenities).map((amenity) => {
                  return (
                    <>
                      {hotel.amenities[amenity] ? (
                        <Badge
                          pill
                          bg="success"
                          className="fw-medium fs-6 mb-1 me-1  text-capitalize"
                        >
                          {amenity.replace(/([A-Z])/g, " $1")}
                          <FontAwesomeIcon icon="fa-solid fa-check" />
                        </Badge>
                      ) : (
                        <> </>
                      )}
                    </>
                  );
                })}

                {/* —————————————————————————————— */}
                {/* GOOGLE MAP VIEW */}
                <APIProvider apiKey={MAP_API_KEY}>
                  <Map
                    mapId={"8f7e87511ff4f8d15dce6f63"}
                    style={{ marginTop: "10px", width: "35vw", height: "30vh" }}
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
            </div>
                     <div className={`search-bar-wrapper`}>
              <div className="sp-filter-bar my-3 p-3">
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
            <h2 className="mb-3">Rooms Available: </h2>
            {roomsLoading ? (
              <div>Loading Rooms ...</div>
            ) : rooms.length > 0 ? (
              <div className="room-list mb-5">
                {rooms.map((room) => {
                  const roomKeyDetails = room.keyRoomDetails;
                  const roomPriceDetails = room.priceDetails;

                  return (
                    <div key={roomKeyDetails.keyId} className="room-card">
                      {roomKeyDetails.roomImages.length > 0 ? (
                        <img
                          src={
                            roomKeyDetails.roomImages.length > 0
                              ? roomKeyDetails.roomImages[0].url
                              : ""
                          }
                          alt={roomKeyDetails.name}
                          height={"40%"}
                          id="room_img"
                        />
                      ) : (
                        <div
                          className="w-100 p-5 text-center align-middle"
                          style={{ minHeight: "40%" }}
                        >
                          <p>No Image Available</p>
                        </div>
                      )}

                      <div className="p-3 h-100 d-flex flex-column justify-content-between text-start">
                        <div className="room-detail-box d-flex flex-column justify-content-between">
                          <div className="overflow-hidden mw-100">
                            <p className="fs-5 m-0 text-truncate text-wrap text-break">
                              {roomKeyDetails.roomDescription}
                            </p>
                          </div>

                          {roomKeyDetails.freeCancellation && (
                            <p className="fs-7 m-0 text-success-emphasis">
                              Free Cancellation{" "}
                              <FontAwesomeIcon icon="fa-solid fa-check" />{" "}
                            </p>
                          )}
                        </div>

                        <div>
                          <div className="room-price fw-bold fs-4">
                            SGD {roomPriceDetails.price}
                          </div>
                          <button
                            className="btn book-room w-100"
                            onClick={() => handleBookRoom(room)}
                          >
                            <p className="m-0 fw-bold text-light ms-2 me-2">
                              {" "}
                              Book{" "}
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
        )}
      </div>
    </>
  );
}
