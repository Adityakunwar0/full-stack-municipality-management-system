import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Hero from '../common/Hero'
import Member from '../common/Member'
import Statistics from '../common/Statistics'
import Quote from '../common/Quote'

const About = () => {
  return (
    <>
      <Header />
      <main>
        <Hero
          preHeading="Building Today For A Better Tommorow."
          heading="About Municipality"
          text=" Gaur Municipality is commited to transparent <br/> governance, sustainable development, and  <br/> improving lives through efficient projects  <br/> and community teamwork to build a  <br/> stronger,  smarter         
          prosperous Municipality. "
        />

        <Member />
        <Statistics />
        <Quote />

      </main>


      <Footer />

    </>
  )
}

export default About