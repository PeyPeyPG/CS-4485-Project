import './Dashboard.css';
import React, { useState } from 'react';
const Dashboard = () => {

    const medicines = [{id: 1, day: "Mon", name: "Ibiprofen", dosage: "100mg", time: "AM/PM"},
                       {id: 2, day: "Mon", name: "Losartan", dosage: "100mg", time: "AM/PM"},
                       {id: 10, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 20, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 30, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 40, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 50, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 60, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 70, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 80, day: "Mon", name: "", dosage: "100mg", time: "AM/PM"},
                       {id: 3, day: "Tue", name: "Potassium Chloride", dosage: "50mg", time: "AM/PM"},
                       {id: 4, day: "Tue", name: "acteminophinagrim", dosage: "1 Tablet", time: "2 Every 4 hours"},
                       {id: 5, day: "Wed", name: "Gabapetin", dosage: "100mg", time: "AM/PM"},
                       {id: 6, day: "Wed", name: "Methylprednisone", dosage: "2 Tablets", time: "AM/PM"},
                        ];

    const dayListMedicines = medicines.filter(medicine => medicine.day === "Mon");

    const initialList = dayListMedicines.map(medicine => <li key = {medicine.id}>
        <div className="med-entry">
            <svg width="60" height="27" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="199" height="89" rx="44.5" fill="white" stroke="black"/>
                <path d="M45 0.5H99.5V89.5H45C20.4233 89.5 0.5 69.5767 0.5 45C0.5 20.4233 20.4233 0.5 45 0.5Z" fill="#F78C8C" stroke="black"/>
            </svg>
            <div className="med">{medicine.name}</div>
            <div className="med-dosage">{medicine.dosage}</div>
            <div className="med-time">{medicine.time}</div>
        </div>
        </li>);

    const [day, updateDay] = useState("Mon");
    const [listMedicines, setListMedicines] = useState(initialList);

    function handleDayChange(event){
        updateDay(event);
    }

    const doctorsNotes = [{id: 1, name: "Dr. Glogouh", subject: "Ibiprofen", pinned: true,
        content: "If you somehow overdose on these, then that's just natural selection at work"},
      {id: 2, name: "Dr. Sins", subject: "Potassium Chloride", pinned: false,
            content: "I'm not really a doctor..."},
    ];

    const pinnedNotes = doctorsNotes.filter(doctorsNote => doctorsNote.pinned === true);

    const displayNotes = pinnedNotes.map(pinnedNote => <li key = {pinnedNote.id}>
        <div className = "note-card">
            <div className = "note-card-doctor">{pinnedNote.name}</div>
            <div className = "note-card-subject">Subject: {pinnedNote.subject}</div>
            <div>{pinnedNote.content}</div>
        </div>
    </li>)

    function filterMedicineList(event){
        handleDayChange(event);
        const dayListMedicines = medicines.filter(medicine => medicine.day === event);

        const dayList = dayListMedicines.map(dayListMedicine => <li key = {dayListMedicine.id}>
            <div className="med-entry">
                <svg width="60" height="27" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="199" height="89" rx="44.5" fill="white" stroke="black"/>
                    <path d="M45 0.5H99.5V89.5H45C20.4233 89.5 0.5 69.5767 0.5 45C0.5 20.4233 20.4233 0.5 45 0.5Z" fill="#F78C8C" stroke="black"/>
                </svg>
                <div className="med">{dayListMedicine.name}</div>
                <div className="med-dosage">{dayListMedicine.dosage}</div>
                <div className="med-time">{dayListMedicine.time}</div>
            </div>
            </li>);
        
        setListMedicines(dayList);
    }

    return(
        <div className = "dashboard-container">
            <div className = "medicine-stack-container">
                <div className = "stack-text">Medicine Stack</div>
                <div className = "daily-pill-container">
                    <div className = {day === "Mon" ? "day-button active" : "day-button"} onClick={() => 
                        {filterMedicineList("Mon");}}>Mon</div>
                    <div className = {day === "Tue" ? "day-button active" : "day-button"} onClick={() => 
                        {filterMedicineList("Tue");}}>Tue</div>
                    <div className = {day === "Wed" ? "day-button active" : "day-button"} onClick={() => 
                        {filterMedicineList("Wed");}}>Wed</div>
                    <div className = {day === "Thur" ? "day-button active" : "day-button"} onClick={() => 
                        {filterMedicineList("Thur");}}>Thur</div>
                    <div className = {day === "Fri" ? "day-button active" : "day-button"} onClick={() => 
                        {filterMedicineList("Fri");}}>Fri</div>
                    <div className = {day === "Sat" ? "day-button active" : "day-button"} onClick={() => 
                        {filterMedicineList("Sat");}}>Sat</div>
                    <div className = {day === "Sun" ? "day-button active" : "day-button"} onClick={() => 
                        {filterMedicineList("Sun");}}>Sun</div>
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