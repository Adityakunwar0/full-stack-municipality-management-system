import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

const View = () => {
    const { id } = useParams();

    const [serviceRequest, setServiceRequest] = useState(null);
    const [requestStatus, setRequestStatus] = useState("");
    const [remarks, setRemarks] = useState("");
    const navigate = useNavigate();

    const fetchRequest = async () => {
        try {
            const res = await fetch(apiurl + "admin/service-requests/" + id, {
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
                        r.service?.btn_text?.toLowerCase() === "apply now"
                );
            }
            else if (
                result &&
                result.id &&
                result.service?.btn_text?.toLowerCase() === "apply now"
            ) {
                request = result;
            }


            if (request) {
                setServiceRequest(request);
                setRequestStatus(request.request_status);
                setRemarks(request.remarks || "");
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
            const res = await fetch(apiurl + "admin/request/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify({
                    request_status: requestStatus,
                    remarks: remarks
                }),
            });

            const result = await res.json();

            if (result.message) {
                toast.success(result.message);
                setServiceRequest((prev) => ({ ...prev, request_status: requestStatus, remarks: remarks }));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status.");
        }
    };

    const statusBadge = (status) => {
        const map = {
            progress: "warning",
            review: "warning",
            completed: "success",
            rejected: "danger",
        };

        return (
            <span className={`badge bg-${map[status] || "secondary"}`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
            </span>
        );
    };

    if (!serviceRequest) {
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
                            onClick={() => navigate("/admin/serviceRequests")}
                        >
                            Back
                        </button>
                    </div>

                    {/* DETAIL CARD */}
                    <div className="card border-0 shadow-sm mb-3">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <strong>Service Request Details</strong>
                            {statusBadge(serviceRequest.request_status)}
                        </div>

                        <div className="card-body">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th style={{ width: "200px" }}>Request ID</th>
                                        <td><strong>#{serviceRequest.id}</strong></td>
                                    </tr>

                                    <tr>
                                        <th>Applicant</th>
                                        <td>
                                            {serviceRequest.user
                                                ? serviceRequest.user.name
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Email</th>
                                        <td>
                                            {serviceRequest.user?.email
                                                ? serviceRequest.user.email
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Service</th>
                                        <td>
                                            {serviceRequest.service
                                                ? serviceRequest.service.title
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Service Description</th>
                                        <td>
                                            {serviceRequest.service?.description
                                                ? serviceRequest.service.description
                                                : <span className="text-muted">—</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Remarks</th>
                                        <td>
                                            {serviceRequest.remarks
                                                ? serviceRequest.remarks
                                                : <span className="text-muted">No remarks provided</span>}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Applied On</th>
                                        <td>
                                            {new Date(serviceRequest.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Current Status</th>
                                        <td>{statusBadge(serviceRequest.request_status)}</td>
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
                                <option value="review">Under Review</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <div className="mb-3">
                                <label className="form-label">
                                    Admin Remarks
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>

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
