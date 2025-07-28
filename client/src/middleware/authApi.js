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

// JWT token management
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Real API calls with JWT support
const loginUserAPI = async (credentials) => {
  try {
    const response = await axios.post("http://localhost:8080/auth/login", credentials);
    const { token, user } = response.data;
    setAuthToken(token);
    return { success: true, data: { user, token } };
  } catch (error) {
    console.error("Login API error:", error);
    return await loginUser(credentials);
  }
};

const signupUserAPI = async (userData) => {
  try {
    const response = await axios.post("http://localhost:8080/auth/register", userData);
    const { token, user } = response.data;
    setAuthToken(token);
    return { success: true, data: { user, token } };
  } catch (error) {
    console.log("Signup API error:", error);
    return await signupUser(userData);
  }
};

// Logout API call
const logoutUserAPI = async () => {
  try {
    await axios.post("http://localhost:8080/auth/logout");
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    setAuthToken(null);
  }
};

// Verify token validity
const verifyToken = async () => {
  try {
    const response = await axios.get("http://localhost:8080/auth/verify");
    return response.data;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};

export { loginUser, signupUser, loginUserAPI, signupUserAPI, logoutUserAPI, verifyToken, setAuthToken };
