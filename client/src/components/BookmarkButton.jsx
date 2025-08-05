// src/components/BookmarkButton.jsx

import React from "react";
import { addBookmark } from "../middleware/bookmarkApi";
import { useLocation } from "react-router-dom";
import "../styles/BookmarkButton.css";

export default function BookmarkButton({ hotel }) {
  const { search, state } = useLocation();
  const destinationId = state?.destinationId;

  const handleClick = async () => {
    console.log("Trying to bookmark:", hotel);

    // Merge in the search string and destinationId
    const toSave = {
      ...hotel,
      searchString: search,
      destinationId,
    };

    await addBookmark(toSave);
    alert("Hotel bookmarked!");
    console.log("✅ Hotel bookmarked:", toSave);
  };

  return (
    <button className="btn bookmark" onClick={handleClick}>
      📌 Bookmark
    </button>
  );
}
