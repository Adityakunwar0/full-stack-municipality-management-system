import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AuthContext } from "../backend/context/Auth";
import { apiurl, token } from "../common/Http";
import Header from "../common/Header";
import Footer from "../common/Footer";

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState("processing");

    const dashboardLink = user?.role === "admin" ? "/admin/my-payments" : "/user/my-payments";

    useEffect(() => {
        const paymentRequestId = searchParams.get("payment_request_id");
        if (!paymentRequestId) {
            setStatus("done");
            return;
        }

        const endpoint =
            user?.role === "admin"
                ? `admin/payment-requests/${paymentRequestId}/cancel`
                : `user/payment-requests/${paymentRequestId}/cancel`;

        fetch(apiurl + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token()}`,
            },
        })
            .catch((err) => console.error("Failed to mark payment as rejected:", err))
            .finally(() => setStatus("done"));
    }, [searchParams, user]);

    return (
        <>
            <Header />
            <main>
                <div className="container my-5 text-center">
                    <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: "500px" }}>
                        <i className="fas fa-times-circle text-danger mb-3" style={{ fontSize: "3rem" }}></i>
                        <h3>Payment Cancelled</h3>
                        <p className="text-muted">
                            Your payment was not completed. You can try again anytime from your dashboard.
                        </p>
                        <Link to={dashboardLink} className="btn btn-primary mt-3">
                            Back to My Payments
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default PaymentCancel;