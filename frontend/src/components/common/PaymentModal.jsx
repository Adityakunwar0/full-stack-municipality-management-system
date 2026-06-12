// PaymentModal.jsx
// Shown when user clicks "Pay Now" on a service card OR "Retry" on a failed payment.
// Collects card details via Stripe Elements, calls Laravel, auto-refreshes dashboard.

import React, { useState } from "react";
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiurl, token } from "../common/Http";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Stripe element style ──────────────────────────────────────
const ELEMENT_STYLE = {
    style: {
        base: {
            fontSize: "14px",
            fontFamily: "inherit",
            color: "#212529",
            "::placeholder": { color: "#adb5bd" },
        },
        invalid: { color: "#dc3545" },
    },
};

// ── Inner form (must live inside <Elements>) ──────────────────
const CheckoutForm = ({ serviceId, serviceRequestId, onSuccess, onClose }) => {
    const stripe   = useStripe();
    const elements = useElements();

    const [form, setForm] = useState({ name: "", email: "", phone: "", reference: "" });
    const [errors, setErrors]       = useState({});
    const [processing, setProcessing] = useState(false);
    const [payError, setPayError]   = useState(null);
    const [focus, setFocus]         = useState(null);

    const change = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        setErrors(er => ({ ...er, [field]: null }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())  e.name  = "Name is required";
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
        return e;
    };

    const handlePay = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        if (!stripe || !elements) return;

        setProcessing(true);
        setPayError(null);

        try {
            // Step 1: create PaymentIntent on Laravel
            const intentRes = await fetch(`${apiurl}user/my-payments/create-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify({
                    service_id:         serviceId,
                    service_request_id: serviceRequestId ?? null,
                    customer_name:      form.name,
                    customer_email:     form.email,
                    customer_phone:     form.phone,
                    reference_number:   form.reference,
                }),
            });

            const intentData = await intentRes.json();
            if (!intentData.status) throw new Error(intentData.message || "Could not start payment.");

            // Step 2: confirm card payment via Stripe.js (PCI-safe)
            const { paymentIntent, error } = await stripe.confirmCardPayment(
                intentData.client_secret,
                {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                        billing_details: { name: form.name, email: form.email },
                    },
                }
            );

            if (error) throw new Error(error.message);

            // Step 3: tell Laravel to verify + mark completed
            const confirmRes = await fetch(`${apiurl}user/my-payments/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify({
                    payment_intent_id: paymentIntent.id,
                    payment_id:        intentData.payment_id,
                }),
            });

            const confirmData = await confirmRes.json();
            if (confirmData.payment_status === "completed") {
                onSuccess(confirmData.data); // tells parent to refresh
            } else {
                throw new Error("Payment did not complete. Please try again.");
            }

        } catch (err) {
            setPayError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            {/* Contact */}
            <div className="row g-3 mb-3">
                <div className="col-12">
                    <label className="form-label fw-semibold small">Full Name *</label>
                    <input
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="John Doe"
                        value={form.name}
                        onChange={change("name")}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold small">Email *</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={change("email")}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold small">Phone</label>
                    <input
                        className="form-control"
                        placeholder="+1 555 000 0000"
                        value={form.phone}
                        onChange={change("phone")}
                    />
                </div>
                <div className="col-12">
                    <label className="form-label fw-semibold small">Reference / ID No.</label>
                    <input
                        className="form-control"
                        placeholder="e.g. BL-2024-00123"
                        value={form.reference}
                        onChange={change("reference")}
                    />
                </div>
            </div>

            {/* Card Details */}
            <div className="row g-3 mb-3">
                <div className="col-12">
                    <label className="form-label fw-semibold small">Card Number</label>
                    <div
                        className="form-control"
                        style={{ height: 42, display: "flex", alignItems: "center" }}
                        onFocus={() => setFocus("num")}
                        onBlur={() => setFocus(null)}
                    >
                        <CardNumberElement options={ELEMENT_STYLE} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="col-6">
                    <label className="form-label fw-semibold small">Expiry</label>
                    <div className="form-control" style={{ height: 42, display: "flex", alignItems: "center" }}>
                        <CardExpiryElement options={ELEMENT_STYLE} />
                    </div>
                </div>
                <div className="col-6">
                    <label className="form-label fw-semibold small">CVC</label>
                    <div className="form-control" style={{ height: 42, display: "flex", alignItems: "center" }}>
                        <CardCvcElement options={ELEMENT_STYLE} />
                    </div>
                </div>
            </div>

            {/* Error */}
            {payError && (
                <div className="alert alert-danger py-2 small mb-3">
                    <i className="fas fa-exclamation-circle me-2" />{payError}
                </div>
            )}

            {/* Actions */}
            <div className="d-flex gap-2">
                <button
                    className="btn btn-primary flex-grow-1"
                    onClick={handlePay}
                    disabled={processing || !stripe}
                >
                    {processing
                        ? <><span className="spinner-border spinner-border-sm me-2" />Processing…</>
                        : <><i className="fas fa-lock me-2" />Pay Now</>
                    }
                </button>
                <button className="btn btn-outline-secondary" onClick={onClose} disabled={processing}>
                    Cancel
                </button>
            </div>

            <p className="text-center text-muted small mt-3 mb-0">
                <i className="fas fa-shield-alt me-1" />
                Secured by Stripe — your card details are never stored.
            </p>
        </div>
    );
};

// ── Modal wrapper ─────────────────────────────────────────────
const PaymentModal = ({ payment, onClose, onSuccess }) => {
    // payment prop can be a full payment object (for retry)
    // or a minimal { service_id, service_request_id } for a new payment
    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)", zIndex: 1055 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title">
                            <i className="fas fa-credit-card me-2 text-primary" />
                            {payment?.service?.title ?? "Complete Payment"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body pt-3">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                serviceId={payment?.service_id ?? payment?.service?.id}
                                serviceRequestId={payment?.service_request_id}
                                onSuccess={onSuccess}
                                onClose={onClose}
                            />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;