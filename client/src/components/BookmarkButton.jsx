// src/components/BookmarkButton.jsx

import React, { useState } from "react";
import { addBookmark } from "../middleware/bookmarkApi";
import { useLocation } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import "../styles/BookmarkButton.css";

export default function BookmarkButton({ hotel }) {
  const { search, state } = useLocation();
  const destinationId = state?.destinationId;
   const [showToast, setShowToast] = useState(false);

  const handleClick = async () => {
    console.log("Trying to bookmark:", hotel);

    // Merge in the search string and destinationId
    const toSave = {
      ...hotel,
      search_string: search,
      destination_id: destinationId,
    };

    await addBookmark(toSave);
    // alert("Hotel bookmarked!");
    setShowToast(true);
    console.log("✅ Hotel bookmarked:", toSave);
  };

  return (
    <>
      <button className="btn bookmark" onClick={handleClick}>
        📌 Bookmark
      </button>
      <ToastContainer className="m-4 position-fixed bottom-0 end-0">
        <Toast
          bg={"success"}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={1000}
          autohide
        >
          <Toast.Body className="text-light">Hotel Bookmarked!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
