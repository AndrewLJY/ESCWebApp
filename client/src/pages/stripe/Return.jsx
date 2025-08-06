import React, { useCallback, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";

export default function Return() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

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
      });
  }, []);

  useEffect(() => {
    if (status == "complete" && customerEmail != null) {
      var templateParams = {
        email: customerEmail,
        hotelName: "",
        roomType: "",
        checkInDate: "",
        checkOutDate: "",
        numOfGuests: "",
        specialRequest: "",
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
  }, [customerEmail]);

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
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
        <button onClick={routeChange}>Back to Home Page</button>
      </section>
    );
  }

  return null;
}
