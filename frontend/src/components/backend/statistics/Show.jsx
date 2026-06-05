import React, { useEffect, useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";

const Show = () => {
  const [statistics, setStatistics] = useState([]);

  const fetchStatistics = async () => {
    const res = await fetch(apiurl + "statistics", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setStatistics(result.data);
    // console.log(result);
  };

  const deleteStatistic = async (id) => {
    if (confirm("Are You Sure You Want to Delete ?")) {
      const res = await fetch(apiurl + "statistics/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();

      if (result.status == true) {
        const newStatistics = statistics.filter((statistic) => statistic.id != id);
        setStatistics(newStatistics);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    //setServices(result.data)
  };
  useEffect(() => {
    fetchStatistics();
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
                    <h4 className="h5">Statistics</h4>
                    <Link
                      to="/admin/statistics/create"
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
                          <th>Icon_Name</th>
                          <th>Number</th>
                          <th>Title</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistics &&
                          statistics.map((statistic) => {
                            return (
                              <tr key={`statistic-${statistic.id}`}>
                                <td>{statistic.id}</td>
                                <td>{statistic.icon_name}</td>
                                <td>{statistic.number}</td>
                                <td>
                                  {statistic.title}
                                </td>
                                <td>
                                  <div className="d-flex flex-column flex-md-row gap-2">
                                    <Link
                                      to={`/admin/statistics/edit/${statistic.id}`}
                                      className="btn btn-primary small "
                                    >
                                      Edit
                                    </Link>
                                    <Link
                                      onClick={() => deleteStatistic(statistic.id)}
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