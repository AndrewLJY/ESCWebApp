// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import emailjs from "@emailjs/browser";

import "bootstrap/dist/css/bootstrap.min.css";
import LandingPage from "./pages/LandingPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import CheckoutForm from "./pages/stripe/CheckoutForm.jsx";
import Return from "./pages/stripe/Return.jsx";
import HotelDetailPage from "./pages/HotelDetailPage.jsx";
import Bookmark from "./pages/BookmarkPage.jsx";

import "./App.css"; // keep this if you have shared/global styles

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function App() {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/return" element={<Return />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
        <Route path="/bookmark" element={<Bookmark />} />
      </Routes>
    </BrowserRouter>
  );
}
