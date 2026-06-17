import React, { useEffect, useState, useContext } from "react";
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../common/Hero';
import Portal from '../common/Portal';
import { Link } from 'react-router-dom';
import Quote from '../common/Quote';
import { apiurl, fileUrl } from "../common/Http";
import { AuthContext } from "../backend/context/Auth";

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  const fetchAllProjects = async () => {
    try {
      const res = await fetch(apiurl + "get-projects", {
        method: "GET",
      });
      const result = await res.json();
      setProjects(result.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <>
      <Header />
      <main>
        {user ? (
          <Portal
            heading="Development Projects"
            text="Explore active public works, infrastructure upgrades, and local community initiatives managed across Gaur Municipality."
          />
        ) : (
          <Hero
            preHeading="Building Today For A Better Tomorrow."
            heading="Projects"
            text="Gaur Municipality is committed to transparent governance, sustainable development, and improving lives through efficient projects and community teamwork to build a stronger, smarter, and prosperous Municipality."
          />
        )}

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
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="col-md-4 col-lg-4 mb-4">
                    <div className="item">
                      <div className="service-image">
                        <img
                          src={`${fileUrl}uploads/projects/small/${project.image}`}
                          alt={project.title}
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
                ))
              ) : (
                <div className="text-center w-100 py-4">
                  <p>No projects listed at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <Quote />
      </main>
      <Footer />
    </>
  );
};

export default Projects;