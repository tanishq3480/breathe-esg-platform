import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import AuditLogPage from "./pages/AuditLogPage";
import ReviewQueuePage from "./pages/ReviewQueuePage";

const API = "http://127.0.0.1:8000/api";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [sourceType, setSourceType] = useState("SAP");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchPendingReviews = async () => {
    try {
      const response = await axios.get(
        `${API}/reviews/queue/`
      );

      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

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

      const response = await axios.post(
        `${API}/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      setMessage("Upload successful");

      fetchPendingReviews();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.error || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id) => {
    try {
      await axios.post(
        `${API}/review/approve/${id}/`
      );

      fetchPendingReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectReview = async (id) => {
    try {
      await axios.post(
        `${API}/review/reject/${id}/`
      );

      fetchPendingReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      return (
        record.category
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        record.normalized_value
          ?.toString()
          .includes(search)
      );
    });
  }, [records, search]);

  return (
    <div className="container">
      <h1 className="title">
        ESG Intelligence Dashboard
      </h1>

      <p className="subtitle">
        Enterprise ESG ingestion and review system
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Link to="/">Dashboard</Link>
        <Link to="/audit">Audit Logs</Link>
        <Link to="/review">Review Queue</Link>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            Pending Reviews
          </div>

          <div className="metric-value">
            {records.length}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            Source Types
          </div>

          <div className="metric-value">
            3
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            ESG Pipelines
          </div>

          <div className="metric-value">
            Active
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            System Status
          </div>

          <div className="metric-value">
            Live
          </div>
        </div>
      </div>

      <div className="upload-card">
        <h2>Upload ESG CSV</h2>

        <div className="upload-controls">
          <select
            value={sourceType}
            onChange={(e) =>
              setSourceType(e.target.value)
            }
            className="dropdown"
          >
            <option value="SAP">SAP</option>

            <option value="TRAVEL">
              TRAVEL
            </option>

            <option value="UTILITY">
              UTILITIES
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
        </div>

        {message && (
          <p className="message">
            {message}
          </p>
        )}
      </div>

      <div className="review-section">
        <div className="review-header">
          <h2>Pending Reviews</h2>

          <input
            type="text"
            placeholder="Search records..."
            className="search-box"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            No pending reviews found.
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="record-card"
            >
              <div className="record-details">
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
                  {record.normalized_value}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status-badge">
                    {record.status}
                  </span>
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

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/audit"
          element={<AuditLogPage />}
        />

        <Route
          path="/review"
          element={<ReviewQueuePage />}
        />
      </Routes>
    </Router>
  );
}

export default App;