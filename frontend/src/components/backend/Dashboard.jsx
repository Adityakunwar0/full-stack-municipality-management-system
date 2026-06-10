import React, { useContext } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import PopularServices from "../common/PopularServices";
import RequestDashboard from "../common/RequestDashboard";
import Portal from "../common/Portal";

const Dashboard = () => {

  return (
    <>
      <Header />
      <main>
        <Portal
          heading="Citizen Portal"
          text="Your one-stop platform to access municipal services, track requests, and make payments."
        />

        <PopularServices />
        <RequestDashboard />



      </main>

      <Footer />
    </>
  );
};

export default Dashboard;