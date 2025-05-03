import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import MedicalQuestionnaire from './components/MedicalQuestionnaire';
import ProviderQuestionnaire from './components/ProviderQuestionnaire';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatientDashboard from './components/PatientDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import DoctorsNotes from './components/DoctorsNotes';
import MedicationStack from './components/MedicationStack';
import MedicalProviders from './components/MedicalProviders';
import Profile from './components/Profile';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/questionnaire" element={<MedicalQuestionnaire />} />
                    <Route path="/provider-questionnaire" element={<ProviderQuestionnaire />} />
                    <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                    <Route path="/" element={<Navigate to="/auth" replace />} />
                    <Route path="/home" element = {< Navbar />}>
                        <Route path="medication-stack" element={<MedicationStack />} />
                        <Route path="medical-providers" element={<MedicalProviders />} />
                        <Route path="patient-dashboard" element = {< Dashboard/>}/>
                        <Route path="doctors-notes" element = {< DoctorsNotes/>}/>
                        <Route path="profile" element = {< Profile/>}/>
                        <Route path="medications" element = {<PatientDashboard />}/>
                        <Route path="requests" element = {<div>Requests</div>}/>
                    </Route>
                </Routes>

            </div>
        </Router>
    );
}

export default App;