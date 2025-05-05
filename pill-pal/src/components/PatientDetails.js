import React, { useState, useEffect, useCallback } from 'react';
import './MedicationStack.css';
import { useParams, useNavigate } from 'react-router-dom';
import ProviderNavbar from './ProviderNavbar';
import debounce from 'lodash.debounce';
import Cookies from "js-cookie";

const PatientDetails = () => {
    const { username } = useParams();
    const navigate     = useNavigate();
    const userInfo  = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    const userType  = userInfo?.userType;

    const [patient, setPatient]                 = useState(null);
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
        fetch(`/api/patients/patients/${username}`)
            .then(r=>r.ok?r.json():null).then(setPatient);
        fetch(`/api/medications/${username}`)
            .then(r=>r.ok?r.json():[]).then(setUserMeds);
    }, [username]);

    // Live medication search of database
    const searchDB = async (term) => {
        if (!term.trim()) return setAvailable([]);
        const r = await fetch(`/api/medications/search?q=${encodeURIComponent(term)}`);
        const data = await r.json();
        setAvailable(data.map(m=>({ name:m.medicationName, dosage:m.dosage })));
    };
    const debouncedSearch = useCallback(debounce(searchDB,300),[]);
    useEffect(()=>{ debouncedSearch(searchTerm); return debouncedSearch.cancel; },[searchTerm,debouncedSearch]);

    // Lookup interactions
    useEffect(()=>{
        fetch(`/api/medications/interactions/${username}`)
            .then(r=>r.ok?r.json():[]).then(setAlerts).catch(()=>setAlerts([]));
    },[userMeds,username]);

    useEffect(()=>{
        if(!selectedMedication) return;
        fetch(`/api/medications/interactions/${username}/check/${encodeURIComponent(selectedMedication)}`)
            .then(r=>r.ok?r.json():[]).then(setAlerts).catch(()=>setAlerts([]));
    },[selectedMedication,username]);

    const handleAddMedication = async () => {
        if (!selectedMedication || !days.length) { alert('Fill all fields'); return; }
        const payload = {
            PatientUsername: username,
            MedicationName : selectedMedication,
            dosage,
            Days : days.join(','),
            Times: times.join(','),
            Frequency: timesPerDay,
        };
        const ok = await fetch('/api/medications/assign',{
            method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
        }).then(r=>r.ok);
        if(ok){
            const newList = await fetch(`/api/medications/${username}`).then(r=>r.json());
            setUserMeds(newList);
            setSelected(''); setDosage(''); setDays([]); setTimes(['08:00']);
        }else alert('Error saving medication');
    };

    const handleRemoveMedication = async (medName) => {
        const ok = await fetch(`/api/medications/${medName}/${username}`,{method:'DELETE'}).then(r=>r.ok);
        if(ok) setUserMeds(userMeds.filter(m=>m.medicationName!==medName));
    };

    const handleTimesPerDayChange = n=>{ setTimesPerDay(n); setTimes(Array(n).fill('08:00')); };
    const handleTimeChange       = (i,v)=> setTimes(t=>t.map((tv,idx)=>idx===i?v:tv));
    const handleMedicationSelect = name=>{
        setSelected(name);
        const found = availableMedications.find(m=>m.name===name);
        setDosage(found?.dosage||'');
    };

    if(!patient) return <div>Loading...</div>;

    return (
        <div className="patient-details-container">
            <ProviderNavbar/>
            {userType === 'provider' && (
                <button
                    className="back-button"
                    onClick={() => navigate('/home/provider/dashboard')}   // adjust path if needed
                    style={{ margin: '1rem 0' }}                     // inline style or move to CSS
                >
                    ← Back to Dashboard
                </button>
            )}

            <h1>Patient Details</h1>
            <p><strong>Username:</strong> {patient.username}</p>
            <p><strong>Name:</strong> {patient.Name}</p>
            <p><strong>Date of Birth:</strong> {patient.DateOfBirth.split('T')[0]}</p>
            <p><strong>Gender:</strong> {patient.Gender}</p>

            <div className="med-stack-container">
                <h1>Medication Stack</h1>

                <div className="add-medication">
                    <div className="select-medication">
                        <input
                            className="search-medication"
                            type="text"
                            placeholder="Search for a medication"
                            value={searchTerm}
                            onChange={e=>setSearchTerm(e.target.value)}
                        />
                        <select
                            className="select-med-button"
                            value={selectedMedication}
                            onChange={e=>handleMedicationSelect(e.target.value)}
                        >
                            <option className="med-option-bar" value="">Select a Medication</option>
                            {availableMedications.map(m=>(
                                <option key={m.name} value={m.name}>{m.name}</option>
                            ))}
                        </select>
                        {dosage && <p>Dosage: {dosage}</p>}
                    </div>

                    <div className="days-of-week-container">
                        <label className="days-label">Days of the Week:</label>
                        <div className="med-dosage-intervals">
                            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(
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

                <button className="add-medication-button" onClick={handleAddMedication}>Add Medication</button>

                <h2 className="user-medication-header">Patient's Medications</h2>
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
        </div>
    );
};

export default PatientDetails;