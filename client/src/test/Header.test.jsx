//unittest

import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../components/header";
import React from "react";

describe("Header Component", () => {
  test("Login dropdown opens on button click", () => {
    render(<Header />);
    const loginBtn = screen.getByText("Login");
    fireEvent.click(loginBtn);
    expect(screen.getByText("Sign In Now")).toBeInTheDocument(); // to target button
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
});
