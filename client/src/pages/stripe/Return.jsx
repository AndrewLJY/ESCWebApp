import React, { useCallback, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";

export default function Return() {
  const [status, setStatus] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [customerDetails, setCustomerDetails] = useState("");

  function saveBookingDetails() {
    if (!metaData || !customerDetails) {
      return;
    }

    const bookingDetails = {
      id: metaData.id,
      hotel_id: metaData.hotelId,
      destination_id: metaData.destinationId,
      no_of_nights: metaData.numOfDays,
      start_date: metaData.checkIn,
      end_date: metaData.checkOut,
      guest_count: metaData.guestNum,
      message_to_hotel: metaData.specialReq,
      room_type: metaData.roomDesc,
      total_price: metaData.totalPrice,
      user_id: metaData.userId,
      full_name: customerDetails.name,
      payment_id: metaData.paymentId,
    };

    axios
      .post("http://localhost:8080/booking/", bookingDetails)
      .then((response) => {
        
      })
      .catch((error) => {
        console.error("Error saving booking details:", error);
      });
  }

  function sendEmail(status, customerDetails, metaData) {
    if (status == "complete" && customerDetails != null && metaData != null) {
      var templateParams = {
        email: customerDetails.email,
        hotelName: metaData.hotelName,
        roomType: metaData.roomDesc,
        checkInDate: metaData.checkIn,
        checkOutDate: metaData.checkOut,
        numOfGuests: metaData.guestNum,
        numOfRooms: metaData.roomNum,
        specialRequest: metaData.specialReq,
      };

      emailjs.send("service_1v9a236", "template_ibcni3p", templateParams).then(
        (response) => {
          
        },
        (error) => {
          
        }
      );
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    axios
      .get(
        `http://localhost:8080/stripe/session-status?session_id=${sessionId}`
      )
      .then((response) => {
        
        setStatus(response.data.status);
        setCustomerDetails(response.data.customer_details);
        setMetaData(response.data.metadata);
        sendEmail(
          response.data.status,
          response.data.customer_details,
          response.data.metadata
        );
      });
  }, []);

  useEffect(() => {
    saveBookingDetails();
  }, [metaData]);

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/`;
    navigate(path);
  };

  if (status === "complete") {
    return (
      <section id="success" className="text-center h-100 align-content-center">
        <p>We appreciate your business!</p>
        <p>A confirmation email will be sent to {customerDetails.email}.</p>
        <button onClick={routeChange}>Back to Home Page</button>
      </section>
    );
  }

  return null;
}
