// src/components/BookmarkButton.jsx

import React from "react";
import { addBookmark } from "../middleware/bookmarkApi";
import "../styles/BookmarkButton.css";

export default function BookmarkButton({ hotel }) {
  const handleClick = async () => {
    console.log("Trying to bookmark:", hotel);
    await addBookmark(hotel);
    alert("Hotel bookmarked!");
    console.log("✅ Hotel bookmarked:", hotel); // Debug log
  };

  return (
    <button className="btn bookmark" onClick={handleClick}>
      📌 Bookmark
    </button>
  );
}
