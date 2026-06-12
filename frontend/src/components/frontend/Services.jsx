import React, { useContext, useEffect, useState } from 'react'
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import { apiurl, token } from '../common/Http';
import Quote from '../common/Quote';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../backend/context/Auth';

const Services = () => {
  const [services, setServices] = useState([]);
  const [applying, setApplying] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchServices = async () => {
    try {
      const res = await fetch(apiurl + "get-services", {
        method: "GET",
      });
      const result = await res.json();
      setServices(result.data || []); // Added fallback default empty array
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // FIXED: Changed parameter from serviceId to the full service object
  const handleApply = async (service) => {
    const userToken = token();

    if (!userToken) {
      toast.warning(
        <div>
          Please login to apply for this service.{" "}
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

    setApplying(service.id);
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
          service_id: service.id,
          request_status: "progress",
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Service request submitted successfully!");
        
        // FIXED: This safely runs because 'service' object is now in scope
        const isPayment = service.btn_text?.toLowerCase() === "pay now";
        const targetPage = isPayment ? "my-payments" : "my-requests";
        const rolePath = user?.role === "admin" ? "admin" : "user";
        
        navigate(`/${rolePath}/${targetPage}`);
      } else {
        const errorMsg = result?.message || result?.error || "Failed to submit request.";
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
    <>
      <Header />
      <main>
        <Hero
          preHeading="Building Today For A Better Tommorow."
          heading="Services"
          text=" Stay updated with the latest announcements <br/> and important information. "
        />

        <section className='section-3 services light-background py-3'>
          <div className='container-fluid py-5'>
            <div className='section-header text-center'>
              <span> Payments </span>
              <h2>Municipality Payment Services</h2>
            </div>
            <div className='row pt-4 services-grid'>
              {services
                .filter(service => service.btn_text?.toLowerCase() === "pay now")
                .map((service, index) => (
                  <div className="service-card" key={index}>
                    <div className={`icon-circle ${service.color}`}>
                      <i className={service.icon}></i>
                    </div>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                    <button
                      onClick={() => handleApply(service)} 
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

        <section className='section-3 services light-background py-3'>
          <div className='container-fluid py-5'>
            <div className='section-header text-center'>
              <span> Requests </span>
              <h2>Municipality Request Services</h2>
            </div>
            
            <div className='row pt-4 services-grid'>
              {services
                .filter(service => service.btn_text?.toLowerCase() === "apply now")
                .map((service, index) => (
                  <div className="service-card" key={index}>
                    <div className={`icon-circle ${service.color}`}>
                      <i className={service.icon}></i>
                    </div>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                    <button
                      onClick={() => handleApply(service)} 
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

        <Quote />
      </main>
      <Footer />
    </>
  )
}

export default Services;