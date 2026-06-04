import React, { useEffect, useState } from "react"
import Header from '../common/Header'
import Footer from '../common/Footer'
import Hero from '../common/Hero'
import { Link } from 'react-router-dom'
import Quote from '../common/Quote'
import { apiurl, fileUrl } from "../common/Http";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  const fetchAllProjects = async () => {
    const res = await fetch(apiurl + "get-projects", {
      method: "GET",
    });
    const result = await res.json();
    // console.log(result);
    setProjects(result.data);
  };
  useEffect(() => {
    fetchAllProjects();
  }, []);

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
              {projects &&
                projects.map((project) => {
                  return (
                    <div key={project.id} className="col-md-4 col-lg-4">
                      <div className="item">
                        <div className="service-image">
                          <img
                            src={`${fileUrl}uploads/projects/small/${project.image}`}
                            alt=""
                            className="w-100"
                          />
                        </div>
                        <div className="service-body">
                          <div className="service-title">
                            <h3>{project.title}</h3>
                          </div>
                          <div className="service-content">
                            <p>{project.short_desc}</p>
                          </div>
                          <Link
                            to={`/project/${project.id}`}
                            className="btn btn-primary small"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
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