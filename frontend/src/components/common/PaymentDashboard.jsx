// PaymentDashboard.jsx
// Drop-in replacement for your existing PaymentDashboard component.
// Fetches from the new dedicated /user/my-payments endpoint.
// Status: progress | completed | failed only.

import React, { useContext, useEffect, useState } from 'react';
import { apiurl, token } from "../common/Http";
import { AuthContext } from "../backend/context/Auth";
import PaymentModal from "./PaymentModal"; // Stripe checkout modal

const PaymentDashboard = () => {
    const { user } = useContext(AuthContext);

    const [payments, setPayments]       = useState([]);
    const [summary, setSummary]         = useState({ total: 0, progress: 0, completed: 0, failed: 0 });
    const [loading, setLoading]         = useState(true);
    const [activeTab, setActiveTab]     = useState("all");
    const [showAll, setShowAll]         = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null); // for retry modal

    const VISIBLE_LIMIT = 4;

    // ── Fetch my payments from dedicated endpoint ─────────────
    const fetchMyPayments = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiurl}user/my-payments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
            });
            const result = await res.json();
            if (result.status) {
                setPayments(result.data);
                setSummary(result.summary);
            }
        } catch (err) {
            console.error("Error fetching payments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyPayments(); }, [user]);
    useEffect(() => { setShowAll(false); }, [activeTab]);

    // ── Status badge: only 3 variants ────────────────────────
    const statusBadge = (status) => {
        const config = {
            progress:  { color: "warning",  label: "In Progress" },
            completed: { color: "success",  label: "Completed"   },
            failed:    { color: "danger",   label: "Failed"      },
        };
        const { color, label } = config[status] || { color: "secondary", label: status };
        return <span className={`badge bg-${color}`}>{label}</span>;
    };

    // ── Filter by tab ─────────────────────────────────────────
    const filtered = payments.filter(p =>
        activeTab === "all" ? true : p.payment_status === activeTab
    );
    const visible  = showAll ? filtered : filtered.slice(0, VISIBLE_LIMIT);
    const hasMore  = filtered.length > VISIBLE_LIMIT;

    const tabs = [
        { key: "all",       label: "All",         count: summary.total     },
        { key: "progress",  label: "In Progress", count: summary.progress  },
        { key: "completed", label: "Completed",   count: summary.completed },
        { key: "failed",    label: "Failed",       count: summary.failed   },
    ];

    if (loading) return (
        <div className="text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm me-2" />
            Loading payments…
        </div>
    );

    return (
        <div className="light-background container-fluid requests-wrapper px-0">

            {/* ── Filter Tabs ─────────────────────────────── */}
            <div className="container request-tabs card border-0 shadow-sm mb-4">
                <div className="card-body py-2">
                    <ul className="nav">
                        {tabs.map(({ key, label, count }) => (
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

            {/* ── Recent Transactions ─────────────────────── */}
            <div className="container card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Recent Transactions</h4>
                        {hasMore && (
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowAll(p => !p)}
                            >
                                {showAll ? "Show Less" : `View All (${filtered.length})`}
                            </button>
                        )}
                    </div>

                    {visible.length > 0 ? (
                        <>
                            {visible.map(pay => (
                                <div
                                    key={pay.id}
                                    className="request-item d-flex justify-content-between align-items-center"
                                >
                                    {/* Left: icon + info */}
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="request-icon">
                                            <i className={pay.service?.icon || "fas fa-credit-card"} />
                                        </div>
                                        <div>
                                            <h6 className="mb-0">{pay.service?.title}</h6>
                                            <small className="text-muted">
                                                TXN-{pay.id}
                                                {pay.reference_number && ` · Ref: ${pay.reference_number}`}
                                            </small>
                                            <br />
                                            <small className="text-muted">
                                                {new Date(pay.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "short", day: "numeric"
                                                })}
                                                {pay.total_formatted && (
                                                    <span className="ms-2 fw-semibold text-dark">
                                                        {pay.total_formatted}
                                                    </span>
                                                )}
                                            </small>
                                        </div>
                                    </div>

                                    {/* Right: badge + retry */}
                                    <div className="d-flex align-items-center gap-2">
                                        {statusBadge(pay.payment_status)}
                                        {pay.payment_status === "failed" && (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setSelectedPayment(pay)}
                                                title="Retry Payment"
                                            >
                                                <i className="fas fa-redo-alt me-1" />
                                                Retry
                                            </button>
                                        )}
                                        {pay.payment_status === "completed" && pay.paid_at && (
                                            <small className="text-success">
                                                <i className="fas fa-check-circle me-1" />
                                                {new Date(pay.paid_at).toLocaleDateString()}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {hasMore && (
                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-link btn-sm text-decoration-none"
                                        onClick={() => setShowAll(p => !p)}
                                    >
                                        {showAll
                                            ? <><i className="fas fa-chevron-up me-1" />Show Less</>
                                            : <><i className="fas fa-chevron-down me-1" />View All {filtered.length} Transactions</>
                                        }
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>

            {/* ── Summary Cards ───────────────────────────── */}
            <div className="card light-background border-0 shadow-sm">
                <div className="container card-body">
                    <h4 className="mb-4">Payment Summary</h4>
                    <div className="row g-3">
                        {[
                            { status: "progress",  label: "In Progress", icon: "fas fa-spinner",      colorClass: "blue"   },
                            { status: "completed", label: "Completed",   icon: "fas fa-check-circle", colorClass: "green"  },
                            { status: "failed",    label: "Failed",       icon: "fas fa-times-circle", colorClass: "purple" },
                        ].map(({ status, label, icon, colorClass }) => (
                            <div className="col-md-4" key={status}>
                                <div
                                    className="summary-box"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setActiveTab(status)}
                                >
                                    <i className={`${colorClass} ${icon}`} />
                                    <h2>{summary[status]}</h2>
                                    <p>{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stripe Checkout Modal (for retry / new pay) ─ */}
            {selectedPayment && (
                <PaymentModal
                    payment={selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                    onSuccess={() => {
                        setSelectedPayment(null);
                        fetchMyPayments(); // refresh list automatically
                    }}
                />
            )}
        </div>
    );
};

export default PaymentDashboard;