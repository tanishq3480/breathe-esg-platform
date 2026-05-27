import React, { useEffect, useState } from "react";

import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";


function App() {

  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [sourceType, setSourceType] =
    useState("SAP");


  const fetchPending = async () => {

    try {

      const response = await axios.get(
        "http://breathe-esg-lxiv.onrender.com/api/review/pending/"
      );

      setRecords(response.data);

    } catch (error) {

      console.error(error);
    }
  };


  useEffect(() => {

    fetchPending();

  }, []);


  const approveRecord = async (id) => {

    await axios.post(
      `http://breathe-esg-lxiv.onrender.com/api/review/approve/${id}/`
    );

    fetchPending();
  };


  const rejectRecord = async (id) => {

    await axios.post(
      `http://breathe-esg-lxiv.onrender.com/api/review/reject/${id}/`
    );

    fetchPending();
  };


  const uploadFile = async () => {

    if (!file) {

      alert("Choose CSV file");

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "source_type",
      sourceType
    );

    try {

      await axios.post(
        "http://breathe-esg-lxiv.onrender.com/api/upload/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Upload successful");

      fetchPending();

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Upload failed"
      );
    }
  };


  const totalRecords = records.length;

  const flaggedRecords = records.filter(
    r => r.status === "FLAGGED"
  ).length;

  const pendingRecords = records.filter(
    r => r.status === "PENDING"
  ).length;


  const scopeData = [

    {
      name: "Scope 1",
      value: records.filter(
        r => r.scope === "Scope 1"
      ).length
    },

    {
      name: "Scope 2",
      value: records.filter(
        r => r.scope === "Scope 2"
      ).length
    },

    {
      name: "Scope 3",
      value: records.filter(
        r => r.scope === "Scope 3"
      ).length
    },
  ];


  return (

    <div className="container mt-4">

      <div className="text-center mb-4">

        <h1 className="fw-bold">
          Breathe ESG Dashboard
        </h1>

       <p className="text-muted">
         Enterprise ESG Data Ingestion,
         Validation & Review System
       </p>

      </div>

      <div className="card shadow p-4 mb-4">

        <h3 className="mb-3">
          Upload ESG Data
        </h3>

        <div className="row">

          <div className="col-md-4">

            <select
              className="form-select"
              value={sourceType}
              onChange={(e) =>
                setSourceType(
                  e.target.value
                )
              }
            >

              <option value="SAP">
                SAP Fuel Data
              </option>

              <option value="UTILITY">
                Utility Electricity
              </option>

              <option value="TRAVEL">
                Corporate Travel
              </option>

            </select>

          </div>

          <div className="col-md-4">

            <input
              type="file"
              className="form-control"
              accept=".csv"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
            />

          </div>

          <div className="col-md-4">

            <button
              className="btn btn-primary w-100"
              onClick={uploadFile}
            >
              Upload CSV
            </button>

          </div>

        </div>

      </div>

      <div className="row mb-4">

        <div className="col-md-4">

          <div className="card shadow text-center p-3">

            <h5>Total Records</h5>

            <h2>{totalRecords}</h2>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card shadow text-center p-3">

            <h5>Pending Reviews</h5>

            <h2>{pendingRecords}</h2>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card shadow text-center p-3">

            <h5>Flagged Records</h5>

            <h2>{flaggedRecords}</h2>

          </div>

        </div>

      </div>

      <div className="card shadow p-4 mb-4">

        <h3 className="mb-4">
          ESG Scope Distribution
        </h3>

        <div className="d-flex justify-content-center">

          <PieChart width={400} height={300}>

            <Pie
              data={scopeData}
              dataKey="value"
              outerRadius={100}
              label
            >

              {
                scopeData.map(
                  (entry, index) => (
                    <Cell key={index} />
                  )
                )
              }

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </div>

      </div>

      <div className="card shadow p-4">

        <h3 className="mb-4">
          Pending Reviews
        </h3>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>

                <th>ID</th>
                <th>Scope</th>
                <th>Category</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {
                records.map((item) => (

                  <tr key={item.id}>

                    <td>{item.id}</td>

                    <td>{item.scope}</td>

                    <td>{item.category}</td>

                    <td>{item.value}</td>

                    <td>{item.unit}</td>

                    <td>

                      <span
                        className={
                          item.status ===
                          "FLAGGED"

                            ? "badge bg-danger"

                            : "badge bg-warning text-dark"
                        }
                      >

                        {item.status}

                      </span>

                    </td>

                    <td>

                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          approveRecord(item.id)
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          rejectRecord(item.id)
                        }
                      >
                        Reject
                      </button>

                    </td>

                  </tr>

                ))
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default App;