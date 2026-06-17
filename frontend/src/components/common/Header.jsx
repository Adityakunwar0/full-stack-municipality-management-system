import React, { useContext, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Logo from '../../assets/images/logo.png';
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../backend/context/Auth";

const Header = () => {
  const { user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    // Stops link default behaviors while shifting target view parameters
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="main-header">
      <div className="container">
        <Navbar expand="lg" variant="dark">

          {/* Logo Brand Identity */}
          <Navbar.Brand as={Link} to="/" className="logo">
            <img width={50} src={Logo} alt="Gaur Municipality Logo" />
            <span>Gaur Municipality City <br /> <small>Madhesh Province, Rautahat</small></span>
          </Navbar.Brand>

          {/* Hamburger Mobile Toggle Icon */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navigation Container Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-lg-center">

              {/* Used NavLink for built-in active status link styling rules */}
              <Nav.Link as={NavLink} to="/" className="nav-link">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/about" className="nav-link">About</Nav.Link>
              <Nav.Link as={NavLink} to="/services" className="nav-link">Services</Nav.Link>
              <Nav.Link as={NavLink} to="/projects" className="nav-link">Projects</Nav.Link>
              <Nav.Link as={NavLink} to="/notices" className="nav-link">Notices</Nav.Link>
              <Nav.Link as={NavLink} to="/contacts" className="nav-link">Contact</Nav.Link>

              {/* Dropdown Action Controls Wrapper */}
              <div className={`portal-dropdown ${dropdownOpen ? 'is-open' : ''}`}>
                {!user ? (
                  <>
                    <div className="citizen-btn" onClick={toggleDropdown}>
                      <span className="icon">
                        <i className="fa-solid fa-user"></i>
                      </span>
                      Citizen Portal
                      <i className={`fa-solid fa-chevron-down arrow-icon ${dropdownOpen ? 'rotate' : ''}`}></i>
                    </div>

                    <div className="portal-menu">
                      <Link to="/login" onClick={() => setDropdownOpen(false)}>
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Login
                      </Link>
                      <Link to="/complaint" onClick={() => setDropdownOpen(false)}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Complaint Here
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                    className="citizen-btn text-decoration-none"
                  >
                    <span className="icon">
                      <i className="fa-solid fa-user-circle"></i>
                    </span>
                    {user.name}
                  </Link>
                )}
              </div>

            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;