import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://breathe-esg-lxiv.onrender.com/api";

function App() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [sourceType, setSourceType] = useState("SAP");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH PENDING REVIEWS
  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get(
        `${API}/review/pending/`
      );

      setRecords(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  // UPLOAD CSV
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

      await axios.post(
        `${API}/upload/`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
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

  // APPROVE
  const approveReview = async (id) => {
    try {
      await axios.post(
        `${API}/review/approve/${id}/`
      );

      fetchPendingReviews();
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  // REJECT
  const rejectReview = async (id) => {
    try {
      await axios.post(
        `${API}/review/reject/${id}/`
      );

      fetchPendingReviews();
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        Breathe ESG Platform
      </h1>

      <div className="upload-card">
        <h2>Upload ESG CSV</h2>

        <select
          value={sourceType}
          onChange={(e) =>
            setSourceType(e.target.value)
          }
          className="dropdown"
        >
          <option value="SAP">SAP</option>
          <option value="Travel">
            Travel
          </option>
          <option value="Utilities">
            Utilities
          </option>
        </select>

        <input
          type="file"
          accept=".csv"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
          className="file-input"
        />

        <button
          onClick={handleUpload}
          className="upload-btn"
        >
          {loading
            ? "Uploading..."
            : "Upload CSV"}
        </button>

        {message && (
          <p className="message">
            {message}
          </p>
        )}
      </div>

      <div className="review-section">
        <h2>Pending Reviews</h2>

        {records.length === 0 ? (
          <p>No pending reviews</p>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="record-card"
            >
              <div>
                <p>
                  <strong>ID:</strong>{" "}
                  {record.id}
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
                    approveReview(
                      record.id
                    )
                  }
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() =>
                    rejectReview(
                      record.id
                    )
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