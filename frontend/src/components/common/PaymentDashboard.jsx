import React, { useContext, useEffect, useState } from "react";
import { apiurl, token } from "../common/Http";
import { AuthContext } from "../backend/context/Auth";

const PaymentDashboard = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

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

    // ✅ FIXED: Added missing handler function to manage selection change state updates 
    const handleMethodChange = (paymentId, newMethod) => {
        setPayments((prevPayments) =>
            prevPayments.map((pay) =>
                pay.id === paymentId ? { ...pay, payment_method: newMethod } : pay
            )
        );
    };

    const statusBadge = (status) => {
        const map = {
            progress: "warning",
            completed: "success",
            failed: "danger",
        };

        const text = String(status || "pending");

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

    if (loading) {
        return (
            <div className="text-center py-5 text-muted">
                Loading payment dashboard...
            </div>
        );
    }

    return (
        <div className="container my-4">
            <div className="card shadow border-0">
                <div className="card-body">
                    <h4 className="mb-4">Payment Dashboard</h4>

                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                {/* ✅ FIXED: Balanced column count headers to match body rows (7 items) */}
                                <tr>
                                    <th>ID</th>
                                    <th>Service</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((pay) => {
                                        const currentMethod = (pay.payment_method || "cod").toLowerCase();
                                        const isCompleted = pay.status === "completed";

                                        return (
                                            <tr key={pay.id}>
                                                <td>{pay.id}</td>

                                                <td>{pay.service?.title || "—"}</td>

                                                <td>
                                                    Rs. {pay.service?.amount ?? pay.amount ?? "0"}
                                                </td>

                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={currentMethod}
                                                        disabled={isCompleted}
                                                        onChange={(e) =>
                                                            handleMethodChange(pay.id, e.target.value)
                                                        }
                                                    >
                                                        <option value="cod">COD</option>
                                                        <option value="stripe">Stripe</option>
                                                    </select>
                                                </td>

                                                <td>
                                                    {new Date(pay.created_at).toLocaleDateString()}
                                                </td>

                                                <td>
                                                    {isCompleted ? (
                                                        <span className="text-success small fw-bold">Paid</span>
                                                    ) : currentMethod === "cod" ? (
                                                        <span className="text-muted small italic">
                                                            Awaiting Admin Update
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handlePayNow(pay)}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Pay via Stripe
                                                        </button>
                                                    )}
                                                </td>

                                                <td>{statusBadge(pay.status)}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        {/* ✅ FIXED: Adjusted colSpan dynamically to match layout columns */}
                                        <td colSpan="7" className="text-center text-muted py-4">
                                            No payments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDashboard;