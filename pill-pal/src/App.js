import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import MedicalQuestionnaire from './components/MedicalQuestionnaire';
import ProviderQuestionnaire from './components/ProviderQuestionnaire';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatientDashboard from './components/PatientDashboard';
import ProviderDashboard from './components/ProviderDashboard';
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
                        <Route path="patient-dashboard" element = {< Dashboard/>}/>
                        <Route path="doctors-notes" element = {<div>Doctor's Notes</div>}/>
                        <Route path="messages" element = {<div>Messages</div>}/>
                        <Route path="medications" element = {<PatientDashboard />}/>
                        <Route path="requests" element = {<div>Requests</div>}/>
                    </Route>
                </Routes>

            </div>
        </Router>
    );
}

export default App;