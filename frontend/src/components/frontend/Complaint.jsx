import React, { useContext } from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { default as CommonComplaint } from "../common/Complaint";
import Quote from "../common/Quote";
import Hero from "../common/Hero";
import Portal from "../common/Portal";
import { AuthContext } from "../backend/context/Auth";

const Complaint = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Header />

      <main>
        {user ? (
          <Portal
            heading="Grievance Redressal Portal"
            text="Submit your civic complaints directly to municipal authorities. Track local area resolutions live."
          />
        ) : (
          <Hero
            preHeading="Building Today For A Better Tomorrow."
            heading="Complaint Us"
            text="Have a complaint? Register your complaint here."
          />
        )}

        <CommonComplaint />

        <Quote />
      </main>

      <Footer />
    </>
  );
};

export default Complaint;