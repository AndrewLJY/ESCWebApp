/**
 * Pure mock room lookup by hotel ID.
 * If the ID isn't in our map, we fall back to returning *all* rooms.
 */
export const searchRoomsAPI = async (hotelId) => {
  await new Promise((res) => setTimeout(res, 300));
  const mockRoomData = {
    1: [
      {
        id: "r1",
        name: "Deluxe Room",
        description: "Spacious room with a view.",
        price: 250,
        imageUrl: "https://mockimg.com/room1.jpg",
      },
      {
        id: "r2",
        name: "Suite",
        description: "Large suite with premium amenities.",
        price: 400,
        imageUrl: "https://mockimg.com/room2.jpg",
      },
    ],
    2: [
      {
        id: "r1",
        name: "Standard Business Room",
        description: "Comfortable and efficient.",
        price: 190,
        imageUrl: "https://mockimg.com/room3.jpg",
      },
    ],
    3: [
      {
        id: "r1",
        name: "Budget Single Room",
        description: "Basic room for solo travelers.",
        price: 110,
        imageUrl: "https://mockimg.com/room4.jpg",
      },
    ],
  };

  // If we have rooms for this exact hotelId, use them.
  // Otherwise return *all* rooms flattened.
  const rooms = mockRoomData[hotelId]
    ? mockRoomData[hotelId]
    : Object.values(mockRoomData).flat();

  return { data: { rooms } };
};
