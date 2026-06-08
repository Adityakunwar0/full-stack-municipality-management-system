import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { default as CommonComplaint } from "../common/Complaint";
import Quote from "../common/Quote";
import Hero from "../common/Hero";

const Complaint = () => {
  return (
    <>
      <Header />

      <main>
        <Hero
          preHeading="Building Today For A Better Tomorrow."
          heading="Complaint Us"
          text="Have a complaint? Register your complaint here."
        />

        <CommonComplaint />

        <Quote />
      </main>

      <Footer />
    </>
  );
};

export default Complaint;