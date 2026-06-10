import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import RequestDashboard from "../../common/RequestDashboard";
import Portal from "../../common/Portal";
import { Link } from "react-router-dom";

const Request = () => {

    return (
        <>
            <Header />
            <main>
                <Portal 
            heading="Track Your Submissions" 
            text="Monitor real-time updates, view status metrics, and stay updated on all your submitted municipal service requests." 
        />
                <section className="py-5 light-background">
                    <div className="container">
                        <div className="section-header text-center mb-4">
                            <span>Applications</span>
                            <h2>My Service Requests</h2>
                        </div>
                        <div className="container card border-0 shadow-sm mb-4">
                <div className="card-body d-flex justify-content-between align-items-center py-3">
                    <div>
                        <h5 className="mb-1 fw-bold">Need a New Municipal Service?</h5>
                        <p className="text-muted small mb-0">Apply for certifications, permits, utilities, or submit custom documentation directly.</p>
                    </div>
                    {/* Adjust the 'to' path matching your application route parameters setup */}
                    <Link
                        to="/services"
                        className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
                    >
                        <i className="fa-solid fa-plus-circle"></i>
                        <span>New Request</span>
                    </Link>
                </div>
            </div>

                        <RequestDashboard />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Request;