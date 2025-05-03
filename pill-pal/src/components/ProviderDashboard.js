import React, { useState, useEffect } from 'react';
import ProviderNavbar from './ProviderNavbar';
import Cookies from 'js-cookie';
import './Dashboard.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

const ProviderDashboard = () => {
    const [accessiblePatients, setAccessiblePatients] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    useEffect(() => {
        const fetchAccessiblePatients = async () => {
            try {
                const response = await fetch(`/api/patients/patients/${userInfo.username}/providers`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
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

    const handleRequestAccess = async (patientUsername) => {
        try {
            const response = await fetch(`/api/patients/patients/${patientUsername}/providers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ providerName: userInfo.username }),
            });

            if (response.ok) {
                alert('Access request sent successfully');
            } else {
                alert('Failed to send access request');
            }
        } catch (error) {
            console.error('Error requesting access:', error);
        }
    };

    const filteredPatients = allPatients.filter(patient =>
        patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstRow, indexOfLastRow);

    return (
        <div>
            <div className="provider-dashboard">
                <h1>Provider Dashboard</h1>

                <section>
                    <h2>Accessible Patients</h2>
                    <ul>
                        
                        {accessiblePatients.map((patient, index) => (
                            <li class="list-group-item" key={index}>

                                {patient.Name} - {patient.Gender} - {(patient.DateOfBirth.split('T'))[0]}
                            </li>
                        ))}
                    </ul>
                </section>

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
                            <th>Full Name</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentPatients.map((patient, index) => (
                            <tr key={index}>
                                <td>{patient.Name}</td>
                                <td>{patient.DateOfBirth}</td>
                                <td>{patient.Gender}</td>
                                <td>
                                    <button
                                        onClick={() => handleRequestAccess(patient.username)}
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
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
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