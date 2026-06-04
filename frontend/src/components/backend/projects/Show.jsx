import React, { useEffect, useState } from "react";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import Footer from "../../common/Footer";
import { apiurl, token } from "../../common/Http";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Show = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await fetch(apiurl + "projects", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setProjects(result.data);
    //console.log(result);
  };

  const deleteProject = async (id) => {
    if (confirm("Are You Sure You Want to Delete ?")) {
      const res = await fetch(apiurl + "projects/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();

      if (result.status == true) {
        const newProjects = projects.filter((project) => project.id != id);
        setProjects(newProjects);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    //setServices(result.data)
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Header />
      <main>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3 ">
              <Sidebar />
              {/* sidebar */}
            </div>
            <div className="col-md-9">
              {/* Dashboard */}
              <div className="card shadow border-0">
                <div className="light-background card-body">
                  <div className="d-flex justify-content-between">
                    <h4 className="h5">Projects</h4>
                    <Link
                      to="/admin/projects/create"
                      className="btn btn-primary"
                    >
                      Create
                    </Link>
                  </div>
                  <hr />
                  <div className="table-responsive">
                     <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects &&
                        projects.map((project) => {
                          return (
                            <tr key={`projects-${project.id}`}>
                              <td>{project.id}</td>
                              <td>{project.title}</td>
                              <td>{project.slug}</td>
                              <td>
                                {project.status == 1 ? "Active" : "Block"}
                              </td>
                              <td>
                                <div className="d-flex flex-column flex-md-row gap-2">
                                   <div className="d-flex flex-column flex-md-row gap-2">
                                  <Link
                                  to={`/admin/projects/edit/${project.id}`}
                                  className="btn btn-secondary small "
                                >
                                  Edit
                                </Link>
                                <Link
                                  onClick={() => deleteProject(project.id)}
                                  href="#"
                                  className="btn btn-secondary small ms-2"
                                >
                                  Delete
                                </Link>

                                </div>
                               

                                </div>
                                
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Show;