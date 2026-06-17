import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import Header from "../../common/Header";
import Sidebar from "../../common/Sidebar";
import { toast } from "react-toastify";

const Show = () => {
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {

        try {
            const res = await fetch(apiurl + "admin/payment-requests", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });

            const result = await res.json();

            // allRequests() returns a plain array (no status wrapper)
            if (Array.isArray(result)) {
                const paymentRequests = result.filter(
                    (req) =>
                        req.service?.btn_text?.toLowerCase() === "pay now"
                );

                setRequests(paymentRequests);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const updateStatus = async () => {
        try {
            const res = await fetch(apiurl + "admin/payment-requests/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify({
                    request_status: requestStatus,
                }),
            });

            const result = await res.json();

            if (result.message) {
                toast.success(result.message);

                setTimeout(() => {
                    navigate("/admin/paymentRequests");
                }, 1000);
            }
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };
    const deleteRequest = async (id) => {
        if (confirm("Are You Sure You Want to Delete ?")) {
            const res = await fetch(apiurl + "admin/payment-requests/" + id, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });
            const result = await res.json();

            if (result.status == true) {
                const newRequests = requests.filter((req) => req.id != id);
                setRequests(newRequests);
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const statusBadge = (status) => {
    const map = {
        progress: "warning",
        completed: "success",
        rejected: "danger",
    };

    return (
        <span className={`badge bg-${map[status] || "secondary"}`}>
            {status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "—"}
        </span>
    );
};

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
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="h5 mb-0">Payment Requests</h4>
                                    </div>
                                    <hr />
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>User</th>
                                                    <th>Service</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Method</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests &&
                                                    requests.map((req) => (
                                                        <tr key={`request-${req.id}`}>
                                                            <td>{req.id}</td>

                                                            <td>
                                                                {req.user
                                                                    ? req.user.name
                                                                    : <span className="text-muted">—</span>}
                                                            </td>

                                                            <td>
                                                                {req.service
                                                                    ? req.service.title
                                                                    : <span className="text-muted">—</span>}
                                                            </td>

                                                            <td>
                                                                {req.service?.amount
                                                                    ? `Rs. ${req.service.amount}`
                                                                    : <span className="text-muted">—</span>}
                                                            </td>

                                                            <td>{statusBadge(req.request_status)}</td>

                                                            <td>
                                                                {new Date(req.created_at).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </td>
                                                            <td>
                                                                
                                                                    {req.payment_method || req.method || "COD"}
                                                            </td>

                                                            <td className=" d-flex flex-column flex-md-row gap-2">
                                                                <Link
                                                                    to={`/admin/payment-requests/${req.id}`}
                                                                    className="btn btn-secondary small"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link
                                                                    onClick={() => deleteRequest(req.id)}
                                                                    href="#"
                                                                    className="btn btn-secondary small ms-2"
                                                                >
                                                                    Delete
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
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
