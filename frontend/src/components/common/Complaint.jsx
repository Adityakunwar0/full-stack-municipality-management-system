import React from 'react'

const Complaint = () => {
    return (
        <section className="section-10">
            <div className="container contact-wrapper">

                <div className="message-box">
                    <h2>Without LogIn Complaint Here :</h2>
                    <p>
                        Please fill out the form below to register your complaint.
                        Our team will review and respond accordingly.
                    </p>

                    <form className="contact-form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <select required>
                                <option value="">Select Ward</option>
                                {[...Array(9)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        Ward {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Citizenship ID / Birth Registration Certificate ID"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email Address (Optional)"
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Complaint Subject"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                rows="6"
                                placeholder="Describe Your Complaint"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary small"
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                            {" "}Submit Complaint
                        </button>
                    </form>
                </div>

            </div>
        </section>
    )
}

export default Complaint