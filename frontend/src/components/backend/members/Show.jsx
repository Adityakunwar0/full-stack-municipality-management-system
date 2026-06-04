import React, { useEffect, useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";

const Show = () => {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const res = await fetch(apiurl + "members", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setMembers(result.data);
    // console.log(result);
  };

  const deleteMember = async (id) => {
    if (confirm("Are You Sure You Want to Delete ?")) {
      const res = await fetch(apiurl + "memebers/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();

      if (result.status == true) {
        const newMembers = members.filter((member) => member.id != id);
        setMembers(newMembers);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    //setServices(result.data)
  };
  useEffect(() => {
    fetchMembers();
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
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h4 className="h5">Members</h4>
                    <Link
                      to="/admin/members/create"
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
                          <th>Job Title</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members &&
                          members.map((member) => {
                            return (
                              <tr key={`member-${member.id}`}>
                                <td>{member.id}</td>
                                <td>{member.name}</td>
                                <td>{member.job_title}</td>
                                <td>
                                  {member.status == 1 ? "Active" : "Block"}
                                </td>
                                <td>
                                  <div className="d-flex flex-column flex-md-row gap-2">
                                    <Link
                                      to={`/admin/members/edit/${member.id}`}
                                      className="btn btn-primary small "
                                    >
                                      Edit
                                    </Link>
                                    <Link
                                      onClick={() => deleteMember(member.id)}
                                      href="#"
                                      className="btn btn-secondary small ms-2"
                                    >
                                      Delete
                                    </Link>
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