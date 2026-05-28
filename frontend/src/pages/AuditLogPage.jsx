import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://breathe-esg-lxiv.onrender.com/api";

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
      console.error("Audit fetch failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Audit Logs</h1>

      {logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Entity</th>
              <th>ID</th>
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
      )}
    </div>
  );
}

export default AuditLogPage;