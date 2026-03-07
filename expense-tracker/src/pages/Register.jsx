import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { url } from "../url.js"
import axios from "axios"
import { message } from "antd"
import Spinner from '../components/Spinner.jsx'
import "./Login.css"   // reuse same glass styles

const Register = () => {

  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [loading, setloading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setloading(true)

      await axios.post(`${url}/users/register`, {
        name,
        email,
        password
      })

      message.success("Register Successfully")
      navigate("/login")

    } catch (error) {
      message.error("Not able Register Something wrong.")
    } finally {
      setloading(false)
    }
  }

  return (
    <>
      {loading ? <Spinner /> :

        <div className="glass-wrapper">

          <div className="glow-sphere"></div>

          <div className="login-card">

            <div className="glass-shine"></div>

            <form onSubmit={handleSubmit} className="login-form">

              <h2>Create Account</h2>

              <div className="input-container">
                <input
                  type="text"
                  value={name}
                  placeholder="Full Name"
                  onChange={(e) => setname(e.target.value)}
                  required
                />
                <div className="line"></div>
              </div>

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

              <button className="krystal-btn">
                Register
              </button>

              <p className="register-text">
                Already Registered? <Link to="/login">Login Here</Link>
              </p>

            </form>

          </div>

        </div>

      }
    </>
  )
}

export default Register