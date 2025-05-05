import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './ProviderDashboard.css';

const MedicalProviders = () => {
    const [yourProviders, setYourProviders] = useState([]);
    const [allProviders, setAllProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;

    useEffect(() => {
        const fetchYourProviders = async () => {
            try {
                const response = await fetch(`/api/patients/patients/${userInfo.username}/providers`);
                if (response.ok) {
                    const data = await response.json();
                    setYourProviders(data);
                } else {
                    console.error('Failed to fetch your providers');
                }
            } catch (error) {
                console.error('Error fetching your providers:', error);
            }
        };

        const fetchAllProviders = async () => {
            try {
                const response = await fetch('/api/providers/providers');
                if (response.ok) {
                    const data = await response.json();
                    setAllProviders(data.sort((a, b) => a.Name.localeCompare(b.Name)));
                    //setAllProviders(data);
                } else {
                    console.error('Failed to fetch all providers');
                }
            } catch (error) {
                console.error('Error fetching all providers:', error);
            }
        };

        fetchYourProviders();
        fetchAllProviders();
    }, [userInfo]);

    const handleAddProvider = async (providerUsername) => {
        try {
            const response = await fetch(`/api/patients/${userInfo.username}/addprovider`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ providerUsername: providerUsername }),
            });

            if (response.ok) {
                setYourProviders((prev) => [
                    ...prev,
                    allProviders.find((provider) => provider.username === providerUsername),
                ]);
            } else {
                alert('Failed to add provider');
            }
        } catch (error) {
            console.error('Error adding provider:', error);
        }
    };

    const filteredProviders = allProviders.filter(provider =>
        provider.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentProviders = filteredProviders.slice(indexOfFirstRow, indexOfLastRow);

    const deleteProvider = async () => {}

    return (
        <div className="provider-dashboard-container">
            <div className="provider-dashboard">
                <h1>Medical Providers</h1>

                <section>
                    <h2>Your Providers</h2>
                    <ul className="accesssible-patients-container">
                        {yourProviders.map((provider, index) => (
                            <li cursor="pointer" className="patient-list-group-item" key={index}>
                                {provider.username} - {provider.Name} - {provider.profession} - {provider.placeOfWork} {<svg cursor = "pointer" onClick = {() => deleteProvider()} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>}
                                
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>All Providers</h2>
                    <input
                        type="text"
                        placeholder="Search providers by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar"
                    />
                    <table className="patients-table">
                        <thead>
                        <tr>
                            <th className="table-username">Username</th>
                            <th className="table-name">Full Name</th>
                            <th className="table-profession">Profession</th>
                            <th className="table-workplace">Place of Work</th>
                            <th className="table-action">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentProviders.map((provider, index) => (
                            <tr key={index}>
                                <td>{provider.username}</td>
                                <td>{provider.Name}</td>
                                <td>{provider.profession}</td>
                                <td>{provider.placeOfWork}</td>
                                <td>
                                    <button
                                        onClick={() => handleAddProvider(provider.username)}
                                        className="request-access-button"
                                    >
                                        Add Provider
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
                                    const maxPage = Math.ceil(filteredProviders.length / newRowsPerPage);
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
                            Page {currentPage} of {Math.ceil(filteredProviders.length / rowsPerPage)}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, Math.ceil(filteredProviders.length / rowsPerPage))
                                )
                            }
                            disabled={currentPage === Math.ceil(filteredProviders.length / rowsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MedicalProviders;