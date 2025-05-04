import React, { useState, useEffect } from 'react';
import './ProviderNotes.css';
import Cookies from 'js-cookie';

const ProviderNotes = () => {

    const [providerNotes, setProviderNotes] = useState([]);

    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    // searching for user
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSend = () => {
        console.log('Sending email...');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Body:', body);
      };

    return (
        
        <div className = "provider-notes-container">
            <input
                        type="text"
                        placeholder="Search patient by name"
                        className = "note-composer-user-sarch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
            <div className="note-composer-container">
            <h2 className="note-composer-title">Write a Note</h2>
            <div className="note-composer-form-group">
                <label className="note-subgroup-header">To:</label>
                <input
                type="text"
                id="to"
                className="note-composer-input"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="username"
                />
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
            <button className="note-composer-send-button" onClick={handleSend}>Send</button>
            </div>
        </div>
      );

    /*return (
        <div className="provider-notes-container">
            {providerNotes.map((note, index) => (
                <div key={index} className="note-card">
                    <h3>{note.name}</h3>
                    <p>{note.subject}</p>
                    <p>{note.note}</p>
                </div>
            ))}
        </div>
    );*/
};

export default ProviderNotes;


