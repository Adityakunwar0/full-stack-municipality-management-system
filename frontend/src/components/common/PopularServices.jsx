import React from "react";

const services = [
  {
    icon: "fa-solid fa-file-circle-check",
    title: "Building Permit",
    description: "Apply for new building permit or renewal.",
    btnText: "Apply Now",
    color: "green",
  },
  {
    icon: "fa-solid fa-droplet",
    title: "Water Connection",
    description: "Apply for new water connection or changes.",
    btnText: "Apply Now",
    color: "blue",
  },
  {
    icon: "fa-solid fa-trash",
    title: "Waste Collection",
    description: "Request for waste collection services.",
    btnText: "Apply Now",
    color: "orange",
  },
  {
    icon: "fa-solid fa-house",
    title: "Tax Payment",
    description: "Pay property tax and other taxes online.",
    btnText: "Pay Now",
    color: "purple",
  },
];

const PopularServices = () => {
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
                {service.btnText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularServices;