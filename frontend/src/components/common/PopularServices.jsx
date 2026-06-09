import React, { useContext, useEffect, useState } from "react";
import { apiurl, token } from "./Http";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../backend/context/Auth";


const PopularServices = () => {

  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchLatestServices = async () => {
    const res = await fetch(apiurl + "get-latest-services?limit=4", {
      method: "GET",
    });
    const result = await res.json();
    //console.log(result);
    setServices(result.data);
  };
  useEffect(() => {
    fetchLatestServices();
  }, []);

  const handleApply = (serviceId) => {
    const userToken = token();

    if (userToken) {
      const rolePath = user?.role === "admin" ? "admin" : "user";


      toast.success("Proceeding to application...");
      navigate(`/${rolePath}/my-requests`);
    } else {

      toast.warning(
        <div>
          Please login to apply for this service.
          <span
            onClick={() => navigate("/login")}
          >
            Login now
          </span>
        </div>,
        { autoClose: 4000 }
      );
      setTimeout(() => navigate("/login"), 3000);
    }
  };



  return (
    <section className="popular-services">
      <div className="container">

        <div className="section-header">
          <h2>Popular Services</h2>
          <a href="/services">View All Services →</a>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className={`icon-circle ${service.color}`}>
                <i className={service.icon}></i>
              </div>

              <h4>{service.title}</h4>

              <p>{service.description}</p>

              <button
                onClick={handleApply}
                className={`service-btn ${service.color}`}>
                {service.btn_text}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularServices;