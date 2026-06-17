import React, { useContext } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import Portal from '../common/Portal';
import Member from '../common/Member';
import Statistics from '../common/Statistics';
import Quote from '../common/Quote';
import { AuthContext } from '../backend/context/Auth';

const About = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      
      <main>
        {user ? (
          <Portal
            heading="About Our Municipality"
            text="Welcome to your citizen dashboard. Learn more about Gaur Municipality's vision for transparent governance, ongoing sustainable development projects, and our community-driven milestones."
          />
        ) : (
          <Hero
            preHeading="Building Today For A Better Tomorrow."
            heading="About Municipality"
            text="Gaur Municipality is committed to transparent governance, sustainable development, and improving lives through efficient projects and community teamwork to build a stronger, smarter, and prosperous Municipality."
          />
        )}

        <Member />
        <Statistics />
        <Quote />
      </main>

      <Footer />
    </>
  );
};

export default About;