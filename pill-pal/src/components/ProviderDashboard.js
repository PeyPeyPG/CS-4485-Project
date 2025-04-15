import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const ProviderDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        // Fetch all patients
        const fetchPatients = async () => {
            const response = await fetch('http://localhost:5000/api/patients');
            const data = await response.json();
            setPatients(data);
        };
        fetchPatients();
    }, []);

    const handlePatientClick = async (patientId) => {
        // Fetch patient details
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
        const data = await response.json();

        const allergiesResponse = await fetch(`http://localhost:5000/api/patients/${patientId}/allergies`);
        const allergies = await allergiesResponse.json();
        setSelectedPatient(data);
    };

    return (
        <div className="dashboard-container">
            <h1>Provider Dashboard</h1>
            <h2>Patient List</h2>
            <div className="patient-list">
                {patients.map((patient) => (
                    <div
                        key={patient.PatientID}
                        className="patient-card"
                        onClick={() => handlePatientClick(patient.PatientID)}
                    >
                        <h3>{patient.Name}</h3>
                        <p>Gender: {patient.Gender}</p>
                        <p>Date of Birth: {new Date(patient.DateOfBirth).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            {selectedPatient && (
                <div className="patient-details">
                    <h2>Patient Details</h2>
                    <p><strong>Name:</strong> {selectedPatient.details.Name}</p>
                    <p><strong>Date of Birth:</strong> {new Date(selectedPatient.details.DateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Gender:</strong> {selectedPatient.details.Gender}</p>
                    <p><strong>Height:</strong> {selectedPatient.details.Height} cm</p>
                    <p><strong>Weight:</strong> {selectedPatient.details.Weight} kg</p>
                    <p><strong>Pregnancy Status:</strong> {selectedPatient.details.PregnancyStatus ? 'Yes' : 'No'}</p>
                    <h3>Medical Conditions</h3>
                    <ul>
                        {selectedPatient.conditions.map((condition, index) => (
                            <li key={index}>{condition.ConditionName}</li>
                        ))}
                    </ul>
                    <h3>Medications</h3>
                    <ul>
                        {selectedPatient.medications.map((medication, index) => (
                            <li key={index}>{medication.MedicationName}</li>
                        ))}
                    </ul>
                    <h3>Allergies</h3>
                    <ul>
                        {selectedPatient.allergies.map((allergy, index) => (
                            <li key={index}>{allergy.AllergyName}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProviderDashboard;