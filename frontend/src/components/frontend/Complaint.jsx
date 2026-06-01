import React from 'react'
import Footer from '../common/Footer'
import Header from '../common/Header'
import {default as CommonComplaint} from '../common/Complaint'
import Quote from '../common/Quote'
import Hero from '../common/Hero'


const Complaint = () => {
  return (
    <>
    <Header/>
    <main>
        <Hero
          preHeading="Building Today For A Better Tommorow."
          heading="Complaint Us "
          text=" Have A complaint, register your complaint ? <br/> We'd love to hear from Here."
        />
        <CommonComplaint />

        <Quote />
        

    </main>
    <Footer />

     </>
  )
}

export default Complaint