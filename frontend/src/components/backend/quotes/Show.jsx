import React, { useEffect, useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";

const Show = () => {
  const [quotes, setQuotes] = useState([]);

  const fetchQuotes = async () => {
    const res = await fetch(apiurl + "quotes", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });
    const result = await res.json();
    setQuotes(result.data);
    // console.log(result);
  };

  const deleteQuotes = async (id) => {
    if (confirm("Are You Sure You Want to Delete ?")) {
      const res = await fetch(apiurl + "quotes/" + id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();

      if (result.status == true) {
        const newQuotes = quotes.filter((quote) => quote.id != id);
        setQuotes(newQuotes);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    //setServices(result.data)
  };
  useEffect(() => {
    fetchQuotes();
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
                    <h4 className="h5">Quotes</h4>
                    <Link
                      to="/admin/quotes/create"
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
                          <th>Quote</th>
                          <th>Name</th>
                          <th>Designation_title</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes &&
                          quotes.map((quote) => {
                            return (
                              <tr key={`quote-${quote.id}`}>
                                <td>{quote.id}</td>
                                <td>{quote.quote}</td>
                                <td>{quote.name}</td>
                                <td>
                                  {quote.designation_title}
                                </td>
                                <td>
                                  <div className="d-flex flex-column flex-md-row gap-2">
                                    <Link
                                      to={`/admin/quotes/edit/${quote.id}`}
                                      className="btn btn-primary small "
                                    >
                                      Edit
                                    </Link>
                                    <Link
                                      onClick={() => deleteQuotes(quote.id)}
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