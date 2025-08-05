import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import Header from "../components/header";
import SearchBar from "../components/SearchBar";

export default function LandingPage() {
  return (
    <>
    <Header/>
    <div className="landing d-flex justify-content-center align-items-center">
      <h1 className="landing__headline">
        Start your dream vacation with us
      </h1>
      <h2 className="landing__subheadline">
        Discover the world with Ascenda. You deserve the best.
      </h2>

      <SearchBar className="search"/>
    </div>
    </>
  );
}
