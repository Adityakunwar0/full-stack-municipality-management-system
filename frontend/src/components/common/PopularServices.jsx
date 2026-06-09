import React, { useEffect, useState } from "react";
import { apiurl } from "./Http";
import { Link } from "react-router-dom";


const PopularServices = () => {

   const [services, setServices] = useState([]);
  
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

              <button className={`service-btn ${service.color}`}>
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