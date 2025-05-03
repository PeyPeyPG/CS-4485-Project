import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const MedicalProviders = () => {
    const [providers, setProviders] = useState([]);
    const [newProvider, setNewProvider] = useState('');
    const [accessGranted, setAccessGranted] = useState(false);

    useEffect(() => {
        // Fetch linked providers
        const fetchProviders = async () => {
            const response = await fetch('http://localhost:5000/api/patients/1/providers'); // Replace '1' with actual patient ID
            if (response.ok) {
                const data = await response.json();
                setProviders(data);
            }
        };
        fetchProviders();
    }, []);

    const handleAddProvider = async () => {
        if (newProvider.trim()) {
            const response = await fetch('http://localhost:5000/api/patients/1/providers', { // Replace '1' with actual patient ID
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ providerName: newProvider, accessGranted }),
            });

            if (response.ok) {
                const addedProvider = await response.json();
                setProviders([...providers, addedProvider]);
                setNewProvider('');
                setAccessGranted(false);
            } else {
                alert('Error adding provider');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Medical Providers</h1>
            <ul>
                {providers.map((provider, index) => (
                    <li key={index}>
                        {provider.name} - Access: {provider.accessGranted ? 'Granted' : 'Not Granted'}
                    </li>
                ))}
            </ul>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Add a new provider"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={accessGranted}
                        onChange={(e) => setAccessGranted(e.target.checked)}
                    />
                    Grant Access
                </label>
                <button onClick={handleAddProvider} className="submit-button">
                    Add Provider
                </button>
            </div>
        </div>
    );
};

export default MedicalProviders;