import React from "react";

const stats = [
  {
    icon: "fa-regular fa-file-lines",
    count: 4,
    title: "Total Requests",
    color: "blue",
  },
  {
    icon: "fa-solid fa-circle-check",
    count: 2,
    title: "In Progress",
    color: "green",
  },
  {
    icon: "fa-regular fa-clock",
    count: 1,
    title: "Under Review",
    color: "orange",
  },
  {
    icon: "fa-solid fa-circle-check",
    count: 1,
    title: "Completed",
    color: "purple",
  },
  {
    icon: "fa-solid fa-circle-xmark",
    count: 0,
    title: "Rejected",
    color: "red",
  },
];

const recentRequests = [
  {
    icon: "fa-solid fa-file-circle-check",
    title: "Building Permit Application",
    date: "May 12, 2024",
    status: "In Progress",
    color: "blue",
  },
  {
    icon: "fa-solid fa-droplet",
    title: "Water Connection Request",
    date: "May 05, 2024",
    status: "Under Review",
    color: "orange",
  },
  {
    icon: "fa-solid fa-trash",
    title: "Waste Collection Service",
    date: "Apr 28, 2024",
    status: "Completed",
    color: "green",
  },
  {
    icon: "fa-solid fa-house",
    title: "Property Tax Payment",
    date: "Apr 20, 2024",
    status: "Completed",
    color: "green",
  },
];

const payments = [
  {
    icon: "fa-solid fa-building",
    title: "House Tax",
    amount: "NPR 2,450.00",
    color: "green",
  },
  {
    icon: "fa-solid fa-house",
    title: "Property Tax",
    amount: "NPR 5,600.00",
    color: "purple",
  },
  {
    icon: "fa-solid fa-droplet",
    title: "Water & Sewer Charge",
    amount: "NPR 1,320.00",
    color: "blue",
  },
];

const Dash = () => {
  return (
    <section className="dashboard">
      <div className="container">
        <h2>My Dashboard</h2>

        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className={`icon-circle ${item.color}`}>
                <i className={item.icon}></i>
              </div>

              <div className="stat-info">
                <h3>{item.count}</h3>
                <p>{item.title}</p>
                <a href="/">View All →</a>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Requests</h3>
              <a href="/">View All →</a>
            </div>

            {recentRequests.map((item, index) => (
              <div className="request-item" key={index}>
                <div className="request-left">
                  <div className={`small-icon ${item.color}`}>
                    <i className={item.icon}></i>
                  </div>

                  <div>
                    <h4>{item.title}</h4>
                    <span>{item.date}</span>
                  </div>
                </div>

                <span className={`status ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>Upcoming Payments</h3>
              <a href="/">View All →</a>
            </div>

            {payments.map((item, index) => (
              <div className="payment-item" key={index}>
                <div className="request-left">
                  <div className={`small-icon ${item.color}`}>
                    <i className={item.icon}></i>
                  </div>

                  <div>
                    <h4>{item.title}</h4>
                    <span>Due Soon</span>
                  </div>
                </div>

                <div className="payment-right">
                  <strong>{item.amount}</strong>
                  <button>Pay Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dash;