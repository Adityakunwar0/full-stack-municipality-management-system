import React, { useEffect, useState } from "react";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import Footer from "../../common/Footer";
import { apiurl, token } from "../../common/Http";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Show = () => {
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    const res = await fetch(apiurl + "notices", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setNotices(result.data);
    //console.log(result);
  };

  const deleteNotice = async (id) => {
    if (confirm("Are You Sure You Want to Delete ?")) {
      const res = await fetch(apiurl + "notices/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();

      if (result.status == true) {
        const newNotices = notices.filter((notice) => notice.id != id);
        setNotices(newNotices);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    //setServices(result.data)
  };
  useEffect(() => {
    fetchNotices();
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
                    <h4 className="h5">Notices</h4>
                    <Link
                      to="/admin/notices/create"
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
                      {notices &&
                        notices.map((notice) => {
                          return (
                            <tr key={`notices-${notice.id}`}>
                              <td>{notice.id}</td>
                              <td>{notice.title}</td>
                              <td>{notice.slug}</td>
                              <td>
                                {notice.status == 1 ? "Active" : "Block"}
                              </td>
                              <td>
                                <div className="d-flex flex-column flex-md-row gap-2">
                                   <div className="d-flex flex-column flex-md-row gap-2">
                                  <Link
                                  to={`/admin/notices/edit/${notice.id}`}
                                  className="btn btn-secondary small "
                                >
                                  Edit
                                </Link>
                                <Link
                                  onClick={() => deletenotice(notice.id)}
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