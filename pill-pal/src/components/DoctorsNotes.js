import React, { useState } from 'react';
import './DoctorsNotes.css';
const DoctorsNotes = () => {

    const data = [{id: 1, name: "Dr. Glogouh", subject: "Ibiprofen", pinned: true,
        content: "If you somehow overdose on these, then that's just natural selection at work"},
      {id: 2, name: "Dr. Sins", subject: "Potassium Chloride", pinned: false,
            content: "I'm not really a doctor..."},
    ];

    const [doctorsNotes, setDoctorsNotes] = useState(data);

    function deleteCard(id) {
        const updatedNotes = doctorsNotes.filter(note => note.id !== id);
        setDoctorsNotes(updatedNotes);
      }

    function togglePinned(id) {
        setDoctorsNotes(prevNotes => prevNotes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note));
      }

    const displayNotes = doctorsNotes.map(doctorsNote => <li key = {doctorsNote.id}>
        <div className = "doctors-note-card">
                    <div className = "card-left-section">
                        <div className = "card-doctors-name">{doctorsNote.name}</div>
                        <div className = "card-subject-line">Subject: {doctorsNote.subject}</div>
                    </div>
                    <div className = "card-middle-section">
                       <div className = "card-note-content">
                       {doctorsNote.content}
                       </div>
                    </div>
                    <div className = "card-right-section">
                        <div className = "card-pin">
                            {doctorsNote.pinned ? (
                                    <svg cursor = "pointer" onClick = {() => togglePinned(doctorsNote.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pin-fill" viewBox="0 0 16 16">
                                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354"/>
                                    </svg>
                                ) : (
                                    <svg cursor = "pointer" onClick = {() => togglePinned(doctorsNote.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pin" viewBox="0 0 16 16">
                                    <path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A6 6 0 0 1 5 6.708V2.277a3 3 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354m1.58 1.408-.002-.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a5 5 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a5 5 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.8 1.8 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14q.091.15.214.271a1.8 1.8 0 0 0 .37.282"/>
                                  </svg>
                            )}
                        </div>
                        <svg svg cursor = "pointer" onClick = {() => deleteCard(doctorsNote.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>
                </div>
    </li>)

    return (
        <div className = "doctors-notes-container">
            <div className = "doctors-notes-text">Notes Collection</div>
            <div className = "notes-box-container">
                {displayNotes}
            </div>
        </div>
    );
};
export default DoctorsNotes;