// src/test/Header.test.jsx

jest.mock("../assets/ascenda_logo.png", () => "mock-logo.png");

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/header";
import { loginUserAPI, signupUserAPI } from "../middleware/authApi";

// ─── Silence window.alert ──────────────────────────────────────────────────────
beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

// ─── Mock your auth API ────────────────────────────────────────────────────────
jest.mock("../middleware/authApi", () => ({
  loginUserAPI: jest.fn(),
  signupUserAPI: jest.fn(),
}));

// ─── Mock react-router’s useNavigate ──────────────────────────────────────────
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
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Your Bookmarks")).toBeNull();
  });

  test("Login dropdown opens on button click", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Sign In Now")).toBeInTheDocument();
  });

  test("Shows validation error when login fields are empty", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Sign In Now"));

    expect(screen.getByLabelText("Email Address").validationMessage).not.toBe(
      ""
    );
    expect(screen.getByLabelText("Password").validationMessage).not.toBe("");
  });

  // === New tests for granular login failures ===

  test("Shows alert when login fails due to invalid email", async () => {
    loginUserAPI.mockRejectedValueOnce(new Error("Invalid email"));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "invalid-email@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "validpassword" },
    });
    fireEvent.click(screen.getByText("Sign In Now"));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Invalid email")
    );
  });

  test("Shows alert when login fails due to invalid password", async () => {
    loginUserAPI.mockRejectedValueOnce(new Error("Invalid password"));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "valid@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Sign In Now"));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Invalid password")
    );
  });

  test("Shows alert when login fails due to invalid email and password", async () => {
    loginUserAPI.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "invalid@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Sign In Now"));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials")
    );
  });

  // === End new granular login tests ===

  test("Invalid credentials shows alert when login fails", async () => {
    // This is similar to the last new test, but keeping for backward compatibility
    loginUserAPI.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
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

  test("Shows toast on successful login", async () => {
    loginUserAPI.mockResolvedValueOnce({ username: "joe", token: "tok123" });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "joe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Sign In Now"));

    await waitFor(() =>
      expect(loginUserAPI).toHaveBeenCalledWith({
        email: "joe@example.com",
        password: "password",
      })
    );

    expect(await screen.findByText("Login Successful!")).toBeInTheDocument();
  });

  // Signup related tests

  test("Signup dropdown appears when clicking 'Create one'", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText(/Create one/i));
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  test("Shows validation error when signup fields are empty", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText(/Create one/i));
    fireEvent.click(screen.getByText("Sign Up Now"));

    expect(screen.getByLabelText("Email Address").validationMessage).not.toBe(
      ""
    );
    expect(screen.getByLabelText("Password").validationMessage).not.toBe("");
    expect(
      screen.getByLabelText("Confirm Password").validationMessage
    ).not.toBe("");
  });

  test("Shows alert when passwords do not match during signup", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
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

  test("Shows toast on successful signup", async () => {
    signupUserAPI.mockResolvedValueOnce({
      user: { username: "newbie" },
      token: "tok456",
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText(/Create one/i));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password1" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password1" },
    });
    fireEvent.click(screen.getByText("Sign Up Now"));

    await waitFor(() =>
      expect(signupUserAPI).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password1",
        confirmPassword: "password1",
      })
    );

    expect(await screen.findByText("Sign Up Successful!")).toBeInTheDocument();
  });

  test("Shows 'Your Bookmarks' when authenticated", () => {
    localStorage.setItem("token", "tok123");
    localStorage.setItem("user", JSON.stringify({ username: "joe" }));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText("Your Bookmarks")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).toBeNull();
  });
});
