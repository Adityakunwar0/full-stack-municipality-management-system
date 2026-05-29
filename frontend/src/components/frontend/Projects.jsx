import React from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Hero from '../common/Hero'
import { Link } from 'react-router-dom'
import Smart from '../../assets/images/smart.jpg'
import Quote from '../common/Quote'

const Projects = () => {
  return (
    <>
    <Header/>
    <main>
        <Hero
          preHeading="Building Today For A Better Tommorow."
          heading="Projects"
          text=" Gaur Municipality is commited to transparent <br/> governance, sustainable development, and  <br/> improving lives through efficient projects  <br/> and community teamwork to build a  <br/> stronger,  smarter         
          prosperous Municipality. "
        />
        <section className="section-7 light-background py-5">
          <div className="container py-5">
            <div className="section-header text-center">
              <span>All projects</span>
              <h2>Building A Better Tomorrow</h2>
              <p>
                We deliver smart municipality management solutions
             for organized, transparent, and efficient city operations.
              </p>
            </div>
            <div className="row pt-4">
              
                    <div  className="col-md-4 col-lg-4">
                      <div className="item">
                        <div className="service-image">
                          <img
                            src={Smart}
                            alt=""
                            className="w-100"
                          />
                        </div>
                        <div className="service-body">
                          <div className="service-title">
                            <h3>Smart Road Development</h3>
                          </div>
                          <div className="service-content">
                            <p>Upgrading city roads with modern infrastructure for smoother and safer connectivity</p>
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

export default Projects