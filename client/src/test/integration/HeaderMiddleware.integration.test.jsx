// src/test/integration/Header.integration.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../components/header";

// Mock the logo
jest.mock("../../assets/ascenda_logo.png", () => "mock-logo.png");

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock axios for backend API calls
jest.mock("axios", () => ({
  post: jest.fn(),
  get: jest.fn(),
  defaults: {
    headers: {
      post: {}
    }
  }
}));

const axios = require("axios");

// Silence window.alert
beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

describe("Header Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    axios.post.mockClear();
    axios.get.mockClear();
  });

  

  describe("Login Integration", () => {
    it("makes API call to backend login endpoint with correct credentials", async () => {
      const mockResponse = {
        data: {
          token: "jwt-token-123",
          username: "testuser"
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "test@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" }
      });
      
      fireEvent.click(screen.getByText("Sign In Now"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/auth/login",
          {
            email: "test@example.com",
            password: "password123"
          }
        );
      });

      // Should store token in localStorage
      expect(localStorage.getItem("authToken")).toBe("jwt-token-123");
    });

    it("handles backend login failure with network error", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "test@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "wrongpassword" }
      });
      
      fireEvent.click(screen.getByText("Sign In Now"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/auth/login",
          {
            email: "test@example.com",
            password: "wrongpassword"
          }
        );
      });

      // Should not store token on failure
      expect(localStorage.getItem("authToken")).toBeNull();
    });

    it("handles backend login failure with 401 unauthorized", async () => {
      const error = new Error("Request failed with status code 401");
      error.response = {
        status: 401,
        data: { message: "Invalid credentials" }
      };
      axios.post.mockRejectedValueOnce(error);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "invalid@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "wrongpassword" }
      });
      
      fireEvent.click(screen.getByText("Sign In Now"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      expect(localStorage.getItem("authToken")).toBeNull();
    });

    it("shows success toast on successful login", async () => {
      const mockResponse = {
        data: {
          token: "jwt-token-456",
          username: "newuser"
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "newuser@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "validpassword" }
      });
      
      fireEvent.click(screen.getByText("Sign In Now"));

      await waitFor(() => {
        expect(screen.getByText("Login Successful!")).toBeInTheDocument();
      });

      expect(localStorage.getItem("authToken")).toBe("jwt-token-456");
    });


  });

  describe("Signup Integration", () => {
    it("makes API call to backend register endpoint with correct data", async () => {
      const mockResponse = {
        data: {
          user: { username: "newuser" },
          token: "jwt-token-789"
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      fireEvent.click(screen.getByText(/Create one/i));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "newuser@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "newpassword123" }
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "newpassword123" }
      });
      
      fireEvent.click(screen.getByText("Sign Up Now"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/auth/register",
          {
            email: "newuser@example.com",
            password: "newpassword123",
            confirmPassword: "newpassword123"
          }
        );
      });
    });

    it("handles backend signup failure", async () => {
      const error = new Error("Email already exists");
      error.response = {
        status: 400,
        data: { message: "Email already exists" }
      };
      axios.post.mockRejectedValueOnce(error);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      fireEvent.click(screen.getByText(/Create one/i));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "existing@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" }
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "password123" }
      });
      
      fireEvent.click(screen.getByText("Sign Up Now"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      // Should not store token on failure
      expect(localStorage.getItem("authToken")).toBeNull();
    });


    it("shows success toast on successful signup", async () => {
      const mockResponse = {
        data: {
          user: { username: "successuser" },
          token: "jwt-token-success"
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      fireEvent.click(screen.getByText(/Create one/i));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "success@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "validpassword" }
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "validpassword" }
      });
      
      fireEvent.click(screen.getByText("Sign Up Now"));

      await waitFor(() => {
        expect(screen.getByText("Sign Up Successful!")).toBeInTheDocument();
      });
    });
  });

  

  describe("UI State Management Integration", () => {


    it("closes dropdown after successful login", async () => {
      const mockResponse = {
        data: {
          token: "jwt-token-123",
          username: "testuser"
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "test@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" }
      });
      
      fireEvent.click(screen.getByText("Sign In Now"));

      await waitFor(() => {
        expect(screen.getByText("Login Successful!")).toBeInTheDocument();
      });

      // Dropdown should close after successful login
      await waitFor(() => {
        expect(screen.queryByLabelText("Email Address")).not.toBeInTheDocument();
      });
    });

    it("closes dropdown after successful signup", async () => {
      const mockResponse = {
        data: {
          user: { username: "newuser" },
          token: "jwt-token-456"
        }
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      fireEvent.click(screen.getByText(/Create one/i));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "new@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" }
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "password123" }
      });
      
      fireEvent.click(screen.getByText("Sign Up Now"));

      await waitFor(() => {
        expect(screen.getByText("Sign Up Successful!")).toBeInTheDocument();
      });

      // Dropdown should close after successful signup
      await waitFor(() => {
        expect(screen.queryByLabelText("Email Address")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling Integration", () => {
    it("handles network timeout errors", async () => {
      const timeoutError = new Error("timeout of 5000ms exceeded");
      timeoutError.code = "ECONNABORTED";
      axios.post.mockRejectedValueOnce(timeoutError);

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "test@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" }
      });
      
      fireEvent.click(screen.getByText("Sign In Now"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      // Should not store token on timeout
      expect(localStorage.getItem("authToken")).toBeNull();
    });

    it("handles malformed backend responses", async () => {
      axios.post.mockResolvedValueOnce({
        data: null // Malformed response
      });

      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText("Login"));
      
      fireEvent.change(screen.getByLabelText("Email Address"), {
        target: { value: "test@example.com" }
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "password123" }
      });
      
      fireEvent.click(screen.getByText("Sign In Now"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      // Should handle gracefully
      expect(localStorage.getItem("authToken")).toBeNull();
    });
  });
});