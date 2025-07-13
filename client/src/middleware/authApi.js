import axios from "axios";
import { createElement } from "react";

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
    const response = await axios.post("http://localhost:8080/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    return await loginUser(credentials);
  }
};

const signupUserAPI = async (userData) => {
  try {
    const response = await axios.post("http://localhost:8080/auth/register", userData);
    return response.data;
  } catch (error) {
    console.log("Signup API error:", error);
    return await signupUser(userData);
  }
};

export { loginUser, signupUser, loginUserAPI, signupUserAPI };
