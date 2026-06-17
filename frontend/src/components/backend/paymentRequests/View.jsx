import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

const View = () => {
    const { id } = useParams();

    const [paymentRequest, setPaymentRequest] = useState(null);
    const [requestStatus, setRequestStatus] = useState("");
    const navigate = useNavigate();

    const fetchRequest = async () => {
        try {
            const res = await fetch(apiurl + "admin/payment-requests/" + id, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });

            const result = await res.json();
            let request = null;
            if (Array.isArray(result)) {
                request = result.find(
                    (r) =>
                        r.id === parseInt(id) &&
                        r.service?.btn_text?.toLowerCase() === "pay now"
                );
            }
            else if (
                result &&
                result.id &&
                result.service?.btn_text?.toLowerCase() === "pay now"
            ) {
                request = result;
            }


            if (request) {
                setPaymentRequest(request);
                setRequestStatus(request.request_status);

            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, [id]);

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
                payment_method: paymentRequest?.payment_method || "COD" 
            }),
        });

        const result = await res.json();

        if (res.ok) {
            toast.success(result.message || "Status updated successfully!");
            
            
            setTimeout(() => {
                navigate("/admin/paymentRequests"); 
            }, 800);
        } else {
            toast.error(result.message || "Failed to update status.");
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to update status.");
    }
};

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
    if (!paymentRequest) {
        return (
            <>
                <Header />
                <main>
                    <div className="container my-5 text-center text-muted">
                        Loading request details...
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main>
                <div className="container my-4">
                    <div className="d-flex mb-3">
                        <button
                            className="btn btn-primary small"
                            onClick={() => navigate("/admin/paymentRequests")}
                        >
                            Back
                        </button>
                    </div>

                    {/* DETAIL CARD */}
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <strong>Payment Request Details</strong>
                            {statusBadge(paymentRequest.request_status)}
                        </div>

                        <div className="card-body">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th style={{ width: "200px" }}>Request ID</th>
                                        <td><strong>#{paymentRequest.id}</strong></td>
                                    </tr>

                                    <tr>
                                        <th>Applicant</th>
                                        <td>
                                            {paymentRequest.user
                                                ? paymentRequest.user.name
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Email</th>
                                        <td>
                                            {paymentRequest.user?.email
                                                ? paymentRequest.user.email
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Service</th>
                                        <td>
                                            {paymentRequest.service
                                                ? paymentRequest.service.title
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Service Description</th>
                                        <td>
                                            {paymentRequest.service?.description
                                                ? paymentRequest.service.description
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Amount</th>
                                        <td>
                                            {paymentRequest.service?.amount
                                                ? `Rs. ${paymentRequest.service.amount}`
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>



                                    <tr>
                                        <th>Applied On</th>
                                        <td>
                                            {new Date(paymentRequest.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Payment Method</th>
                                        <td>

                                            {paymentRequest.payment_method || paymentRequest.method || "COD"}

                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Current Status</th>
                                        <td>{statusBadge(paymentRequest.request_status)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* STATUS UPDATE CARD */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header">
                            Update Status
                        </div>

                        <div className="card-body">
                            <select
                                className="form-select mb-3"
                                value={requestStatus}
                                onChange={(e) => setRequestStatus(e.target.value)}
                            >
                                <option value="progress">Progress</option>

                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>



                            <button
                                className="btn btn-primary w-100"
                                onClick={updateStatus}
                            >
                                Update Request
                            </button>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
};

export default View;
