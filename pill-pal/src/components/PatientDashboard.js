import React, { useState } from 'react';
import './Dashboard.css';

const PatientDashboard = () => {
    const [medications, setMedications] = useState([]);
    const [newMedication, setNewMedication] = useState('');

    const handleAddMedication = () => {
        if (newMedication.trim()) {
            setMedications([...medications, newMedication]);
            setNewMedication('');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Patient Dashboard</h1>
            <h2>Your Medication Stack</h2>
            <ul>
                {medications.map((med, index) => (
                    <li key={index}>{med}</li>
                ))}
            </ul>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Add a new medication"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                />
                <button onClick={handleAddMedication} className="submit-button">
                    Add Medication
                </button>
            </div>
        </div>
    );
};

export default PatientDashboard;