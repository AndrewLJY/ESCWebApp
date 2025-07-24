// // src/components/Header.jsx
// import React, { useState, useEffect } from "react";
// import "../styles/Header.css";
// import { loginUserAPI, signupUserAPI } from "../middleware/authApi";

// export default function Header() {
//   const [loginOpen, setLoginOpen] = useState(false);
//   const [signupOpen, setSignupOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // blur either .landing OR .search-page, depending on where it's used
//   useEffect(() => {
//     const container =
//       document.querySelector(".landing") ||
//       document.querySelector(".search-page");
//     if (!container) return;
//     if (loginOpen || signupOpen) container.classList.add("blurred");
//     else container.classList.remove("blurred");
//   }, [loginOpen, signupOpen]);

//   const handleLoginClick = () => {
//     setLoginOpen((o) => !o);
//     setSignupOpen(false);
//   };
//   const handleSignupClick = () => {
//     setSignupOpen((o) => !o);
//     setLoginOpen(false);
//   };
//   const closeAll = () => {
//     setLoginOpen(false);
//     setSignupOpen(false);
//   };

//   return (
//     <>
//       <div className="header__logo">Ascenda</div>
//       <div className="header__actions">
//         <button className="btn login" onClick={handleLoginClick}>
//           Login
//         </button>
//         <button className="btn book" onClick={handleLoginClick}>
//           Book Now
//         </button>
//       </div>

//       {loginOpen && !signupOpen && (
//         <div className="login-dropdown">
//           <h2 className="dropdown__title">Sign In</h2>
//           <form
//             className="login-form"
//             onSubmit={async (e) => {
//               e.preventDefault();
//               setLoading(true);
//               try {
//                 const data = new FormData(e.target);
//                 await loginUserAPI({
//                   email: data.get("email"),
//                   password: data.get("password"),
//                 });
//                 alert("Login successful!");
//                 closeAll();
//               } catch (err) {
//                 alert(err.message);
//               } finally {
//                 setLoading(false);
//               }
//             }}
//           >
//             <div className="form-group">
//               <label>Email Address</label>
//               <input name="email" type="email" required />
//             </div>
//             <div className="form-group">
//               <label>Password</label>
//               <input name="password" type="password" required />
//             </div>
//             <button type="submit" className="btn submit" disabled={loading}>
//               {loading ? "Signing In..." : "Sign In Now"}
//             </button>
//             <p className="dropdown__signup">
//               Don’t have an account?{" "}
//               <button
//                 className="btn signup"
//                 type="button"
//                 onClick={handleSignupClick}
//               >
//                 Create one
//               </button>
//             </p>
//             <button className="btn close" type="button" onClick={closeAll}>
//               Close
//             </button>
//           </form>
//         </div>
//       )}

//       {signupOpen && !loginOpen && (
//         <div className="signup-dropdown">
//           <h2 className="dropdown__title">Create Account</h2>
//           <form
//             className="login-form"
//             onSubmit={async (e) => {
//               e.preventDefault();
//               setLoading(true);
//               try {
//                 const data = new FormData(e.target);
//                 await signupUserAPI({
//                   email: data.get("email"),
//                   password: data.get("password"),
//                   confirmPassword: data.get("confirmPassword"),
//                 });
//                 alert("Account created!");
//                 closeAll();
//               } catch (err) {
//                 alert(err.message);
//               } finally {
//                 setLoading(false);
//               }
//             }}
//           >
//             <div className="form-group">
//               <label>Email Address</label>
//               <input name="email" type="email" required />
//             </div>
//             <div className="form-group">
//               <label>Password</label>
//               <input name="password" type="password" required />
//             </div>
//             <div className="form-group">
//               <label>Confirm Password</label>
//               <input name="confirmPassword" type="password" required />
//             </div>
//             <button type="submit" className="btn submit" disabled={loading}>
//               {loading ? "Signing Up..." : "Sign Up Now"}
//             </button>
//             <button className="btn close" type="button" onClick={closeAll}>
//               Close
//             </button>
//           </form>
//         </div>
//       )}
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { loginUserAPI, signupUserAPI } from "../middleware/authApi";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // blur Landing, Search or HotelDetail page when dropdown is open
  useEffect(() => {
    const container =
      document.querySelector(".landing") ||
      document.querySelector(".search-page") ||
      document.querySelector(".hotel-detail-page");
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

  return (
    <>
      <div className="header__logo">Ascenda</div>
      <div className="header__actions">
        <button className="btn login" onClick={handleLoginClick}>
          Login
        </button>
        <button className="btn book" onClick={handleLoginClick}>
          Book Now
        </button>
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
                await loginUserAPI({
                  email: data.get("email"),
                  password: data.get("password"),
                });
                alert("Login successful!");
                closeAll();
              } catch (err) {
                alert(err.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" required />
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
                await signupUserAPI({
                  email: data.get("email"),
                  password: data.get("password"),
                  confirmPassword: data.get("confirmPassword"),
                });
                alert("Account created!");
                closeAll();
              } catch (err) {
                alert(err.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" required />
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
