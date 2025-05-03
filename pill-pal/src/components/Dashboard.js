import './Dashboard1.css';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 

const Dashboard = () => {
    const [medicines, setMedicines] = useState([]);
    const [day, updateDay] = useState("Mon");
    const [listMedicines, setListMedicines] = useState([]);
    const [doctorsNotes, setDoctorsNotes] = useState([]);

    // Fetch medicines from the API
    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const userInfo = Cookies.get('userInfo');
                const username = userInfo ? JSON.parse(userInfo).username : null;
                const response = await fetch(`/api/dashboard/getcurmeds/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch medicines');
                } 
                const data = await response.json();
                console.log(data);
                setMedicines(data);
                filterMedicineList("Mon", data); // Initialize with Monday's medicines
            } catch (err) {
                console.error('Error fetching medicines:', err);
            }
        };

        fetchMedicines();
    }, []);

    // Fetch pinned doctor's notes from the API
    useEffect(() => {
        const fetchPinnedNotes = async () => {
            try {
                const userInfo = Cookies.get('userInfo');
                const username = userInfo ? JSON.parse(userInfo).username : null;                
                const response = await fetch(`/api/dashboard/getpinnednotes/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch pinned notes');
                }
                const notes = await response.json();
                console.log('Pinned Notes:', notes);
                setDoctorsNotes(notes); // Store the pinned notes in state
            } catch (err) {
                console.error('Error fetching pinned notes:', err);
            }
        };

        fetchPinnedNotes();
    }, []);

    // Filter medicines by day
    const filterMedicineList = (selectedDay, medicinesData = medicines) => {
        updateDay(selectedDay);
        const dayListMedicines = medicinesData.filter(medicine => medicine.Days.includes(selectedDay));
        const dayList = dayListMedicines.map(dayListMedicine => (
            <li key={dayListMedicine.MedicationName}>
                <div className="med-entry">
                    <svg width="60" height="27" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="199" height="89" rx="44.5" fill="white" stroke="black" />
                        <path d="M45 0.5H99.5V89.5H45C20.4233 89.5 0.5 69.5767 0.5 45C0.5 20.4233 20.4233 0.5 45 0.5Z" fill="#F78C8C" stroke="black" />
                    </svg>
                    <div className="med">{dayListMedicine.MedicationName}</div>
                    <div className="med-dosage">{dayListMedicine.dosage}</div>
                    <div className="med-time">{dayListMedicine.Times}</div>
                </div>
            </li>
        ));
        setListMedicines(dayList);
    };


    const displayNotes = doctorsNotes.map((pinnedNote, index) => (
        <li key={index}>
            <div className="note-card">
                <div className="note-card-doctor">{pinnedNote.name}</div>
                <div className="note-card-subject">Subject: {pinnedNote.subject}</div>
                <div>{pinnedNote.note}</div>
            </div>
        </li>
    ));

    return (
        <div className="main-dashboard-container">
            <div className="medicine-stack-container">
                <div className="stack-text">Medicine Stack</div>
                <div className="daily-pill-container">
                    {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map(dayName => (
                        <div
                            key={dayName}
                            className={day === dayName ? "day-button active" : "day-button"}
                            onClick={() => filterMedicineList(dayName)}
                        >
                            {dayName}
                        </div>
                    ))}
                </div>
                <div className="dropdown">
                    <ul className="medicine-items">{listMedicines}</ul>
                </div>
            </div>
            <div className="notes-container">
                <div className="notes-container-circle"></div>
                <div className="notes-container-bar">
                    <div className="bar-text">Doctor's Notes</div>
                </div>
                <div className="notes-box">
                    {displayNotes}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;