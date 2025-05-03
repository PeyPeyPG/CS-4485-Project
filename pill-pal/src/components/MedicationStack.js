import React, { useState, useEffect } from 'react';
import './MedicationStack.css';
import Cookies from 'js-cookie';

const MedicationStack = ({ selectedPatient }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [rxNormMedications, setRxNormMedications] = useState([]);
    const [selectedMedication, setSelectedMedication] = useState('');
    const [dosage, setDosage] = useState('');
    const [days, setDays] = useState([]);
    const [timesPerDay, setTimesPerDay] = useState(1);
    const [times, setTimes] = useState(['08:00']);
    const [userMedications, setUserMedications] = useState([]);

    useEffect(() => {
        const fetchUserMedications = async () => {
            try {
                const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
                const username = userInfo?.username;
                const userType = userInfo?.userType;

                let endpoint = '';
                if (userType === 'patient') {
                    endpoint = `/api/medications/${username}`;
                } else if (userType === 'provider' && selectedPatient) {
                    endpoint = `/api/medications/${selectedPatient.username}`;
                }

                if (endpoint) {
                    const response = await fetch(endpoint);
                    const data = await response.json();
                    setUserMedications(data);
                }
            } catch (error) {
                console.error('Error fetching medications:', error);
            }
        };
        fetchUserMedications();
    }, [selectedPatient]);

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

        const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
        const username = userInfo?.username;
        const userType = userInfo?.userType;

        const newMedication = {
            PatientUsername: userType === 'patient' ? username : selectedPatient?.username,
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
            const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
            const username = userInfo?.username;

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
        <div>
            <h1>Medication Stack</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search for a medication"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchMedicationsFromRxNorm}>Search</button>
            </div>
            <div>
                <select
                    value={selectedMedication}
                    onChange={(e) => handleMedicationSelect(e.target.value)}
                >
                    <option value="">Select a Medication</option>
                    {rxNormMedications.map((med) => (
                        <option key={med.rxcui} value={med.name}>
                            {med.name}
                        </option>
                    ))}
                </select>
                {dosage && <p>Dosage: {dosage}</p>}
            </div>
            <div>
                <label>Days of the Week:</label>
                <div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <label key={day}>
                            <input
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
            <div>
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
            <div>
                <label>Times:</label>
                {times.map((time, index) => (
                    <input
                        key={index}
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                    />
                ))}
            </div>
            <button onClick={handleAddMedication}>Add Medication</button>
            <h2>Your Medications</h2>
            <ul>
                {userMedications.map((med) => (
                    <li key={med.id} className="medication-item">
                        <div>
                            <strong>Name:</strong> {med.medicationName}
                        </div>
                        <div>
                            <strong>Dosage:</strong> {med.dosage}
                        </div>
                        <div>
                            <strong>Days:</strong> {Array.isArray(med.days) ? med.days.join(', ') : med.days}
                        </div>
                        <div>
                            <strong>Times:</strong> {Array.isArray(med.times) ? med.times.join(', ') : med.times}
                        </div>
                        <button onClick={() => handleRemoveMedication(med.medicationName)} className="remove-button">
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicationStack;