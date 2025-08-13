import axios from "axios";
import { createElement } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Dummy login API
const loginUser = async (credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock validation
  if (
    credentials.email === "test@example.com" &&
    credentials.password === "password123"
  ) {
    return {
      success: true,
      data: {
        user: {
          id: 1,
          email: credentials.email,
          name: "Test User",
          token: "mock-jwt-token-123",
        },
      },
    };
  }

  throw new Error("Invalid credentials");
};

// Dummy signup API
const signupUser = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (userData.password !== userData.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  return {
    success: true,
    data: {
      user: {
        id: 2,
        email: userData.email,
        name: "New User",
        token: "mock-jwt-token-456",
      },
    },
  };
};

// Real API calls (commented out)
const loginUserAPI = async (credentials) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, credentials);

    // 2. Store the JWT token
    const token = response.data.token; // Axios response data contains the token
    localStorage.setItem("authToken", token); // Consistent naming
    console.log("Login successful! Token:", token);

    // 3. Return data for the calling component to handle
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    return await loginUser(credentials);
  }
};

const fetchBookmarks = async () => {
  const token = localStorage.getItem("authToken"); // Match the storage key
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.get("/auth/bookmarks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    throw error;
  }
};

const signupUserAPI = async (userData) => {
  try {
    console.log(`${BACKEND_URL}/auth/register`)
    const response = await axios.post(`${BACKEND_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.log("Signup API error:", error);
    return await signupUser(userData);
  }
};

export { loginUser, signupUser, loginUserAPI, signupUserAPI, fetchBookmarks };
