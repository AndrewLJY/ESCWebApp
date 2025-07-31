import React, { useState, useEffect } from "react";
import { loginUserAPI, signupUserAPI } from "../middleware/authApi";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    console.log("[Auth] Checking if user is logged in on mount...");

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log(`[Auth] Retrieved token: ${token}`);
    console.log(`[Auth] Retrieved user data: ${userData}`);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("[Auth] User successfully parsed and set:", parsedUser);
      } catch (error) {
        console.error("[Auth] Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("[Auth] Cleared invalid token and user from localStorage.");
      }
    } else {
      console.log("[Auth] No token or user found. User not logged in.");
    }
  }, []);

  const isAuthenticated = () => {
    const hasToken = !!localStorage.getItem("token");
    const authStatus = !!user && hasToken;
    console.log(`[Auth] isAuthenticated? ${authStatus}`);
    return authStatus;
  };

  const login = (userData, token) => {
    console.log("[Auth] Logging in user...");
    console.log("User data:", userData);
    console.log("Token:", token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    console.log("[Auth] User logged in and saved to localStorage.");
  };

  const logout = () => {
    console.log("[Auth] Logging out user...");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    console.log("[Auth] User logged out and data cleared.");
  };

  // blur Landing, Search or HotelDetail page when dropdown is open
  useEffect(() => {
    const container =
      document.querySelector(".landing") ||
      document.querySelector(".search-page") ||
      document.querySelector(".hotel-detail-page") ||
      document.querySelector(".bookmark-page");
    if (!container) return;
    if (loginOpen || signupOpen) container.classList.add("blurred");
    else container.classList.remove("blurred");
  }, [loginOpen, signupOpen]);

  const handleLoginClick = () => {
    setLoginOpen((o) => !o);
    setSignupOpen(false);
  };

  const handleSignupClick = () => {
    setSignupOpen((o) => !o);
    setLoginOpen(false);
  };

  const closeAll = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="header__logo">Ascenda</div>
      <div className="header__actions">
        {isAuthenticated() ? (
          <>
            <span className="user-email">{user?.email}</span>
            <button
              className="btn logout"
              onClick={() => {
                logout();
                window.location.reload();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn login" onClick={handleLoginClick}>
              Login
            </button>
            <button className="btn book" onClick={() => navigate("/bookmark")}>
              Bookmark
            </button>
          </>
        )}
      </div>

      {loginOpen && !signupOpen && (
        <div className="login-dropdown">
          <h2 className="dropdown__title">Sign In</h2>
          <form
            className="login-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                const data = new FormData(e.target);
                const result = await loginUserAPI({
                  email: data.get("email"),
                  password: data.get("password"),
                });
                login(result, result.token);
                alert("Login successful!");
                closeAll();
                window.location.reload();
              } catch (err) {
                alert(err.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input id="login-email" name="email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
              />
            </div>
            <button type="submit" className="btn submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In Now"}
            </button>
            <p className="dropdown__signup">
              Don’t have an account?{" "}
              <button
                className="btn signup"
                type="button"
                onClick={handleSignupClick}
              >
                Create one
              </button>
            </p>
            <button className="btn close" type="button" onClick={closeAll}>
              Close
            </button>
          </form>
        </div>
      )}

      {signupOpen && !loginOpen && (
        <div className="signup-dropdown">
          <h2 className="dropdown__title">Create Account</h2>
          <form
            className="login-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                const data = new FormData(e.target);
                const email = data.get("email");
                const password = data.get("password");
                const confirmPassword = data.get("confirmPassword");

                if (password !== confirmPassword) {
                  alert("Passwords do not match!");
                  setLoading(false);
                  return;
                }

                const result = await signupUserAPI({
                  email,
                  password,
                  confirmPassword,
                });
                login(result.user, result.token);
                alert("Account created!");
                closeAll();
                window.location.reload();
              } catch (err) {
                alert(err.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input id="signup-email" name="email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            <button type="submit" className="btn submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up Now"}
            </button>
            <button className="btn close" type="button" onClick={closeAll}>
              Close
            </button>
          </form>
        </div>
      )}
    </>
  );
}
