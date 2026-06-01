import React from 'react'
import Footer from '../common/Footer'
import Header from '../common/Header'
import {default as CommonComplaint} from '../common/Complaint'
import Quote from '../common/Quote'


const Complaint = () => {
  return (
    <>
    <Header/>
    <main>
        <CommonComplaint />

        <Quote />
        

    </main>
    <Footer />

     </>
  )
}

export default Complaint