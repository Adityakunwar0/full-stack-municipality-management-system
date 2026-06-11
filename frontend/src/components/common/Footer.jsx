import React from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from '../../assets/images/logo.png';

export const Footer = () => {
  return (
    <footer>
      <div className="container py-5">
        {/* Added g-4 for consistent responsive column spacing gaps */}
        <div className="row g-4"> 
          
          {/* Logo & Description Section */}
          <div className="col-sm-6 col-lg-3">
            <Navbar.Brand href="/" className="logo">
              <img width={50} src={Logo} alt="Gaur Municipality Logo" />
              <span>Gaur Municipality City <br /> Madhesh Province, Rautahat</span>
            </Navbar.Brand>
            <div className="mt-3 description-text">
              <p>
                Committed to transparency, sustainability, and inclusive development for a better tomorrow.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-sm-6 col-lg-3">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/contacts">Contact</Link></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="col-sm-6 col-lg-3">
            <h3 className="footer-heading">Useful Links</h3>
            <ul className="footer-links">
              <li><Link to="/login">Citizen Login</Link></li>
              <li><Link to="/complaint">Citizen Complaints</Link></li>
              <li><Link to="/notices">Public Notices</Link></li>
              <li><Link to="/services">Public Services</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-sm-6 col-lg-3">
            <h3 className="footer-heading">Contact Info</h3>
            <ul className="footer-info">
              <li>
                <p><i className="fa-solid fa-location-dot me-2"></i>Gaur, Rautahat, Nepal</p>
              </li>
              <li>
                <p><i className="fa-solid fa-phone me-2"></i>055-520292, 055-520894</p>
              </li>
              <li>
                <p><i className="fa-solid fa-print me-2"></i>Fax: 055-520294</p>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="row mt-4">
          <div className="col-12">
            <hr className="footer-hr" />
            <p className="text-center copyright-text pt-2">
              Copyright ©2026 Gaur Municipality City. All Rights Reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;