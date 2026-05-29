import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Hero from '../common/Hero'
import Water from '../../assets/images/water.png'
import { Link } from 'react-router-dom'
import Quote from '../common/Quote'

const Notices = () => {
  return (
    <>
    <Header />
    <main >
        <Hero
          preHeading="Building Today For A Better Tommorow."
          heading="Notices"
          text=" Stay updated with the latest announcements <br/> and important information. "
        />
        <section className="section-7 light-background py-5">
          <div className="container py-5">
            <div className="section-header text-center">
              <span>All Notices</span>
              <h2>Building A Better Tomorrow</h2>
              <p>
                Stay updated with the latest announcements Get all essential updates in one place and important information.
              </p>
            </div>
            <div className="row pt-4">
              
                    <div  className="col-md-4 col-lg-4">
                      <div className="item">
                        <div className="service-image">
                          <img
                            src={Water}
                            alt=""
                            className="w-100"
                          />
                        </div>
                        <div className="service-body">
                          <div className="service-title">
                            <h3>Water Supply Maintenance</h3>
                          </div>
                          <div className="service-content">
                            <p>Water Supply Will be interrupted from 10:00 AM to 4:00 PM due to pipeline maintenance in Ward 5</p>
                          </div>
                          <Link
                            to="/"
                            className="btn btn-primary small"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                 
            </div>
          </div>
        </section>
        <Quote />

    </main>
    <Footer />
    </>
  )
}

export default Notices