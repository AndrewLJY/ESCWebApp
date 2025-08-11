import React, { useCallback, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";

export default function Return() {
  const [status, setStatus] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  // function saveBookingDetails() {
  //   const bookingDetails = {
  //     id: metaData.bookingId,
  //     hotel_id: metaData.hotelId,
  //     destination_id: metaData.destinationId,
  //     no_of_nights: metaData.noOfNights,
  //     start_date: metaData.checkIn,
  //     end_date: metaData.checkOut,
  //     guest_count: metaData.guestNum,
  //     message_to_hotel: metaData.specialReq,
  //     room_type: metaData.roomDesc,
  //     total_price: metaData.totalPrice,
  //     user_id: metaData.userId,
  //     full_name: metaData.fullName,
  //     payment_id: metaData.paymentId,
  //   };

  //   axios
  //     .post("http://localhost:8080/booking", bookingDetails)
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error saving booking details:", error);
  //     });
  // }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    axios
      .get(
        `http://localhost:8080/stripe/session-status?session_id=${sessionId}`
      )
      .then((response) => {
        console.log(response);
        setStatus(response.data.status);
        setCustomerEmail(response.data.customer_email);
        setMetaData(response.data.metadata);
      });
  }, []);

  useEffect(() => {
    if (status == "complete" && customerEmail != null && metaData != null) {
      var templateParams = {
        email: customerEmail,
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
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
    }
  }, [customerEmail, metaData]);

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
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}.
        </p>
        <button onClick={routeChange}>Back to Home Page</button>
      </section>
    );
  }

  return null;
}
