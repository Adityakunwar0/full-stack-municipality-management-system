import React, { useContext, useEffect, useState } from "react";
import { apiurl, token } from "../common/Http"
import { AuthContext } from "../backend/context/Auth";
import { Link } from "react-router-dom";

const RequestDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("all");
    const [showAll, setShowAll] = useState(false);

    const VISIBLE_LIMIT = 4;


    const fetchMyRequests = async () => {
        if (!user) return;
        try {
            const endpoint =
                user?.role === "admin" ? "admin/my-requests" : "user/my-requests";
            const res = await fetch(apiurl + endpoint, {
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
    }, [user]);

    // Reset "show all" whenever the tab changes
    useEffect(() => {
        setShowAll(false);
    }, [activeTab]);

    const statusBadge = (status) => {
        const map = {
            progress: "warning",
            review: "warning",
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

    const filteredRequests = requests.filter((req) => {
        if (activeTab === "all") return true;
        return req.request_status === activeTab;
    });

    const visibleRequests = showAll
        ? filteredRequests
        : filteredRequests.slice(0, VISIBLE_LIMIT);

    const hasMore = filteredRequests.length > VISIBLE_LIMIT;
    return (
        <div className="light-background container-fluid  requests-wrapper ">

            {/* Tabs */}
            <div className="container request-tabs card border-0 shadow-sm mb-4">
                <div className="card-body py-2">
                    <ul className="nav">
                        {[
                            { key: "all", label: "All Requests", count: requests.length },
                            { key: "progress", label: "In Progress", count: requests.filter(r => r.request_status === "progress").length },
                            { key: "review", label: "Under Review", count: requests.filter(r => r.request_status === "review").length },
                            { key: "completed", label: "Completed", count: requests.filter(r => r.request_status === "completed").length },
                            { key: "rejected", label: "Cancelled", count: requests.filter(r => r.request_status === "rejected").length },
                        ].map(({ key, label, count }) => (
                            <li className="nav-item" key={key}>
                                <button
                                    className={`nav-link ${activeTab === key ? "active" : ""}`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    {label} ({count})
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="container card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Recent Requests</h4>
                        {hasMore && (
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowAll((prev) => !prev)}
                            >
                                {showAll
                                    ? "Show Less"
                                    : `View All (${filteredRequests.length})`}
                            </button>
                        )}
                    </div>

                    {visibleRequests.length > 0 ? (
                        <>
                            {visibleRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="request-item d-flex justify-content-between align-items-center"
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="request-icon">
                                            <i className={`${req.service?.icon || "fas fa-file-alt"}`}></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-1">{req.service?.title}</h6>
                                            <small className="text-muted">REQ-{req.id}</small>
                                            <small className="text-muted ms-2">
                                                • {new Date(req.created_at).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                    <div>{statusBadge(req.request_status)}</div>
                                </div>
                            ))}

                            {/* Bottom View All / Show Less link */}
                            {hasMore && (
                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-link btn-sm text-decoration-none"
                                        onClick={() => setShowAll((prev) => !prev)}
                                    >
                                        {showAll ? (
                                            <>
                                                <i className="fas fa-chevron-up me-1"></i>
                                                Show Less
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-chevron-down me-1"></i>
                                                View All {filteredRequests.length} Requests
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            No requests found.
                        </div>
                    )}
                </div>
            </div>

            {/* Request Summary */}
            <div className=" card light-background border-0 shadow-sm">
                <div className="container card-body">
                    <h4 className="mb-4">Request Summary</h4>
                    <div className="row g-3">
                        {[
                            { status: "progress", label: "In Progress", icon: "fas fa-file-alt", colorClass: "blue" },
                            { status: "review", label: "Under Review", icon: "fas fa-clock", colorClass: "orange" },
                            { status: "completed", label: "Completed", icon: "fas fa-check-circle", colorClass: "green" },
                            { status: "rejected", label: "Cancelled", icon: "fas fa-times-circle", colorClass: "purple" },
                        ].map(({ status, label, icon, colorClass }) => (
                            <div className="col-md-3" key={status}>
                                <div className="summary-box">
                                    <i className={`${colorClass} ${icon}`}></i>
                                    <h2>
                                        {requests.filter(r => r.request_status === status).length}
                                    </h2>
                                    <p>{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RequestDashboard