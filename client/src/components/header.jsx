import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header({ showBook = true }) {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="logo" onClick={() => navigate("/")}>
        Ascenda
      </div>
      <div className="actions">
        <button className="btn login">Login</button>
        {showBook && (
          <button className="btn book" onClick={() => navigate("/")}>
            Book Now
          </button>
        )}
      </div>
    </header>
  );
}
