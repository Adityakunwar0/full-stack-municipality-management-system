import React, { useState } from "react";
import { apiurl } from "../common/Http";

const Complaint = () => {
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("submit"); 

  const [formData, setFormData] = useState({
    full_name: "",
    ward: "",
    citizenship_id: "",
    phone: "",
    email: "",
    subject: "",
    complaint: "",
  });

  // Track complaint state
  const [trackToken, setTrackToken] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await fetch(apiurl + "complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.status === 422) {
        setErrors(result.errors);
        return;
      }

      if (result.status) {
        setToken(result.token_number); // fixed: was result.token
        setFormData({
          full_name: "",
          ward: "",
          citizenship_id: "",
          phone: "",
          email: "",
          subject: "",
          complaint: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackError("");
    setTrackResult(null);

    if (!trackToken.trim()) {
      setTrackError("Please enter your tracking token.");
      return;
    }

    setTrackLoading(true);
    try {
      const res = await fetch(
        apiurl + "complaints/status/" + encodeURIComponent(trackToken.trim()),
        {
          headers: { Accept: "application/json" },
        }
      );
      const result = await res.json();

      if (!result.status) {
        setTrackError(result.message || "Invalid Token Number.");
      } else {
        setTrackResult(result.data);
      }
    } catch (err) {
      setTrackError("Something went wrong. Please try again.");
    } finally {
      setTrackLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      Pending: "warning",
      Process: "info",
      Completed: "success",
    };
    return (
      <span className={`badge bg-${map[status] || "secondary"} fs-6 px-3 py-2`}>
        {status}
      </span>
    );
  };

  return (
    <section className="section-10">
      <div className="container contact-wrapper">
        <div className="message-box">
          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "submit" ? "active" : ""}`}
                onClick={() => { setActiveTab("submit"); setToken(""); }}
              >
                <i className="fa-solid fa-file-pen me-2"></i>
                Submit Complaint
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "track" ? "active" : ""}`}
                onClick={() => { setActiveTab("track"); setTrackResult(null); setTrackError(""); }}
              >
                <i className="fa-solid fa-magnifying-glass me-2"></i>
                Track Complaint
              </button>
            </li>
          </ul>

          {/* ── SUBMIT TAB ── */}
          {activeTab === "submit" && (
            <>
              <h2>Submit Your Complaint</h2>
              <p>Please fill out the form below to register your complaint.</p>

              {token && (
                <div className="alert alert-success">
                  <i className="fa-solid fa-circle-check me-2"></i>
                  Complaint submitted successfully!
                  <hr />
                  Your Tracking Token:{" "}
                  <strong className="fs-5">{token}</strong>
                  <br />
                  <small className="text-muted">
                    Save this token to track your complaint status later.
                  </small>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="form-group">
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                  />
                  {errors.full_name && (
                    <p className="invalid-feedback d-block">{errors.full_name[0]}</p>
                  )}
                </div>

                {/* Ward */}
                <div className="form-group">
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className={`form-select ${errors.ward ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Ward</option>
                    {[...Array(9)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        Ward {index + 1}
                      </option>
                    ))}
                  </select>
                  {errors.ward && (
                    <p className="invalid-feedback d-block">{errors.ward[0]}</p>
                  )}
                </div>

                {/* Citizenship ID */}
                <div className="form-group">
                  <input
                    type="text"
                    name="citizenship_id"
                    value={formData.citizenship_id}
                    onChange={handleChange}
                    placeholder="Citizenship ID / Birth Registration Certificate ID"
                    className={`form-control ${errors.citizenship_id ? "is-invalid" : ""}`}
                  />
                  {errors.citizenship_id && (
                    <p className="invalid-feedback d-block">{errors.citizenship_id[0]}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  />
                  {errors.phone && (
                    <p className="invalid-feedback d-block">{errors.phone[0]}</p>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address (Optional)"
                    className="form-control"
                  />
                </div>

                {/* Subject */}
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Complaint Subject"
                    className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                  />
                  {errors.subject && (
                    <p className="invalid-feedback d-block">{errors.subject[0]}</p>
                  )}
                </div>

                {/* Complaint */}
                <div className="form-group">
                  <textarea
                    rows="6"
                    name="complaint"
                    value={formData.complaint}
                    onChange={handleChange}
                    placeholder="Describe Your Complaint"
                    className={`form-control ${errors.complaint ? "is-invalid" : ""}`}
                  ></textarea>
                  {errors.complaint && (
                    <p className="invalid-feedback d-block">{errors.complaint[0]}</p>
                  )}
                </div>

                <button type="submit" className="btn btn-primary small">
                  <i className="fa-solid fa-paper-plane me-2"></i>
                  Submit Complaint
                </button>
              </form>
            </>
          )}

          {/* ── TRACK TAB ── */}
          {activeTab === "track" && (
            <>
              <h2>Track Your Complaint</h2>
              <p>
                Enter the token number you received when you submitted your
                complaint to check its current status.
              </p>

              <form onSubmit={handleTrack} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    value={trackToken}
                    onChange={(e) => setTrackToken(e.target.value)}
                    placeholder="Enter Token Number (e.g. CMP-XXXXXXXX)"
                    className={`form-control ${trackError ? "is-invalid" : ""}`}
                  />
                  {trackError && (
                    <p className="invalid-feedback d-block">{trackError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary small"
                  disabled={trackLoading}
                >
                  {trackLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-magnifying-glass me-2"></i>
                      Track Status
                    </>
                  )}
                </button>
              </form>

              {/* Track Result */}
              {trackResult && (
                <div className="mt-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                      <span>
                        <i className="fa-solid fa-file-lines me-2"></i>
                        Complaint Details
                      </span>
                      {statusBadge(trackResult.status)}
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <th style={{ width: "160px" }}>Token Number</th>
                            <td>
                              <strong>{trackResult.token_number}</strong>
                            </td>
                          </tr>
                          <tr>
                            <th>Name</th>
                            <td>{trackResult.full_name}</td>
                          </tr>
                          <tr>
                            <th>Ward</th>
                            <td>Ward {trackResult.ward}</td>
                          </tr>
                          <tr>
                            <th>Subject</th>
                            <td>{trackResult.subject}</td>
                          </tr>
                          <tr>
                            <th>Complaint</th>
                            <td style={{ whiteSpace: "pre-line" }}>
                              {trackResult.complaint}
                            </td>
                          </tr>
                          <tr>
                            <th>Submitted On</th>
                            <td>
                              {new Date(trackResult.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>Status</th>
                            <td>{statusBadge(trackResult.status)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Complaint;
