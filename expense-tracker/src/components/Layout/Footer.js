import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <>
      {/* Glow Background */}
      {/* <div className="footer-glow-background">
        <div className="footer-main-glow"></div>
        <div className="footer-secondary-glow"></div>
      </div> */}

      <footer className="glass-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-text">
              <span className="copyright-text">
                All rights reserved &copy; Abhijit Rajput
              </span>
            </div>
            <div className="footer-divider"></div>
            <div className="footer-brand">
              <span className="brand-text">Merny Manager</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer