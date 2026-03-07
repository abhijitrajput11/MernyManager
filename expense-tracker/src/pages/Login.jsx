import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { url } from "../url.js";
import axios from "axios";
import Spinner from '../components/Spinner.jsx';
import { message } from "antd";
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Import the crystal styles here

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mouse move effect for "Krystal" tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && window.location.pathname === '/login') {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${url}/users/login`, {
        email,
        password
      });

      // Handle both response formats (with or without success field)
      if (response.data.user || response.data.mesg === "login successfully") {
        const userData = response.data.user || response.data.user;
        login(userData);
        
        message.success("Login Successfully");
        
        // Force a small delay to ensure localStorage is set
        setTimeout(() => {
          navigate("/");
        }, 100);
      } else {
        message.error(response.data.message || response.data.mesg || "Login failed");
      }

    } catch (error) {
      message.error(error.response?.data?.message || error.response?.data?.mesg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <>
      {loading ? <Spinner /> : (
        <div className="glass-wrapper">
          {/* The Purple Shade (Background Glow) */}
          <div 
            className="glow-sphere" 
            style={{ 
              transform: `translate(${-coords.x * 3}px, ${-coords.y * 3}px)` 
            }}
          ></div>

          <div 
            className="login-card"
            style={{ 
              transform: `rotateY(${coords.x}deg) rotateX(${-coords.y}deg)` 
            }}
          >
            <div className="glass-shine"></div>
            
            <form onSubmit={handleSubmit} className="login-form">
              <h2>Welcome Back</h2>
              
              <div className="input-container">
                <input 
                  type="email" 
                  value={email} 
                  placeholder="Email Address" 
                  onChange={(e) => setemail(e.target.value)} 
                  required 
                />
                <div className="line"></div>
              </div>

              <div className="input-container">
                <input 
                  type="password" 
                  value={password} 
                  placeholder="Password" 
                  onChange={(e) => setpassword(e.target.value)} 
                  required 
                />
                <div className="line"></div>
              </div>

              <button type="submit" className="krystal-btn" disabled={loading}>
                {loading ? "Authorizing..." : "Authorize"}
              </button>

              <p className="register-text">
                New User? <Link to='/register'>Register Here</Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;