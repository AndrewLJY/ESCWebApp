import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Accordion, Badge, Carousel } from "react-bootstrap";

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
  const [carIndex, setCarIndex] = useState(0);
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
        roomImages: room.keyRoomDetails.roomImages,
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
                        <Badge pill bg="primary" className="me-2">
                          {" "}
                          {amenity}{" "}
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
            <p>Rooms Available: </p>
            <div className="room-list">
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
                      />
                    ) : (
                      <p></p>
                    )}
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
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
