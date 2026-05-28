import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://YOUR-BACKEND.onrender.com/api";

function ReviewQueuePage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        `${API}/review/pending/`
      );

      console.log(response.data);

      setRecords(response.data);
    } catch (error) {
      console.error("Review fetch failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Review Queue</h1>

      {records.length === 0 ? (
        <p>No review records found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Scope</th>
              <th>Category</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.scope}</td>
                <td>{record.category}</td>
                <td>{record.normalized_value}</td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReviewQueuePage;