import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import './Header.css'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"));

  const handlelogout = useCallback(() => {
    localStorage.removeItem("user")
    navigate("/login")
  }, [navigate])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* Glow Background */}
      <div className="header-glow-background">
        <div className="header-main-glow"></div>
        <div className="header-secondary-glow"></div>
      </div>

      <header className="glass-header">
        <div className="header-container">
          {/* Logo */}
          <div className="header-logo">
            <button className="logo-link" onClick={() => navigate("/")}>
              <span className="logo-text">Merny Manager</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <MenuOutlined />
          </button>

          {/* Navigation */}
          <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {user && (
              <div className="nav-items">
                <div className="user-info">
                  <UserOutlined />
                  <span className="user-name">{user.name}</span>
                </div>
                <button className="logout-btn" onClick={handlelogout}>
                  <LogoutOutlined />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header