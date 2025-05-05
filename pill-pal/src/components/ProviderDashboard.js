import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './ProviderDashboard.css';


const ProviderDashboard = () => {
    const [accessiblePatients, setAccessiblePatients] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [patientToDelete, setPatientToDelete] = useState(null);

    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    const navigate = useNavigate();

    function handleDeleteClick(patient) {
        setPatientToDelete(patient);
    }
    
    function handleCancelDelete() {
        setPatientToDelete(null);
    }
    
    function handleConfirmDelete() {
    if (!patientToDelete || !userInfo?.username) return;

    fetch('/api/providers/deletepatient', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            providerUsername: userInfo.username,
            patientUsername: patientToDelete.username,
        }),
    })
    .then(response => {
        if (response.ok) {
            setAccessiblePatients(prev =>
                prev.filter(p => p.username !== patientToDelete.username)
            );
        } else {
            console.error('Failed to delete patient');
        }
        setPatientToDelete(null);
    })
    .catch(error => {
        console.error('Error deleting patient:', error);
        setPatientToDelete(null);
    });
}

    useEffect(() => {
        const fetchAccessiblePatients = async () => {
            try {
                const response = await fetch(`/api/providers/patients/${userInfo.username}`);
                if (response.ok) {
                    const data = await response.json();
                    setAccessiblePatients(data);
                } else {
                    console.error('Failed to fetch accessible patients');
                }
            } catch (error) {
                console.error('Error fetching accessible patients:', error);
            }
        };

        const fetchAllPatients = async () => {
            try {
                const response = await fetch('/api/patients/patients');
                if (response.ok) {
                    const data = await response.json();
                    setAllPatients(data.sort((a, b) => a.Name.localeCompare(b.Name)));
                } else {
                    console.error('Failed to fetch all patients');
                }
            } catch (error) {
                console.error('Error fetching all patients:', error);
            }
        };

        fetchAccessiblePatients();
        fetchAllPatients();
    }, [userInfo]);

    const filteredPatients = allPatients.filter(patient =>
        patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstRow, indexOfLastRow);

    function deletePatient(){console.log('test atd');}

    return (
        <div className='provider-dashboard-container'>
            <div className="provider-dashboard">
                <h1>Provider Dashboard</h1>

                <section>
                <h2>Accessible Patients</h2>
                <ul className="accesssible-patients-container">
                    {accessiblePatients.map((patient, index) => (
                        <li className = "provider-list-options"key={index}>
                            <button className = "provider-list-group-item"
                                cursor = "pointer"
                                onClick={async () => {
                                    try {
                                        const response = await fetch(`/api/activitylogger/logactivity`, {
                                            method : 'POST',
                                            headers: { 'Content-Type':'application/json' },
                                            body   : JSON.stringify({
                                                username: userInfo.username,
                                                action  : 'viewed',
                                                target  : 'patient',
                                                targetId: patient.username,   
                                            })
                                            });
                                            if (!response.ok) {
                                                console.log('Failed to log sending the node');
                                            }  
                                    } catch (error) {
                                        console.error('Error logging sending note:', error);
                                    }
                                    navigate(`/provider/patient/${patient.username}`)}} // Navigate to patient details page
                            >
                                {patient.username} - {patient.Name} - {patient.Gender} - {(patient.DateOfBirth.split('T'))[0]}
                            </button>
                            <svg
                                cursor="pointer"
                                onClick={() => handleDeleteClick(patient)}
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                className="bi bi-x-circle"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </li>
                    ))}
                </ul>
            </section>
            {/* Confirmation Card */}
            {patientToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Are you sure you want to delete <b>{patientToDelete.username}</b>?</p>
                        <button onClick={handleConfirmDelete} className="yes-button">Yes</button>
                        <button onClick={handleCancelDelete} className="no-button">No</button>
                    </div>
                </div>
            )}

                <section>
                    <h2>All Patients</h2>
                    <input
                        type="text"
                        placeholder="Search patients by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar"
                    />
                    <table className="patients-table">
                        <thead>
                        <tr>
                            <th className="table-username">Username</th>
                            <th className="table-name">Full Name</th>
                            <th className="table-bdate">Date of Birth</th>
                            <th className="table-gender">Gender</th>
                            <th className="table-action">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentPatients.map((patient, index) => (
                            <tr key={index}>
                                <td>{patient.username}</td>
                                <td>{patient.Name}</td>
                                <td>{patient.DateOfBirth.split("T")[0]}</td>
                                <td>{patient.Gender}</td>
                                <td>
                                <button
    onClick={async () => {
        try {
            const response = await fetch(`/api/providers/requestaccess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providerUsername: userInfo.username,
                    patientUsername: patient.username,
                }),
            });
            if (!response.ok) {
                console.log('Failed to request access');
            }
        } catch (error) {
            console.error('Error requesting access:', error);
        }
    }}
    className="request-access-button"
>
    Request Access
</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <label>
                            Rows per page:
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    const newRowsPerPage = Number(e.target.value);
                                    setRowsPerPage(newRowsPerPage);
                                    const maxPage = Math.ceil(filteredPatients.length / newRowsPerPage);
                                    setCurrentPage((prevPage) => Math.min(prevPage, maxPage));
                                }}
                            >
                                {[5, 10, 20].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {Math.ceil(filteredPatients.length / rowsPerPage)}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, Math.ceil(filteredPatients.length / rowsPerPage))
                                )
                            }
                            disabled={currentPage === Math.ceil(filteredPatients.length / rowsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProviderDashboard;