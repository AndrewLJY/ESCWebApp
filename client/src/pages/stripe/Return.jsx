import React, { useCallback, useState, useEffect } from "react";
import {
  Navigate,
  useNavigate
} from "react-router-dom";
import axios from "axios";

export default function Return() {
    const [status, setStatus] = useState(null);
      const [customerEmail, setCustomerEmail] = useState('');
    
      useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');
    
        axios.get(`http://localhost:8080/stripe/session-status?session_id=${sessionId}`)
          .then((response) => {
            setStatus(response.data.status);
            setCustomerEmail(response.data.customer_email);
          });
      }, []);
    
      if (status === 'open') {
        return (
          <Navigate to="/checkout" />
        )
      }

      let navigate = useNavigate(); 
      const routeChange = () =>{ 
        let path = `/`; 
        navigate(path);
      }
    
      if (status === 'complete') {
        return (
          <section id="success">
            <p>
              We appreciate your business! A confirmation email will be sent to {customerEmail}.
    
              If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
            </p>
            <button onClick={routeChange}>Back to Home Page</button>
          </section>
        )
      }
    
      return null;
  
}