import React, { useContext, useEffect, useState } from "react";
import { apiurl, token } from "./Http";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../backend/context/Auth";

const PopularServices = () => {
  const [services, setServices] = useState([]);
  const [applying, setApplying] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchLatestServices = async () => {
    const res = await fetch(apiurl + "get-latest-services?limit=4", {
      method: "GET",
    });
    const result = await res.json();
    setServices(result.data);
  };

  useEffect(() => {
    fetchLatestServices();
  }, []);

  const handleApply = async (serviceId) => {
    const userToken = token();

    if (!userToken) {
      toast.warning(
        <div>
          Please login to apply for this service.
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/login")}
          >
            Login now
          </span>
        </div>,
        { autoClose: 4000 }
      );
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    setApplying(serviceId);
    const applyUrl = user?.role === "admin"
      ? apiurl + "admin/apply-service"
      : apiurl + "user/apply-service";


    try {
      const res = await fetch(applyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          service_id: serviceId,
          request_status: "progress",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Service request submitted successfully!");
        const rolePath = user?.role === "admin" ? "admin" : "user";
        navigate(`/${rolePath}/my-requests`);
      } else {
        // Show backend validation errors if any
        const errorMsg =
          result?.message || result?.error || "Failed to submit request.";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setApplying(null);
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
                onClick={() => handleApply(service.id)}
                className={`service-btn ${service.color}`}
                disabled={applying === service.id}
              >
                {applying === service.id ? "Applying..." : service.btn_text}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularServices;