import React, { useContext } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import BannerImage from "../../assets/images/pond.png";
import PopularServices from "../common/PopularServices";
import Dash from "../common/Dash";
import { AuthContext } from "./context/Auth";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }
  return (
    <>
      <Header />
      <main>


        <section className="citizen-portal-section">
          <div
            className="portal-banner"
            style={{ backgroundImage: `url(${BannerImage})` }}
          >
            <div className="overlay"></div>

            <div className="container portal-content">

              {/* Left Content */}
              <div className="portal-left">
                <h1>Citizen Portal</h1>

                <p>
                  Your one-stop platform to access municipal services,
                  track requests,  <br /> make payments, and stay updated.
                </p>

              </div>

              {/* Right Profile Card */}
              <div className="portal-card">
                <div className="user-info">
                  <div className="avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>

                  <div>
                    <span>Welcome Back,</span>
                    <h4>{user?.name}</h4>
                    <p>{user?.email}</p>
                    <p>
                      {user?.role === "admin"
                        ? "Administrator"
                        : "Citizen User"}
                    </p>
                  </div>
                </div>

               <ul>
                  {user?.role === "admin" && (
                    <li>
                      <Link
                        to="/admin/panel">
                        <i className="fa-regular fa-user-shield"></i>
                        Admin Panel
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link to="/complaint">
                      <i className="fa-solid fa-file-circle-exclamation"></i>
                      Complaint Register
                    </Link>
                  </li>

                  <li>
                    <Link to="/my-requests">
                      <i className="fa-regular fa-file-lines"></i>
                      My Requests
                    </Link>
                  </li>

                  <li>
                    <Link to="/my-payments">
                      <i className="fa-regular fa-credit-card"></i>
                      My Payments
                    </Link>
                  </li>

                  <li>
                    <Link to="/profile">
                      <i className="fa-regular fa-user"></i>
                      My Profile
                    </Link>
                  </li>
                </ul>

                <button
                  className="btn btn-primary small "
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Logout
                </button>
              </div>

            </div>
          </div>
        </section>

        <PopularServices />
        <Dash />

      </main>

      <Footer />
    </>
  );
};

export default Dashboard;