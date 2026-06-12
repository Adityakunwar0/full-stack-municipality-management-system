import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Portal from "../../common/Portal";
import { Link } from "react-router-dom";
import PaymentDashboard from "../../common/PaymentDashboard";

const Payment = () => {

    return (
        <>
            <Header />

            <main>

                <Portal
                    heading="Manage Your Payments"
                    text="View payment history, check pending payments, and securely complete your municipal service payments."
                />

                <section className="py-5 light-background">

                    <div className="container">

                        <div className="section-header text-center mb-4">
                            <span>Payments</span>
                            <h2>My Payment Transactions</h2>
                        </div>


                        <div className="container card border-0 shadow-sm mb-4">

                            <div className="card-body d-flex justify-content-between align-items-center py-3">

                                <div>
                                    <h5 className="mb-1 fw-bold">
                                        Need to Pay a Municipal Service?
                                    </h5>

                                    <p className="text-muted small mb-0">
                                        Pay property taxes, service fees, permits, utility charges, and other municipality payments online.
                                    </p>
                                </div>


                                <Link
                                    to="/services"
                                    className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
                                >
                                    <i className="fa-solid fa-credit-card"></i>
                                    <span>Make Payment</span>
                                </Link>


                            </div>

                        </div>


                        <PaymentDashboard />


                    </div>

                </section>


            </main>


            <Footer />

        </>
    );
};


export default Payment;