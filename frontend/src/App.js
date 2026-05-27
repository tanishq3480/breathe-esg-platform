import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://breathe-esg-lxiv.onrender.com";

function App() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [sourceType, setSourceType] = useState("SAP");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch pending reviews
  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get(
        `${API}/api/review/pending/`
      );
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  // Upload CSV
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source_type", sourceType);

    try {
      setLoading(true);
      setMessage("");

      await axios.post(
        `${API}/api/ingest/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Upload successful!");
      fetchPendingReviews();
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Approve review
  const approveReview = async (id) => {
    try {
      await axios.post(
        `${API}/api/review/${id}/approve/`
      );

      fetchPendingReviews();
    } catch (error) {
      console.error(error);
    }
  };

  // Reject review
  const rejectReview = async (id) => {
    try {
      await axios.post(
        `${API}/api/review/${id}/reject/`
      );

      fetchPendingReviews();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Breathe ESG Platform</h1>

      <div className="upload-card">
        <h2>Upload ESG CSV</h2>

        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="dropdown"
        >
          <option value="SAP">SAP</option>
          <option value="Travel">Travel</option>
          <option value="Utilities">Utilities</option>
        </select>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />

        <button onClick={handleUpload} className="upload-btn">
          {loading ? "Uploading..." : "Upload CSV"}
        </button>

        {message && <p className="message">{message}</p>}
      </div>

      <div className="review-section">
        <h2>Pending Reviews</h2>

        {records.length === 0 ? (
          <p>No pending reviews</p>
        ) : (
          records.map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-info">
                <p>
                  <strong>Source:</strong>{" "}
                  {record.source_type}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {record.category}
                </p>

                <p>
                  <strong>Value:</strong>{" "}
                  {record.value}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {record.status}
                </p>
              </div>

              <div className="button-group">
                <button
                  className="approve-btn"
                  onClick={() =>
                    approveReview(record.id)
                  }
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() =>
                    rejectReview(record.id)
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;