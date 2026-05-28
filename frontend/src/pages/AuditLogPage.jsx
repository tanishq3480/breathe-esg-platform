import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

function AuditLogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `${API}/audit/logs/`
      );

      console.log(response.data);

      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Audit Logs</h1>

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
            <th>Entity Type</th>
            <th>Entity ID</th>
            <th>Action</th>
            <th>Performed By</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.entity_type}</td>

              <td>{log.entity_id}</td>

              <td>{log.action}</td>

              <td>{log.performed_by}</td>

              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditLogPage;