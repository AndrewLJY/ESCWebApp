import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import axios from "axios";

// const stripePromise = loadStripe("INSERT PK HERE");
const env = await import.meta.env
const stripePromise = loadStripe(`${env.VITE_STRIPE_PK}`);

export default function CheckoutForm() {
  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    try {
      return await axios.post("http://localhost:8080/stripe/create-checkout-session",{
        roomName: "room",
        roomPrice: 3000
      })
      .then((response) => response.data.clientSecret);
    }
    catch (error) {
      console.error('Checkout API error:', error);
    }      
  }, []);

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
  
}