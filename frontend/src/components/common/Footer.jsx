import React from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from '../../assets/images/logo.png';

export const Footer = () => {
  return (
    <footer>
      <div className="container py-5">
        <div className="row ">
          <div className="col-md-3 px-2">
            <Navbar.Brand href="/" className="logo">
            <img width={50} src={Logo} />
            <span>Gaur Municipality City <br /> Madhesh Province, Rautahat</span>
          </Navbar.Brand>
            <div className="pe-10 mt-3 ">
              <p >
                Committed to transparenency, sustanbility and inclusive development for a better Tommorrow.
              </p>
            </div>
          </div>
           <div className="col-md-3 px-5">
            <h3 className="mb-3">Quick Links</h3>
            <ul>
                <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About </Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/contacts">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3 px-1">
            <h3 className="mb-3">Useful Links</h3>
            <ul>
              <li>
                <Link to="/login">Citizen Login</Link>
              </li>
              <li>
                <Link to="/complaint">Citizen Complaints</Link>
              </li>
              <li>
                <Link to="/notices">Public Notices</Link>
              </li>
              <li>
                <Link to="/faqs">FAQs</Link>
              </li>
            </ul>
          </div>
         
          <div className="col-md-3 px-2">
            <h3 className="mb-3">Contact Info</h3>
            <ul>
              <li>
                <p>Gaur, Rautahat, Nepal</p>
              </li>
              <li>
                <p>Phone No:- 055-520292, 055-520894 </p>
              </li>
              <li>
                <p>Fax:- 055-520294</p>
              </li>
              
            </ul>
          </div>
          <hr />
          <p className="text-center pt-2">
            Copyright @2026 Gaur Municipality City. All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;