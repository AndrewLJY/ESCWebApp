import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";

// const stripePromise = loadStripe("INSERT PK HERE");
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutForm() {
  const location = useLocation();

  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    try {
      return await axios
        .post("http://localhost:8080/stripe/create-checkout-session", {
          roomName: location.state.roomName,
          roomPrice: location.state.roomPrice,
          roomDesc: location.state.roomDesc,
          roomImages: location.state.roomImages,
          bookingDetails: location.state.bookingDetails,
        })
        .then((response) => response.data.clientSecret);
    } catch (error) {
      console.error("Checkout API error:", error);
    }
  }, []);

  const options = { fetchClientSecret };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
