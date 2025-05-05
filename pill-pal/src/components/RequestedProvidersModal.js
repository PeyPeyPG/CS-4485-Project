import React, { useState } from 'react';

function RequestedProvidersModal({ patientUsername, show, onClose }) {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (show && patientUsername) {
            setLoading(true);
            fetch(`/api/patients/${patientUsername}/requested-providers`)
                .then(res => res.json())
                .then(data => {
                    setProviders(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [show, patientUsername]);

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Providers Requesting Access</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : providers.length === 0 ? (
                    <p>No providers have requested access.</p>
                ) : (
                    <ul>
                        {providers.map((provider, idx) => (
                            <li key={idx}>
                                <b>{provider.Name}</b> ({provider.username})
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default RequestedProvidersModal;