import React, { useContext } from "react";
import BannerImage from "../../assets/images/pond.png";
import { AuthContext } from "../backend/context/Auth";
import { Link, useNavigate } from "react-router-dom";

// Added heading, text, and children props to make the left side dynamic
const Portal = ({ heading, text, children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const rolePath = user?.role === "admin" ? "admin" : "user";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <section className=" citizen-portal-section">
            <div
                className="portal-banner"
                style={{ backgroundImage: `url(${BannerImage})` }}
            >
                <div className="overlay"></div>

                <div className="container portal-content">

                    {/* Dynamic Left Content */}
                    <div className="portal-left">
                        {/* Fallback defaults are provided using || operator */}
                        <h1>{heading || "Citizen Portal"}</h1>

                        {text ? (
                            <p>{text}</p>
                        ) : children ? (
                            <div className="custom-portal-content">{children}</div>
                        ) : (
                            <p>
                                Your one-stop platform to access municipal services,
                                track requests, <br /> make payments, and stay updated.
                            </p>
                        )}
                    </div>

                    {/* Static Right Profile Card */}
                    <div className="portal-card">
                        <div className="user-info">
                            <div className="avatar">
                                <i className="fa-solid fa-user"></i>
                            </div>

                            <div>
                                <span>Welcome Back,</span>
                                <h4>{user?.name || "Guest"}</h4>
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
                                    <Link to="/admin/panel">
                                        <i className="fa-regular fa-user-shield"></i>
                                        Admin Panel
                                    </Link>
                                </li>
                            )}

                            <li>
                                <Link to={`/${rolePath}/complaint`}>
                                    <i className="fa-solid fa-file-circle-exclamation"></i>
                                    Complaint Register
                                </Link>
                            </li>

                            <li>
                                <Link to={`/${rolePath}/my-requests`}>
                                    <i className="fa-regular fa-file-lines"></i>
                                    My Requests
                                </Link>
                            </li>

                            <li>
                                <Link to={`/${rolePath}/profile`}>
                                    <i className="fa-regular fa-user"></i>
                                    My Profile
                                </Link>
                            </li>
                        </ul>

                        <button
                            className="btn btn-primary small"
                            onClick={handleLogout}
                        >
                            <i className="fa-solid fa-right-to-bracket"></i>
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Portal;