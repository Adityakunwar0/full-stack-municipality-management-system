import React, { useContext, useEffect, useState } from "react";
import { apiurl, token } from "../common/Http";
import { AuthContext } from "../backend/context/Auth";
import { toast } from "react-toastify";

const PaymentDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("all");
    const [showAll, setShowAll] = useState(false);

    const VISIBLE_LIMIT = 4;

    const fetchPayments = async () => {
        if (!user) return;

        try {
            const endpoint =
                user?.role === "admin"
                    ? "admin/my-payments"
                    : "user/my-payments";

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
                setPayments(result);
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [user]);

    useEffect(() => {
        setShowAll(false);
    }, [activeTab]);

    const handleMethodChange = async (paymentId, newMethod) => {
        const targetPayment = payments.find((p) => p.id === paymentId);
        const currentStatus = targetPayment
            ? targetPayment.request_status || "progress"
            : "progress";

        // FIX: Dynamically handle route based on user role
        const endpoint =
            user?.role === "admin"
                ? `admin/payment-requests/${paymentId}`
                : `user/payment-requests/${paymentId}`; // Adjust this if your user endpoint is named differently

        try {
            // Optimistic UI update
            setPayments((prevPayments) =>
                prevPayments.map((pay) =>
                    pay.id === paymentId ? { ...pay, payment_method: newMethod } : pay
                )
            );

            const res = await fetch(apiurl + endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify({
                    payment_method: newMethod,
                    request_status: currentStatus,
                }),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Payment method updated successfully!");
            } else {
                toast.error(result.message || "Failed to sync payment method.");
                fetchPayments(); // Rollback on error
            }
        } catch (error) {
            console.error("Error updating payment method:", error);
            toast.error("Something went wrong changing the payment gateway.");
            fetchPayments(); // Rollback on error
        }
    };

    const statusBadge = (status) => {
        const map = {
            progress: "warning",
            completed: "success",
            rejected: "danger",
        };

        const text = String(status || "progress").toLowerCase();

        return (
            <span className={`badge bg-${map[text] || "secondary"}`}>
                {text.charAt(0).toUpperCase() + text.slice(1)}
            </span>
        );
    };

    const handlePayNow = (payment) => {
        console.log("Paying for:", payment.id);
        window.location.href = `/pay/${payment.id}`;
    };

    const filteredPayments = payments.filter((pay) => {
        if (activeTab === "all") return true;
        const currentStatus = String(pay.request_status || "progress").toLowerCase();
        return currentStatus === activeTab;
    });

    const visiblePayments = showAll
        ? filteredPayments
        : filteredPayments.slice(0, VISIBLE_LIMIT);

    const hasMore = filteredPayments.length > VISIBLE_LIMIT;

    const getCountByStatus = (status) => {
        return payments.filter((p) => {
            const currentStatus = String(p.request_status || "progress").toLowerCase();
            return currentStatus === status;
        }).length;
    };

    if (loading) {
        return <div className="text-center py-5 text-muted">Loading payment dashboard...</div>;
    }

    return (
        <div className="light-background container-fluid requests-wrapper px-0">
            <div className="container request-tabs card border-0 shadow-sm mb-4">
                <div className="card-body py-2">
                    <ul className="nav">
                        {[
                            { key: "all", label: "All Payments", count: payments.length },
                            { key: "progress", label: "In Progress", count: getCountByStatus("progress") },
                            { key: "completed", label: "Completed", count: getCountByStatus("completed") },
                            { key: "rejected", label: "Rejected", count: getCountByStatus("rejected") },
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

            <div className="container card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Recent Payments</h4>
                        {hasMore && (
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowAll((prev) => !prev)}
                            >
                                {showAll ? "Show Less" : `View All (${filteredPayments.length})`}
                            </button>
                        )}
                    </div>

                    {visiblePayments.length > 0 ? (
                        <>
                            {visiblePayments.map((pay) => {
                                const currentMethod = String(pay.payment_method || "cod").toLowerCase();
                                const currentStatus = String(pay.request_status || "progress").toLowerCase();

                                const isCompleted = currentStatus === "completed";
                                const isRejected = currentStatus === "rejected";
                                const isDisabled = isCompleted || isRejected;

                                return (
                                    <div
                                        key={pay.id}
                                        className={`request-item d-flex justify-content-between align-items-center ${
                                            isRejected ? "table-light text-muted" : ""
                                        }`}
                                    >
                                        <div className="d-flex align-items-center w-75">
                                            <div className="request-icon">
                                                <i className={`${pay.service?.icon || "fas fa-credit-card"}`}></i>
                                            </div>
                                            <div className="w-100 me-3">
                                                <h6 className="mb-1">{pay.service?.title || "Payment Request"}</h6>
                                                
                                                <small className="text-muted">ID-{pay.id}</small>
                                                <small className="text-muted ms-2">
                                                    • Rs. {pay.service?.amount ?? pay.amount ?? "0"}
                                                </small>
                                                <small className="text-muted ms-2">
                                                    • {new Date(pay.created_at).toLocaleDateString()}
                                                </small>

                                                <div className="row g-2 align-items-center mt-2">
                                                    <div className="col-auto">
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={currentMethod}
                                                            disabled={isDisabled}
                                                            onChange={(e) => handleMethodChange(pay.id, e.target.value)}
                                                        >
                                                            <option value="cod">COD</option>
                                                            <option value="stripe">Stripe</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-auto">
                                                        {isCompleted ? (
                                                            <span className="text-success small fw-bold">Paid</span>
                                                        ) : isRejected ? (
                                                            <span className="text-danger small fw-bold">Rejected</span>
                                                        ) : currentMethod === "cod" ? (
                                                            <span className="text-muted small italic">Awaiting Admin Update</span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handlePayNow(pay)}
                                                                className="btn btn-primary btn-sm py-0"
                                                            >
                                                                Pay via Stripe
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>{statusBadge(currentStatus)}</div>
                                    </div>
                                );
                            })}

                            {hasMore && (
                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-link btn-sm text-decoration-none"
                                        onClick={() => setShowAll((prev) => !prev)}
                                    >
                                        {showAll ? (
                                            <><i className="fas fa-chevron-up me-1"></i>Show Less</>
                                        ) : (
                                            <><i className="fas fa-chevron-down me-1"></i>View All {filteredPayments.length} Payments</>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 text-muted">No records found.</div>
                    )}
                </div>
            </div>

            <div className="card light-background border-0 shadow-sm">
                <div className="container card-body">
                    <h4 className="mb-4">Payment Summary</h4>
                    <div className="row g-3">
                        {[
                            { status: "progress", label: "In Progress", icon: "fas fa-clock", colorClass: "blue" },
                            { status: "completed", label: "Completed", icon: "fas fa-check-circle", colorClass: "green" },
                            { status: "rejected", label: "Rejected", icon: "fas fa-times-circle", colorClass: "purple" },
                        ].map(({ status, label, icon, colorClass }) => (
                            <div className="col-md-4" key={status}>
                                <div className="summary-box">
                                    <i className={`${colorClass} ${icon}`}></i>
                                    <h2>{getCountByStatus(status)}</h2>
                                    <p>{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDashboard;