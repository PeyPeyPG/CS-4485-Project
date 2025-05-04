import React, { useState, useEffect } from 'react';
import './ProviderNotes.css';
import Cookies from 'js-cookie';

const ProviderNotes = () => {

    const [providerNotes, setProviderNotes] = useState([]);

    useEffect(() => {
            const fetchNotes = async () => {
                try {
                    const userInfo = Cookies.get('userInfo');
                    const username = userInfo ? JSON.parse(userInfo).username : null;       
                    const response = await fetch(`/api/dashboard/getprovidernotes/${username}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch provider\'s notes');
                    }
                    const notes = await response.json();
                    console.log('Provider\'s Notes:', notes);
                    setProviderNotes(notes); // Store the pinned notes in state
                } catch (err) {
                    console.error('Error fetching provider\'s notes:', err);
                }
            };
    
            fetchNotes();
        }, []);

    return (
        <div className="provider-notes-container">
            {providerNotes.map((note, index) => (
                <div key={index} className="note-card">
                    <h3>{note.name}</h3>
                    <p>{note.subject}</p>
                    <p>{note.note}</p>
                </div>
            ))}
        </div>
    );
};

export default ProviderNotes;


