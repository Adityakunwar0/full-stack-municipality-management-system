import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AuthContext } from "../backend/context/Auth";
import { apiurl, token } from "../common/Http";
import Header from "../common/Header";
import Footer from "../common/Footer";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState("checking"); // checking | confirmed | unknown

    const sessionId = searchParams.get("session_id");
    const paymentRequestId = searchParams.get("payment_request_id");

    const dashboardLink = user?.role === "admin" ? "/admin/my-payments" : "/user/my-payments";

    useEffect(() => {
        if (!sessionId || !paymentRequestId) {
            setStatus("unknown");
            return;
        }

        const endpoint =
            user?.role === "admin"
                ? `admin/payment-requests/${paymentRequestId}/confirm`
                : `user/payment-requests/${paymentRequestId}/confirm`;

        fetch(apiurl + endpoint + `?session_id=${sessionId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token()}`,
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setStatus(result?.data?.request_status === "completed" ? "confirmed" : "unknown");
            })
            .catch((err) => {
                console.error("Failed to confirm payment:", err);
                setStatus("unknown");
            });
    }, [sessionId, paymentRequestId, user]);

    return (
        <>
            <Header />
            <main>
                <div className="container my-5 text-center">
                    <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: "500px" }}>
                        <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: "3rem" }}></i>
                        <h3>Payment Successful</h3>

                        {status === "checking" && (
                            <p className="text-muted">Confirming your payment...</p>
                        )}
                        {status === "confirmed" && (
                            <p className="text-muted">
                                Your payment has been confirmed and your request is now marked as completed.
                            </p>
                        )}
                        {status === "unknown" && (
                            <p className="text-muted">
                                Your payment was received. It may take a moment for the status to update
                                on your dashboard.
                            </p>
                        )}

                        {sessionId && (
                            <p className="text-muted small">Reference: {sessionId}</p>
                        )}

                        <Link to={dashboardLink} className="btn btn-primary mt-3">
                            View My Payments
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default PaymentSuccess;