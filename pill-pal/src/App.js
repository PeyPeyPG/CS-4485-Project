import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProviderDashboard from './components/ProviderDashboard';
import DoctorsNotes from './components/DoctorsNotes';
import MedicationStack from './components/MedicationStack';
import MedicalProviders from './components/MedicalProviders';
import Profile from './components/Profile';
import ProviderProfile from './components/ProviderProfile';
import ProviderNotes from './components/ProviderNotes';
import ProviderNavbar from './components/ProviderNavbar';
import PatientDetails from './components/PatientDetails'; // Import PatientDetails
import './App.css';

const RegistrationPrompt = ({ userType }) => {
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.isNewUser) {
            if (userType === 'patient') {
                alert('Welcome! Please add medications or providers via the available pages.');
            } else if (userType === 'provider') {
                alert('Welcome! Please request access to any patients you may have.');
            }
            localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, isNewUser: false }));
        }
    }, [userType]);

    return null;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route
                        path="/home/patient"
                        element={
                            <>
                                <Navbar />
                                <RegistrationPrompt userType="patient" />
                            </>
                        }
                    >
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="medication-stack" element={<MedicationStack />} />
                        <Route path="medical-providers" element={<MedicalProviders />} />
                        <Route path="doctors-notes" element={<DoctorsNotes />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                    <Route
                        path="/home/provider"
                        element={
                            <>
                                <ProviderNavbar />
                                <RegistrationPrompt userType="provider" />
                            </>
                        }
                    >
                        <Route path="dashboard" element={<ProviderDashboard />} />
                        <Route path="profile" element={<ProviderProfile />} />
                        <Route path="doctors-notes" element={<ProviderNotes/>}/>
                    </Route>
                    <Route path="/provider/patient/:username" element={<PatientDetails />} />
                    <Route path="/" element={<Navigate to="/auth" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;