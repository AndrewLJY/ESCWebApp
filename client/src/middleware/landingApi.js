import axios from 'axios';

const BACKEND_URL = process.env.VITE_API_URL;

// Dummy API for landing page data
const getLandingData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    data: {
      featuredDestinations: [
        { id: 1, name: 'Singapore', image: '/images/singapore.jpg', deals: 25 },
        { id: 2, name: 'Tokyo', image: '/images/tokyo.jpg', deals: 18 },
        { id: 3, name: 'Bangkok', image: '/images/bangkok.jpg', deals: 32 }
      ],
      popularHotels: [
        { id: 1, name: 'Marina Bay Sands', location: 'Singapore', price: 'SGD 350', rating: 4.8 },
        { id: 2, name: 'Ritz Carlton', location: 'Tokyo', price: 'JPY 45000', rating: 4.9 }
      ]
    }
  };
};

// Original API call (kept for backward compatibility)
const apiCall = () => {
  axios.get(BACKEND_URL).then((data) => {
    console.log(data)
  })
}

// Real API call for landing data (commented out)
const getLandingDataAPI = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/landing`);
    return response.data;
  } catch (error) {
    console.error('Landing API error:', error);
    return await getLandingData();
  }
};

export { apiCall, getLandingData, getLandingDataAPI };