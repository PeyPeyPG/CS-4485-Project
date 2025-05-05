import React, { useState, useEffect } from 'react';
import './ProviderNotes.css';
import Cookies from 'js-cookie';

const ProviderNotes = () => {
    const [providerNotes, setProviderNotes] = useState([]);
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [patients, setPatients] = useState([]); // State to store the list of patients

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const userInfo = Cookies.get('userInfo');
                const username = userInfo ? JSON.parse(userInfo).username : null;

                const response = await fetch(`/api/providers/patients/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }

                const data = await response.json();
                setPatients(data); // Store the fetched patients in state
            } catch (err) {
                console.error('Error fetching patients:', err);
            }
        };

        fetchPatients();
    }, []);

    const handleSend = async () => {
        const username = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')).username : null;
        try {
            const response = await fetch('/api/providers/writenote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    patientUsername: to,
                    subject: subject,
                    note: body,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send note');
            }
        } catch (err) {
            console.error('Error sending note:', err);
        }

        try {
            const response = await fetch(`/api/activitylogger/logactivity`, {
                method : 'POST',
                headers: { 'Content-Type':'application/json' },
                body   : JSON.stringify({
                    username: username,
                    action  : 'add',
                    target  : 'Note',
                    targetId: to,   
                })
                });
                if (!response.ok) {
                    console.log('Failed to log sending the node');
                }  
        } catch (error) {
            console.error('Error logging sending note:', error);
        }
    };

    return (
        <div className="provider-notes-container">
            <div className="note-composer-container">
                <h2 className="note-composer-title">Write a Note</h2>

                <div className="note-composer-form-group">
                    <label className="note-subgroup-header">To:</label>
                    <select
                        id="to"
                        className="note-composer-input"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    >
                        <option value="">Select a Patient</option>
                        {patients.map((patient) => (
                            <option key={patient.username} value={patient.username}>
                                {patient.Name} ({patient.username})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="note-composer-form-group">
                    <label className="note-subgroup-header">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        className="note-composer-input"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter subject"
                    />
                </div>

                <div className="note-composer-form-group">
                    <label className="note-subgroup-header">Body:</label>
                    <textarea
                        id="body"
                        className="note-composer-textarea"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write your message here..."
                    ></textarea>
                </div>

                <button className="note-composer-send-button" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ProviderNotes;


