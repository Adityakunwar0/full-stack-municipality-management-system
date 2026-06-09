import React, { useEffect, useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";

const Show = () => {
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        const res = await fetch(apiurl + "services", {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token()}`,
            },
        });
        const result = await res.json();
        if (result.status) {
            setServices(result.data);
        }
    };

    const deleteService = async (id) => {
        if (confirm("Are You Sure You Want to Delete?")) {
            const res = await fetch(apiurl + "services/" + id, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });
            const result = await res.json();

            if (result.status == true) {
                setServices(services.filter((s) => s.id != id));
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <>
            <Header />
            <main>
                <div className="container my-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">
                            <div className="card shadow border-0">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="h5">Services</h4>
                                        <Link to="/admin/services/create" className="btn btn-primary">
                                            Create
                                        </Link>
                                    </div>
                                    <hr />
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Icon</th>
                                                    <th>Title</th>
                                                    <th>Description</th>
                                                    <th>Btn Text</th>
                                                    <th>Color</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {services && services.map((service) => (
                                                    <tr key={`service-${service.id}`}>
                                                        <td>{service.id}</td>
                                                        <td>

                                                            <small >{service.icon}</small>
                                                        </td>
                                                        <td>{service.title}</td>
                                                        <td>
                                                            {service.description?.length > 50
                                                                ? service.description.substring(0, 50) + "…"
                                                                : service.description}
                                                        </td>
                                                        <td>{service.btn_text}</td>
                                                        <td>
                                                            {service.color}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex flex-column flex-md-row gap-2">
                                                                <Link
                                                                    to={`/admin/services/edit/${service.id}`}
                                                                    className="btn btn-primary small"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => deleteService(service.id)}
                                                                    className="btn btn-secondary small"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
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
