import React, { useEffect, useState } from 'react';
import './MedicationStack.css';
import { useParams } from 'react-router-dom';
import ProviderNavbar from './ProviderNavbar';

const PatientDetails = () => {
    const { username } = useParams(); // Get the username from the URL
    const [patient, setPatient] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
    const [rxNormMedications, setRxNormMedications] = useState([]);
    const [selectedMedication, setSelectedMedication] = useState('');
    const [dosage, setDosage] = useState('');
    const [days, setDays] = useState([]);
    const [timesPerDay, setTimesPerDay] = useState(1);
    const [times, setTimes] = useState(['08:00']);
    const [userMedications, setUserMedications] = useState([]);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await fetch(`/api/patients/patients/${username}`);
                console.log(response)
                if (response.ok) {
                    const data = await response.json();
                    setPatient(data);
                } else {
                    console.error('Failed to fetch patient details');
                }
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };

        fetchPatientDetails();
    }, [username]);

    if (!patient) {
        return <div>Loading...</div>;
    }

    const fetchMedicationsFromRxNorm = async () => {
        if (!searchTerm.trim()) return;

        try {
            const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchTerm}`);
            const data = await response.json();
            if (data.drugGroup && data.drugGroup.conceptGroup) {
                const medications = data.drugGroup.conceptGroup
                    .flatMap(group => group.conceptProperties || [])
                    .map(med => ({ name: med.name, rxcui: med.rxcui }));
                setRxNormMedications(medications);
            } else {
                setRxNormMedications([]);
            }
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    };

    const handleAddMedication = async () => {
            if (!selectedMedication || !days.length || !times) {
                alert('Please fill out all fields.');
                return;
            }
    
            const userType = 'patient'; // Replace with actual user type logic
    
            const newMedication = {
                PatientUsername: userType === 'patient' ? username : username,
                MedicationName: selectedMedication,
                dosage,
                Days: days.join(','),
                Times: times.join(','),
                Frequency: timesPerDay,
            };
    
            try {
                const response = await fetch('/api/medications/assign', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMedication),
                });
    
                if (response.ok) {
                    const savedMedication = await response.json();
                    setUserMedications([...userMedications, savedMedication]);
                    setSelectedMedication('');
                    setDosage('');
                    setDays([]);
                    setTimes(['08:00']);
                } else {
                    alert('Error saving medication.');
                }
            } catch (error) {
                console.error('Error adding medication:', error);
            }
        };

        const handleTimesPerDayChange = (count) => {
            setTimesPerDay(count);
            setTimes(Array(count).fill('08:00'));
        };

        const handleTimeChange = (index, value) => {
            const updatedTimes = [...times];
            updatedTimes[index] = value;
            setTimes(updatedTimes);
        };

        const handleRemoveMedication = async (medicationName) => {
                try {
        
                    const response = await fetch(`/api/medications/${medicationName}/${username}`, { method: 'DELETE' });
        
                    if (response.ok) {
                        setUserMedications(userMedications.filter(med => med.medicationName !== medicationName));
                    } else {
                        const errorData = await response.json();
                        alert(`Error removing medication: ${errorData.error || 'Unknown error'}`);
                    }
                } catch (error) {
                    console.error('Error removing medication:', error);
                    alert('Error removing medication.');
                }
            };

        const handleMedicationSelect = (medication) => {
            setSelectedMedication(medication);
            const dosageMatch = medication.match(/\d+(\.\d+)?\s?[a-zA-Z]+/);
            setDosage(dosageMatch ? dosageMatch[0] : '');
        };

    return (
        <div className="patient-details-container">
            <ProviderNavbar />
            <h1>Patient Details</h1>
            <p><strong>Username:</strong> {patient.username}</p>
            <p><strong>Name:</strong> {patient.Name}</p>
            <p><strong>Date of Birth:</strong> {patient.DateOfBirth.split('T')[0]}</p>
            <p><strong>Gender:</strong> {patient.Gender}</p>
            {/* Add more details as needed */}

            <div className = "med-stack-container">
        <h1>Medication Stack</h1>
        <div className = "add-medication">
            <div className="select-medication">
                <div>
                    <input className="search-medication"
                        type="text"
                        placeholder="Search for a medication"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className = "search-med-button" onClick={fetchMedicationsFromRxNorm}>Search</button>
                </div>
                <div>
                    <select className = "select-med-button"
                        value={selectedMedication}
                        onChange={(e) => handleMedicationSelect(e.target.value)}
                    >
                        <option className = "med-option-bar" value="">Select a Medication</option>
                        {rxNormMedications.map((med) => (
                            <option key={med.rxcui} value={med.name}>
                                {med.name}
                            </option>
                        ))}
                    </select>
                    {dosage && <p>Dosage: {dosage}</p>}
                </div>
            </div>
            <div className="days-of-week-container">
                <label className="days-label">Days of the Week:</label>
                <div className="med-dosage-intervals">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <label className="med-time-container" key={day}>
                            <input
                                className="day-selector"
                                type="checkbox"
                                value={day}
                                checked={days.includes(day)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setDays(prev =>
                                        prev.includes(value)
                                            ? prev.filter(d => d !== value)
                                            : [...prev, value]
                                    );
                                }}
                            />
                            {day}
                        </label>
                    ))}
                </div>
            </div>
            <div className = "time-per-day-container">
                <div className = "number-times-container">
                    <label>Times Per Day:</label>
                    <select
                        value={timesPerDay}
                        onChange={(e) => handleTimesPerDayChange(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4].map((count) => (
                            <option key={count} value={count}>
                                {count}
                            </option>
                        ))}
                    </select>
                </div>
                <div className = "time-clock-container">
                    <label className = "times-header">Times:</label>
                    <div className="times-container">
                        {times.map((time, index) => (
                            <input
                                key={index}
                                type="time"
                                value={time}
                                onChange={(e) => handleTimeChange(index, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <button className = "add-medication-button"onClick={handleAddMedication}>Add Medication</button>
        <h2 className = "user-medication-header">Patient's Medications</h2>
        <ul className='user-medication-list'>
            {userMedications.map((med) => (
                <li key={med.id} className="medication-item">
                    <div className = "medication-item-info-container">
                        <strong>Name:</strong> {med.medicationName}
                    </div>
                    <div className = "medication-item-info-container">
                        <strong>Dosage:</strong> {med.dosage}
                    </div>
                    <div className = "medication-item-info-container">
                        <strong>Days:</strong> {Array.isArray(med.days) ? med.days.join(', ') : med.days}
                    </div>
                    <div className = "medication-item-info-container">
                        <strong>Times:</strong> {Array.isArray(med.times) ? med.times.join(', ') : med.times}
                    </div>
                    <button onClick={() => handleRemoveMedication(med.medicationName)} className="remove-button">
                        Remove
                    </button>
                </li>
            ))}
        </ul>
        </div>
        </div>

        
    );
};

export default PatientDetails;