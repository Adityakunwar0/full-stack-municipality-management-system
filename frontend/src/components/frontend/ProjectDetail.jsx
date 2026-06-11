import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Hero from "../common/Hero";
import { apiurl, fileUrl } from "../common/Http";
import { Link, useParams } from "react-router-dom";
import Quote from "../common/Quote";

const ProjectDetail = () => {
  const params = useParams();
  const [project, setProject] = useState([]);

  const fetchProject = async () => {
    const res = await fetch(`${apiurl}get-project/${params.id}`, {
      method: "GET",
    });
    const result = await res.json();
    setProject(result.data);
    // console.log(result);
  };
  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero
          preHeading="Building Today For A Better Tommorow."
          heading={`${project.title}`}
          text=" Gaur Municipality is commited to transparent <br/> governance, sustainable development, and  <br/> improving lives through efficient projects  <br/> and community teamwork to build a  <br/> stronger,  smarter         
          prosperous Municipality. "
        />
        <section className="section-10">
          <div className="container py-5">
            <div className="row">
              <div className="col-md-4">
                <div className="card shadow border-0 sidebar">
                  <div className="card-body card-body px-4 py-4">
                    <h3 className="mt-2 mb-3">Insights </h3>
                    <ul>
                      {project.location && (
                        <li className="mb-2">
                          <span className="text-body-secondary">Location</span>
                          <p>{project.location}</p>
                        </li>
                      )}
                      {project.project_type && (
                        <li className="mb-2">
                          <span className="text-body-secondary">
                            Project Type
                          </span>
                          <p>{project.project_type}</p>
                        </li>
                      )}
                      {project.sector && (
                        <li className="mb-2">
                          <span className="text-body-secondary">Sector</span>
                          <p>{project.sector}</p>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div>
                  <img
                    className="w-100"
                    src={`${fileUrl}uploads/projects/large/${project.image}`}
                    alt=""
                  />
                </div>
                <h3 className="py-3">{project.title}</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: project.content }}
                ></div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-11 bg-light py-5">
          <Quote />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetail;