import React from 'react'
import { Link } from 'react-router-dom'
import Smart from '../../assets/images/smart.jpg'

const LatestProjects = () => {
  return (
     <section className="section-2 py-3">
      <div className="container-fluid py-5">
        <div className="section-header text-center">
          <span>Latest projects</span>
          <h2>Building A Better Tomorrow</h2>
          <p>
            We deliver smart municipality management solutions
             for organized, transparent, and efficient city operations.
          </p>
        </div>
        <div className="row pt-4">
    
                <div  className="col-md-3 col-lg-3">
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
                        to=""
                        className="btn btn-primary small"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
        </div>
      </div>
      <div className="text-center">
        <Link to="/projects" className="btn btn-primary large">
          View All Projects
        </Link>
      </div>
    </section>
  )
}

export default LatestProjects