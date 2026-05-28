import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

function ReviewQueuePage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${API}/reviews/queue/`
      );

      console.log(response.data);

      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Review Queue</h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Scope</th>
            <th>Category</th>
            <th>Value</th>
            <th>Emissions</th>
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

              <td>{record.emissions_kg_co2e}</td>

              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewQueuePage;