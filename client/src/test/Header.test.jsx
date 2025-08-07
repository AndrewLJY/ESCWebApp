// src/test/Header.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../components/header";
import { loginUserAPI, signupUserAPI } from "../middleware/authApi";

// ─── Silence window.alert so it doesn’t actually pop up ─────────────────────
beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

// ─── Mock your auth API so no real network calls can happen ─────────────────
jest.mock("../middleware/authApi", () => ({
  loginUserAPI: jest.fn(),
  signupUserAPI: jest.fn(),
}));

// ─── Mock react-router’s useNavigate ────────────────────────────────────────
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Header Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("Shows 'Login' when not authenticated", () => {
    render(<Header />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Your Bookmarks")).toBeNull();
  });

  test("Login dropdown opens on button click", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Sign In Now")).toBeInTheDocument();
  });

  test("Signup dropdown appears when clicking 'Create one'", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText(/Create one/i));
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  test("Shows 'Your Bookmarks' when authenticated", () => {
    // Simulate already-logged-in
    localStorage.setItem("token", "tok123");
    localStorage.setItem("user", JSON.stringify({ username: "joe" }));

    render(<Header />);
    expect(screen.getByText("Your Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).toBeNull();
  });

  test("Shows alert when passwords do not match during signup", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText(/Create one/i));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "xyz" },
    });

    fireEvent.click(screen.getByText(/Sign Up Now/i));
    expect(window.alert).toHaveBeenCalledWith("Passwords do not match!");
  });

  test("Alerts if login submitted with empty fields", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));
    // both fields blank
    fireEvent.click(screen.getByText("Sign In Now"));
    expect(window.alert).toHaveBeenCalledWith(
      "Please enter email and password."
    );
  });

  test("Invalid email format blocks login and does not call API", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "jo" }, // missing '@'
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "somepass" },
    });

    fireEvent.click(screen.getByText("Sign In Now"));
    expect(loginUserAPI).not.toHaveBeenCalled();
  });

  test("Invalid credentials shows alert when login fails", async () => {
    loginUserAPI.mockRejectedValue(new Error("Invalid credentials"));

    render(<Header />);
    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "badpass" },
    });
    fireEvent.click(screen.getByText("Sign In Now"));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials")
    );
  });
});
