import React from 'react'
import Header from '../common/Header'
import { Link } from 'react-router-dom'
import LatestProjects from '../common/LatestProjects'
import Statistics from '../common/Statistics'
import Footer from '../common/Footer'
import Quote from '../common/Quote'

const Home = () => {
  return (
    <>
      <Header />
      <main>
        {/*Hero Section */}
        <section className="section-1">
          <div className="hero d-flex align-items-center">
            <div className="container">
              <div className="text-center">
                <span>Welcome Gaur Municipality</span>
                <h2>
                  Strong Cities, Better Communities <br /> Brighter Tommorrow
                </h2>
                <h4>
                  we are committed to transparent governance, sustinable development and
                  <br /> improving the quality of life for every citizen.
                </h4>
                <div className="municipality-banner mt-4">
                  <div className="banner-card">

                    <div className="banner-item">
                      <div className="banner-icon">
                        <i className="fa-solid fa-users"></i>
                      </div>

                      <div className="banner-content">
                        <p>
                          Together, let’s build a  municipality smarter,
                          cleaner and stronger for sustainable growth.
                        </p>
                      </div>
                    </div>

                    <div className="banner-item">
                      <div className="banner-icon">
                        <i className="fa-solid fa-city"></i>
                      </div>

                      <div className="banner-content">
                        <p>
                          Efficient municipality management for better services,
                          transparency, and community development.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LatestProjects />

        <Statistics />
        <Quote />

        <Footer />

      </main>

    </>
  )
}

export default Home