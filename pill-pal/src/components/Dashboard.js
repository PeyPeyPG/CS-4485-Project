import './Dashboard1.css';
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [medicines, setMedicines] = useState([]);
    const [day, updateDay] = useState("Mon");
    const [listMedicines, setListMedicines] = useState([]);

    // Fetch medicines from the API
    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const username = "test"; // Replace with the actual username
                const response = await fetch(`http://localhost:8080/api/dashboard/getcurmeds/${username}`);
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

    const doctorsNotes = [
        { id: 1, name: "Dr. Glogouh", subject: "Ibiprofen", pinned: true, content: "If you somehow overdose on these, then that's just natural selection at work" },
        { id: 2, name: "Dr. Sins", subject: "Potassium Chloride", pinned: true, content: "I'm not really a doctor..." },
    ];

    const pinnedNotes = doctorsNotes.filter(doctorsNote => doctorsNote.pinned === true);

    const displayNotes = pinnedNotes.map(pinnedNote => (
        <li key={pinnedNote.id}>
            <div className="note-card">
                <div className="note-card-doctor">{pinnedNote.name}</div>
                <div className="note-card-subject">Subject: {pinnedNote.subject}</div>
                <div>{pinnedNote.content}</div>
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