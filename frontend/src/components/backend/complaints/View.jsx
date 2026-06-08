import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiurl, token } from "../../common/Http";
import { toast } from "react-toastify";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");

  const fetchComplaint = async () => {
    const res = await fetch(apiurl + "complaints/" + id, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });

    const result = await res.json();

    if (result.status) {
      setComplaint(result.data);
      setStatus(result.data.status);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const updateStatus = async () => {
    const res = await fetch(apiurl + "complaints/" + id + "/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (result.status) {
      toast.success("Status updated");
      setComplaint((prev) => ({ ...prev, status }));
    }
  };

  const statusBadge = (s) => {
    const map = {
      Pending: "warning",
      Process: "info",
      Completed: "success",
    };

    return <span className={`badge bg-${map[s]}`}>{s}</span>;
  };

  if (!complaint) return null;

  return (
    <>
    <Header/>
    <main>
        <div className="container my-4">

      {/* HEADER */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white d-flex justify-content-between">
          <strong>Complaint Details</strong>
          {statusBadge(complaint.status)}
        </div>

        <div className="card-body">
          <table className="table table-borderless mb-0">
            <tbody>
              <tr>
                <th>Token Number</th>
                <td><strong>{complaint.token_number}</strong></td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{complaint.full_name}</td>
              </tr>
              <tr>
                <th>Ward</th>
                <td>Ward {complaint.ward}</td>
              </tr>
               <tr>
                <th>Citizenship Id </th>
                <td>{complaint.citizenship_id}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{complaint.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{complaint.email}</td>
              </tr>
              <tr>
                <th>Subject</th>
                <td>{complaint.subject}</td>
              </tr>
              <tr>
                <th>Complaint</th>
                <td>{complaint.complaint}</td>
              </tr>
              <tr>
                <th>Submitted On</th>
                <td>
                  {new Date(complaint.created_at).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{statusBadge(complaint.status)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STATUS UPDATE CARD */}
      <div className="card border-0 shadow-sm">
        <div className="card-header">
          Update Status
        </div>

        <div className="card-body">

          <select
            className="form-select mb-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Process">Process</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            className="btn btn-primary w-100"
            onClick={updateStatus}
          >
            Update Status
          </button>

        </div>
      </div>

    </div>
    </main>
    <Footer />
    </>
    
  );
};

export default View;