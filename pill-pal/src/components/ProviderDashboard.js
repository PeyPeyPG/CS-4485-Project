import React from 'react';
import './Dashboard.css';

const ProviderDashboard = () => {
    const patients = [
        { name: 'John Doe', medications: ['Aspirin', 'Metformin'] },
        { name: 'Jane Smith', medications: ['Ibuprofen', 'Lisinopril'] },
    ];

    return (
        <div className="dashboard-container">
            <h1>Provider Dashboard</h1>
            <h2>Patient List</h2>
            {patients.map((patient, index) => (
                <div key={index} className="patient-card">
                    <h3>{patient.name}</h3>
                    <ul>
                        {patient.medications.map((med, idx) => (
                            <li key={idx}>{med}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ProviderDashboard;