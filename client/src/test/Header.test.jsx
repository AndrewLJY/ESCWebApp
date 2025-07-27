import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../components/header";
import React from "react";

beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

describe("Header Component", () => {
  test("Login dropdown opens on button click", () => {
    render(<Header />);
    const loginBtn = screen.getByText("Login");
    fireEvent.click(loginBtn);
    expect(screen.getByText("Sign In Now")).toBeInTheDocument();
  });

  test("Signup dropdown appears when clicking 'Create one'", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText(/Create one/i));
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  test("Login dropdown closes on Close button click", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
  });

  test("Shows alert when passwords do not match during signup", async () => {
    render(<Header />);
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText(/Create one/i));

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "654321" },
    });

    fireEvent.click(screen.getByText(/Sign Up Now/i));

    expect(window.alert).toHaveBeenCalledWith("Passwords do not match!");
  });
});
