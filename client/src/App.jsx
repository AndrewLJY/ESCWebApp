// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import CheckoutForm from "./pages/stripe/CheckoutForm.jsx";
import Return from "./pages/stripe/Return.jsx";
import RoomDetailPage from "./pages/HotelDetailPage.jsx";
import Bookmark from "./pages/Bookmark";

import "./App.css"; // keep this if you have shared/global styles

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/return" element={<Return />} />
        <Route path="/hotel/:id" element={<RoomDetailPage />} />
        <Route path="/bookmark" element={<Bookmark />} />
      </Routes>
    </BrowserRouter>
  );
}

// src/App.jsx
// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage.jsx";
// import SearchPage from "./pages/SearchPage.jsx";
// import RoomDetailPage from "./pages/HotelDetailPage.jsx";

// import "./App.css"; // keep this if you have shared/global styles

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/search" element={<SearchPage />} />
//         <Route path="/hotel/:id" element={<RoomDetailPage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
