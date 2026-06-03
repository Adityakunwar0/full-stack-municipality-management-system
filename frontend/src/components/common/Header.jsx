import React, { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Logo from '../../assets/images/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../backend/context/Auth";

const Header = () => {
  const { user } = useContext(AuthContext);

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
              <Nav.Link href="/projects" className="nav-link">
                Projects
              </Nav.Link>
              <Nav.Link href="/notices" className="nav-link">
                Notices
              </Nav.Link>
              <Nav.Link href="/contacts" className="nav-link">
                Contact
              </Nav.Link>
              <div className="portal-dropdown">

                {!user ? (
                  <>
                    <div className="citizen-btn">
                      <span className="icon">
                        <i className="fa-solid fa-user"></i>
                      </span>
                      Citizen Portal
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    <div className="portal-menu">
                      <Link to="/login">
                        <i className="fa-solid fa-right-to-bracket"></i>
                        Login
                      </Link>

                      <Link to="/complaint">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Complaint Here
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} className="citizen-btn text-decoration-none">
                      <span className="icon">
                        <i className="fa-solid fa-user-circle"></i>
                      </span>

                      {user.name}
                    </Link>

                  </>
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