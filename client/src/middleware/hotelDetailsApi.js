import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const getHotelDetailsAPI = async (hotelId) => {
  try {
    const response = await axios
      .get(`${BACKEND_URL}/search/hotel/${hotelId}`)
      .catch((error) => {
        console.log(error.toJSON());
      });

    console.log(response);
    return response;
  } catch (error) {
    console.error("Hotel Details API error:", error);
    // Fallback to dummy data
    // return await searchHotels(searchParams);
  }

  // If we have rooms for this exact hotelId, use them.
  // Otherwise return *all* rooms flattened.
  // const rooms = mockRoomData[hotelId]
  //   ? mockRoomData[hotelId]
  //   : Object.values(mockRoomData).flat();

  // return { data: { rooms } };
};

const getRoomPricingAPI = async (hotelId, payload) => {
  try {
    const response = await axios
      .get(
        `${BACKEND_URL}/search/hotel/prices/${hotelId}/${payload.destinationId}/${payload.checkIn}/${payload.checkOut}/${payload.guests}/${payload.roomNum}`
      )
      .catch((error) => {
        console.log(error.toJSON());
      });

    if (response.status == 404) {
      return "No Room Available";
    }

    return response;
  } catch (error) {
    console.error("Room Details API error:", error);
    // Fallback to dummy data
    // return await searchHotels(searchParams);
  }

  // If we have rooms for this exact hotelId, use them.
  // Otherwise return *all* rooms flattened.
  // const rooms = mockRoomData[hotelId]
  //   ? mockRoomData[hotelId]
  //   : Object.values(mockRoomData).flat();

  // return { data: { rooms } };
};

export { getHotelDetailsAPI, getRoomPricingAPI };
