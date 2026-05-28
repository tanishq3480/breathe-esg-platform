import React, { useEffect, useState } from 'react'
import axios from 'axios'

function EmissionTable() {

    const [records, setRecords] = useState([])

    useEffect(() => {

        axios
            .get('http://breathe-esg-lxiv.onrender.com/api/ingestion/')
            .then((response) => {
                setRecords(response.data)
            })
            .catch((error) => {
                console.log(error)
            })

    }, [])

    return (

        <div className="container mt-4">

            <h2>Emission Records</h2>

            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Scope</th>
                        <th>Category</th>
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
                            <td>{record.emissions_kg_co2e}</td>
                            <td>{record.status}</td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    )
}

export default EmissionTable