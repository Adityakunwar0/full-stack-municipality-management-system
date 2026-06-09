import React, { useEffect, useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Hero from "../../common/Hero";
import { apiurl, token } from "../../common/Http";

const Request = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyRequests = async () => {
        try {
            const res = await fetch(apiurl + "admin/my-requests", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });
            const result = await res.json();
            if (Array.isArray(result)) {
                setRequests(result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const statusBadge = (status) => {
        const map = {
            progress: "warning",
            completed: "success",
            rejected: "danger",
        };
        return (
            <span className={`badge bg-${map[status] || "secondary"}`}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
            </span>
        );
    };

    return (
        <>
            <Header />
            <main>
                <Hero
                    preHeading="Track Your Submissions"
                    heading="My Requests"
                    text="View the status of all your submitted service applications."
                />

                <section className="py-5 light-background">
                    <div className="container">
                        <div className="section-header text-center mb-4">
                            <span>Applications</span>
                            <h2>My Service Requests</h2>
                        </div>

                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center text-muted py-5">
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Loading your requests...
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped align-middle">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Service</th>
                                                    <th>Remarks</th>
                                                    <th>Status</th>
                                                    <th>Applied On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {requests.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="text-center text-muted py-5">
                                                            <i className="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
                                                            You have not applied for any services yet.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    requests.map((req, index) => (
                                                        <tr key={`req-${req.id}`}>
                                                            <td>{index + 1}</td>

                                                            <td>
                                                                {req.service ? (
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <i className={`${req.service.icon} text-primary`}></i>
                                                                        <span>{req.service.title}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted">—</span>
                                                                )}
                                                            </td>

                                                            <td>
                                                                {req.remarks
                                                                    ? req.remarks.length > 50
                                                                        ? req.remarks.substring(0, 50) + "…"
                                                                        : req.remarks
                                                                    : <span className="text-muted">No remarks</span>}
                                                            </td>

                                                            <td>{statusBadge(req.request_status)}</td>

                                                            <td>
                                                                {new Date(req.created_at).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Request;
