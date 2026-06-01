import React from "react";
import BannerImage from "../../assets/images/pond.png";
import PopularServices from "../common/PopularServices";
import Dash from "../common/Dash";

const CitizenPortal = () => {
  return (
    <>
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
              track requests, make payments, and stay updated.
            </p>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search services, documents, or information..."
              />

              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          {/* Right Profile Card */}
          <div className="portal-card">
            <div className="user-info">
              <div className="avatar">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <span>Welcome Back,</span>
                <h4>Ramesh Adhikari</h4>
                <p>ramesh.adhikari@email.com</p>
              </div>
            </div>

            <ul>
              <li>
                <i className="fa-regular fa-square"></i>
                My Dashboard
              </li>

              <li>
                <i className="fa-regular fa-file-lines"></i>
                My Requests
              </li>

              <li>
                <i className="fa-regular fa-credit-card"></i>
                My Payments
              </li>

              <li>
                <i className="fa-regular fa-user"></i>
                My Profile
              </li>
            </ul>

            <div className="logout">
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </div>
          </div>

        </div>
      </div>
    </section>

    <PopularServices />
    <Dash />

    </main>
    </>
  );
};

export default CitizenPortal;