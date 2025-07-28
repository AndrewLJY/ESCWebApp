import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUserAPI, signupUserAPI, logoutUserAPI } from "../middleware/authApi";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, logout, isAuthenticated } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";
  
  // Add blur class when modals are open
  const isModalOpen = loginOpen || signupOpen;

  const closeAll = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  // Use document.body to apply blur effect to entire page
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);
  
  return (
    <div className={isModalOpen ? 'blur-background' : ''}>
      <header className={`navbar ${isLandingPage ? 'landing-navbar' : ''}`}>
        <div className="navbar-logo" onClick={() => navigate("/")}>
          Ascenda
        </div>
        <div className="navbar-actions">
          {isAuthenticated() ? (
            <>
              <span className="user-greeting">Hello, {user?.name || user?.email}</span>
              <button
                className="btn logout"
                onClick={async () => {
                  await logoutUserAPI();
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn login"
                onClick={() => {
                  closeAll();
                  setLoginOpen(true);
                }}
              >
                Login
              </button>
              <button
                className="btn book"
                onClick={() => {
                  closeAll();
                  setLoginOpen(true);
                }}
              >
                Book Now
              </button>
            </>
          )}
        </div>
      </header>

      {/* LOGIN DROPDOWN */}
      {loginOpen && !signupOpen && (
        <div className="login-dropdown">
          <h2 className="dropdown__title">Sign In</h2>
          <form className="login-form" onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const formData = new FormData(e.target);
              const result = await loginUserAPI({
                email: formData.get('email'),
                password: formData.get('password')
              });
              
              if (result.success) {
                login(result.data.user, result.data.token);
                alert('Login successful!');
                closeAll();
              } else {
                alert('Login failed');
              }
            } catch (error) {
              alert(error.message);
            } finally {
              setLoading(false);
            }
          }}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input name="email" id="email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input name="password" id="password" type="password" required />
            </div>
            <button type="submit" className="btn submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In Now'}
            </button>
            <p className="dropdown__signup">
              Don't have an account? Click{" "}
              <button
                type="button"
                className="btn signup"
                onClick={() => {
                  setSignupOpen(true);
                  setLoginOpen(false);
                }}
              >
                here
              </button>
            </p>
            <button type="button" className="btn close" onClick={closeAll}>
              Close
            </button>
          </form>
        </div>
      )}

      {/* SIGNUP DROPDOWN */}
      {signupOpen && !loginOpen && (
        <div className="signup-dropdown">
          <h2 className="dropdown__title">Create Account</h2>
          <form className="login-form" onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              const formData = new FormData(e.target);
              const result = await signupUserAPI({
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
              });
              
              if (result.success) {
                login(result.data.user, result.data.token);
                alert('Account created successfully!');
                closeAll();
              } else {
                alert('Signup failed');
              }
            } catch (error) {
              alert(error.message);
            } finally {
              setLoading(false);
            }
          }}>
            <div className="form-group">
              <label htmlFor="new-email">Email Address</label>
              <input name="email" id="new-email" type="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Password</label>
              <input name="password" id="new-password" type="password" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input name="confirmPassword" id="confirm-password" type="password" required />
            </div>
            <button type="submit" className="btn submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up Now'}
            </button>
            <button type="button" className="btn close" onClick={closeAll}>
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
}