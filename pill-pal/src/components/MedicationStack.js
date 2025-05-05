import React, { useState, useEffect, useCallback } from 'react';
import './MedicationStack.css';
import Cookies from 'js-cookie';
import debounce from 'lodash.debounce';

const MedicationStack = ({ selectedPatient }) => {
    const userInfo  = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    const username  = userInfo?.username;
    const userType  = userInfo?.userType;

    const [searchTerm, setSearchTerm]           = useState('');
    const [availableMedications, setAvailable]  = useState([]);
    const [selectedMedication, setSelected]     = useState('');
    const [dosage, setDosage]                   = useState('');
    const [days, setDays]                       = useState([]);
    const [timesPerDay, setTimesPerDay]         = useState(1);
    const [times, setTimes]                     = useState(['08:00']);
    const [userMeds, setUserMeds]               = useState([]);
    const [interactionAlerts, setAlerts]        = useState([]);


    // Fetch patients and medications
    useEffect(() => {
        const target = userType === 'patient' ? username : selectedPatient?.username;
        if (!target) return;
        fetch(`/api/medications/${target}`)
            .then(r => r.ok ? r.json() : [])
            .then(setUserMeds)
            .catch(() => {});
    }, [selectedPatient, userType, username]);

    // Live medication search of database
    const searchDB = async (term) => {
        if (!term.trim()) return setAvailable([]);
        try {
            const r   = await fetch(`/api/medications/search?q=${encodeURIComponent(term)}`);
            const res = await r.json();
            setAvailable(res.map(m => ({ name: m.medicationName, dosage: m.dosage })));
        } catch { setAvailable([]); }
    };
    const debouncedSearch = useCallback(debounce(searchDB, 300), []);
    useEffect(() => { debouncedSearch(searchTerm); return debouncedSearch.cancel; }, [searchTerm, debouncedSearch]);

    // Lookup interactions
    useEffect(() => {
        if (!username) return;
        fetch(`/api/medications/interactions/${username}`)
            .then(r => r.ok ? r.json() : [])
            .then(setAlerts)
            .catch(() => setAlerts([]));
    }, [userMeds, username]);

    useEffect(() => {
        if (!selectedMedication || !username) { return; }
        fetch(`/api/medications/interactions/${username}/check/${encodeURIComponent(selectedMedication)}`)
            .then(r => r.ok ? r.json() : [])
            .then(setAlerts)
            .catch(() => setAlerts([]));
    }, [selectedMedication, username]);

    const handleAddMedication = async () => {
        if (!selectedMedication || !days.length) { alert('Fill all fields'); return; }
        const targetUser = userType === 'patient' ? username : selectedPatient?.username;
        const payload = {
            PatientUsername: targetUser,
            MedicationName : selectedMedication,
            dosage,
            Days   : days.join(','),
            Times  : times.join(','),
            Frequency: timesPerDay,
        };
        const ok = await fetch('/api/medications/assign', {
            method : 'POST',
            headers: { 'Content-Type':'application/json' },
            body   : JSON.stringify(payload),
        }).then(r => r.ok);
        if (ok) {
            const newList = await fetch(`/api/medications/${targetUser}`).then(r => r.json());
            setUserMeds(newList);
            setSelected(''); setDosage(''); setDays([]); setTimes(['08:00']);
        } else { alert('Error saving medication'); }
    };

    const handleRemoveMedication = async (medName) => {
        const targetUser = userType === 'patient' ? username : selectedPatient?.username;
        const ok = await fetch(`/api/medications/${medName}/${targetUser}`, { method:'DELETE' })
            .then(r => r.ok);
        if (ok) setUserMeds(userMeds.filter(m => m.medicationName !== medName));
    };

    const handleTimesPerDayChange = n => { setTimesPerDay(n); setTimes(Array(n).fill('08:00')); };
    const handleTimeChange       = (i,v)=> setTimes(t => (t.map((tv,idx)=>idx===i?v:tv)));
    const handleMedicationSelect = name => {
        setSelected(name);
        const found = availableMedications.find(m => m.name === name);
        setDosage(found?.dosage || '');
    };

    return (
        <div className="med-stack-container">
            <h1>Medication Stack</h1>

            <div className="add-medication">
                <div className="select-medication">
                    <input
                        className="search-medication"
                        type="text"
                        placeholder="Search for a medication"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="select-med-button"
                        value={selectedMedication}
                        onChange={e => handleMedicationSelect(e.target.value)}
                    >
                        <option className="med-option-bar" value="">Select a Medication</option>
                        {availableMedications.map(m => (
                            <option key={m.name} value={m.name}>{m.name}</option>
                        ))}
                    </select>
                    {dosage && <p>Dosage: {dosage}</p>}
                </div>

                {/* days picker */}
                <div className="days-of-week-container">
                    <label className="days-label">Days of the Week:</label>
                    <div className="med-dosage-intervals">
                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                            <label className="med-time-container" key={d}>
                                <input
                                    className="day-selector"
                                    type="checkbox"
                                    value={d}
                                    checked={days.includes(d)}
                                    onChange={e=>{
                                        const v=e.target.value;
                                        setDays(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
                                    }}
                                />{d}
                            </label>
                        ))}
                    </div>
                </div>

                {/* time picker */}
                <div className="time-per-day-container">
                    <div className="number-times-container">
                        <label>Times Per Day:</label>
                        <select value={timesPerDay} onChange={e=>handleTimesPerDayChange(+e.target.value)}>
                            {[1,2,3,4].map(n=><option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div className="time-clock-container">
                        <label className="times-header">Times:</label>
                        <div className="times-container">
                            {times.map((t,i)=>(
                                <input key={i} type="time" value={t}
                                       onChange={e=>handleTimeChange(i,e.target.value)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button cursor = "pointer" className="add-medication-button" onClick={handleAddMedication}>Add Medication</button>

            <h2 className="user-medication-header">Your Medications</h2>
            <ul className="user-medication-list">
                {userMeds.map(m=>(
                    <li key={m.medicationName} className="medication-item">
                        <div className="medication-item-info-container"><strong>Name:</strong> {m.medicationName}</div>
                        <div className="medication-item-info-container"><strong>Dosage:</strong> {m.dosage}</div>
                        <div className="medication-item-info-container"><strong>Days:</strong> {m.days}</div>
                        <div className="medication-item-info-container"><strong>Times:</strong> {m.times}</div>
                        <button className="remove-button" onClick={()=>handleRemoveMedication(m.medicationName)}>Remove</button>
                    </li>
                ))}
            </ul>

            {interactionAlerts.length > 0 && (
                <div className="interaction-warning">
                    <h3>⚠ Medication Interactions Detected</h3>
                    <ul>{interactionAlerts.map((i,idx)=><li key={idx}>{i.MedicationA} ↔ {i.MedicationB}</li>)}</ul>
                </div>
            )}
        </div>
    );
};

export default MedicationStack;