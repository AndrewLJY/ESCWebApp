// src/test/BookmarkButton.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// 1) Mock the addBookmark API
const mockAddBookmark = jest.fn();
jest.mock("../middleware/bookmarkApi", () => ({
  addBookmark: (...args) => mockAddBookmark(...args),
}));

// 2) Mock react-router-dom's useLocation
const fakeLocation = {
  search: "?checkin=2025-08-01&checkout=2025-08-05",
  state: { destinationId: 123 },
};
jest.mock("react-router-dom", () => ({
  useLocation: () => fakeLocation,
}));

import BookmarkButton from "../components/BookmarkButton";

describe("BookmarkButton", () => {
  const hotel = { id: "h1", name: "The Test Hotel", rating: 4.5 };

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  it("renders a bookmark button", () => {
    render(<BookmarkButton hotel={hotel} />);
    const btn = screen.getByRole("button", { name: /bookmark/i });
    expect(btn).toBeInTheDocument();
  });

  it("calls addBookmark with hotel + search + destinationId, then alerts", async () => {
    render(<BookmarkButton hotel={hotel} />);
    const btn = screen.getByRole("button", { name: /bookmark/i });

    // Click the button
    fireEvent.click(btn);

    // Wait for the async handler to finish
    await waitFor(() => {
      // Expect addBookmark called exactly once
      expect(mockAddBookmark).toHaveBeenCalledTimes(1);

      // The argument should merge hotel plus search and destination_id
      expect(mockAddBookmark).toHaveBeenCalledWith({
        id: "h1",
        name: "The Test Hotel",
        rating: 4.5,
        search_string: fakeLocation.search,
        destination_id: fakeLocation.state.destinationId,
      });

      // Expect alert
      expect(global.alert).toHaveBeenCalledWith("Hotel bookmarked!");
    });
  });
});
