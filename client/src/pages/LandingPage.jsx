import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import Header from "../components/header";
import FilterBar from "../components/FilterBar";

export default function LandingPage() {
  return (
    <div className="landing">
      <Header />

      <h1 className="landing__headline">
        Start your dream vacation with&nbsp;us
      </h1>
      <h2 className="landing__subheadline">
        Discover the world with Ascenda. You deserve the best.
      </h2>

      <FilterBar />
    </div>
  );
}
