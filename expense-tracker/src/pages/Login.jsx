import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { url } from "../url.js";
import axios from "axios";
import Spinner from '../components/Spinner.jsx';
import { message } from "antd";
import './Login.css'; // Import the crystal styles here

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  // Mouse move effect for the "Krystal" tilt
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

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${url}/users/login`, {
        email,
        password
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, password: "" })
      );

      message.success("Login Successfully");
      navigate("/");

    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("user")) return null;

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