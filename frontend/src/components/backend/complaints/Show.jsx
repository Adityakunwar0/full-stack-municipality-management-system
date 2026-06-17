import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";

const Show = () => {
    const [complaints, setComplaints] = useState([]);

    const fetchComplaints = async () => {
        try {
            const res = await fetch(apiurl + "complaints", {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });

            const result = await res.json();

            if (result.status) {
                setComplaints(result.data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const deleteComplaint = async (id) => {
        if (!window.confirm("Are you sure you want to delete this complaint?")) {
            return;
        }

        try {
            const res = await fetch(apiurl + `complaints/${id}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });

            const result = await res.json();

            if (result.status) {
                // remove from UI without reload
                setComplaints((prev) =>
                    prev.filter((item) => item.id !== id)
                );
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const statusBadge = (status) => {
        const map = {
            Pending: "warning",
            Process: "info",
            Completed: "success",
        };

        return (
            <span className={`badge bg-${map[status] || "secondary"}`}>
                {status}
            </span>
        );
    };

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
                                        <h4 className="h5">Complaints</h4>
                                    </div>
                                    <hr />
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Token</th>
                                                    <th>Name</th>
                                                    <th>Ward</th>
                                                    <th>Subject</th>
                                                    <th>Phone</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {complaints &&
                                                    complaints.map((complaint) => {
                                                        return (
                                                            <tr key={`complaint-${complaint.id}`}>
                                                                <td>{complaint.id}</td>

                                                                <td>
                                                                    <code>{complaint.token_number}</code>
                                                                </td>

                                                                <td>{complaint.full_name}</td>

                                                                <td>Ward {complaint.ward}</td>

                                                                <td>{complaint.subject}</td>

                                                                <td>{complaint.phone}</td>

                                                                <td>{statusBadge(complaint.status)}</td>

                                                                <td>
                                                                    {new Date(
                                                                        complaint.created_at
                                                                    ).toLocaleDateString("en-US", {
                                                                        year: "numeric",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    })}
                                                                </td>

                                                                <td className=" d-flex flex-column flex-md-row gap-2">
                                                                    <Link
                                                                        to={`/admin/complaints/${complaint.id}`}
                                                                        className="btn btn-secondary small"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <Link
                                                                        onClick={() => deleteComplaint(complaint.id)}
                                                                        href="#"
                                                                        className="btn btn-secondary small "
                                                                    >
                                                                        Delete
                                                                    </Link>
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

        </>
    );
};

export default Show;