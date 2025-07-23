import React, { useCallback, useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import axios from "axios";

const stripePromise = loadStripe("pk_test_51Ro2oWGfz5d03nx5xffORatorHe9Alo7pBN5aQt03D1a7iUJ8Vbz8YuAssfVNalGjYRUmKLYAKOJfwJ4dg5BiosF00r2FAj6JT");

export default function CheckoutForm() {
  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    try {
      return await axios.post("http://localhost:8080/stripe/create-checkout-session")
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