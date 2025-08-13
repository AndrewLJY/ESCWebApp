import axios from "axios";

const BACKEND_URL = process.env.VITE_API_URL;

axios.defaults.headers.post["Content-Type"] = "application/json";

// Dummy search API that simulates backend response
const searchHotels = async (searchParams) => {
  // Simulate Delay just in case?
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock hotel data based on search parameters
  const mockHotels = [
    {
      id: 1,
      name: `Luxury Hotel ${searchParams.location}`,
      image: "/images/hotel1.jpg",
      stars: 5,
      address: `123 Main Street, ${searchParams.location}`,
      distance: "0.5 km from city centre",
      price: `SGD ${200 + Math.floor(Math.random() * 100)}`,
      amenities: ["WiFi", "Pool", "Gym"],
      rating: 4.8,
    },
    {
      id: 2,
      name: `Business Hotel ${searchParams.location}`,
      image: "/images/hotel2.jpg",
      stars: 4,
      address: `456 Business Ave, ${searchParams.location}`,
      distance: "1.2 km from city centre",
      price: `SGD ${150 + Math.floor(Math.random() * 80)}`,
      amenities: ["WiFi", "Business Center"],
      rating: 4.5,
    },
    {
      id: 3,
      name: `Budget Inn ${searchParams.location}`,
      image: "/images/hotel3.jpg",
      stars: 3,
      address: `789 Budget St, ${searchParams.location}`,
      distance: "2.1 km from city centre",
      price: `SGD ${80 + Math.floor(Math.random() * 50)}`,
      amenities: ["WiFi"],
      rating: 4.2,
    },
  ];

  // Sample logic, filter by guest count
  // todo: change this in the jsx as well
  const filteredHotels = mockHotels.filter(
    (hotel) => searchParams.guests <= 4 || hotel.stars >= 4
  );

  return {
    data: {
      hotels: filteredHotels,
      totalResults: filteredHotels.length,
      searchParams: searchParams,
    },
  };
};

// Possible real API call example
const searchHotelsAPI = async (searchParams) => {
  try {
    // let destination = searchParams.location.replace("_", " ");

    const response = await axios
      .get(
        `${BACKEND_URL}/search/${searchParams.location}/${searchParams.checkIn}/${searchParams.checkOut}/${searchParams.guests}/${searchParams.roomNum}`
      )
      .catch((error) => {
        console.log(error.toJSON());
      });

    return {
      data: {
        hotels: response.data.hotelList != null ? response.data.hotelList : [],
        totalResults: response != null ? response.data.hotelList.length : 0,
        searchParams: searchParams,
        destination_id: response.data.destination_id,
      },
    };
  } catch (error) {
    console.error("Search API error:", error);
    // Fallback to dummy data
    return await searchHotels(searchParams);
  }
};

export { searchHotels, searchHotelsAPI };
