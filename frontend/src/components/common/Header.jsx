import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import Logo from '../../assets/images/logo.png';

const Header = () => {
  return (
    <header>
      <div className="container py-2">
        <Navbar expand="lg">
          <Navbar.Brand href="/" className="logo">
            <img width={50} src={Logo} />
            <span>Gaur Municipality City <br /> Madhesh Province, Rautahat</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/" className="nav-link">
                Home
              </Nav.Link>
              <Nav.Link href="/about" className="nav-link">
                About
              </Nav.Link>
              <Nav.Link href="/services" className="nav-link">
                Projects
              </Nav.Link>
              <Nav.Link href="/projects" className="nav-link">
                Notices
              </Nav.Link>
              <Nav.Link href="/blogs" className="nav-link">
                Contact
              </Nav.Link>
              <Nav.Link href="/contact" className="citizen-btn">
                <span className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M5.5 21c0-4.5 3-7 6.5-7s6.5 2.5 6.5 7"></path>
                  </svg>
                </span>
                Citizen Portal
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;