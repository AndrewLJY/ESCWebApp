import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchHotelsAPI } from "../middleware/searchApi";
import Header from "../components/header";
import "../styles/HotelDetailPage.css";
import FilterBar from "../components/FilterBar.jsx"; // Import FilterBar component

// import PaymentPage from "./pages/PaymentPage"; # Payment Page to be implemented later

export default function HotelDetailPage() {
  const { id } = useParams(); // retrieve the hotel ID from the URL
  const [hotel, setHotel] = useState(null); // BOOLEAN (found, null) rerender page when setHotel is called
  const [loading, setLoading] = useState(true); // BOOLEAN (true, false) rerender page when setLoading is called

  const handleBookRoom = (room) => { // What to do when user clicks to book a room
    // Handle room booking logic here
    console.log("User clicked to book:", room);
    alert(`Booking room: ${room.name}\nPrice: SGD ${room.price}`); // to be changed with the stripe payment page later
  };

  const [filters, setFilters] = useState({
    location: { open: false, value: "" },
    checkin: { open: false, value: "" },
    checkout: { open: false, value: "" },
    guests: { open: false, value: 1 },
  });

  const toggle = (key) => { // Toggles the filter open/close state
    setFilters((prev) => ({
      ...prev,
      [key]: { ...prev[key], open: !prev[key].open },
    }));
  };

  const update = (key, value) => { // Update filter values
    setFilters((prev) => ({ 
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  useEffect(() => { // Run when page loads or id changes
    async function load() {
      setLoading(true);
      try {
        // fetch a batch of hotels…
        const resp = await searchHotelsAPI({  // Sorry! I don't know if this is the right API call, because I need room prices and details
          location: filters.location.value,
          hotel: "",
          checkIn: filters.checkin.value,
          checkOut: filters.checkout.value,
          guests: filters.guests.value,
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
  }, [id]); // code here is the reason why the page rerenders when  id changes

  return (
    <div className="hotel-detail-page">
      <Header /> {/* Render the header component */}
      
      <FilterBar
        filters={filters}
        toggle={toggle}
        update={update}
        onSearch={onSearch}
        showModify={true}
      />

      {loading ? (
        <div className="loading">Loading…</div> // Show loading... while fetching
      ) : !hotel ? (
        <div className="loading">Hotel not found</div> // Show error if hotel not found
      ) : (

        <> {/* Render hotel details */}
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
                <button 
                  className="btn book-room"
                  onClick={() => handleBookRoom(room)}
                >
                  Book this room
                </button>
              </div>
            ))}
          </div>
        </>

      )}
    </div>
  );
}
