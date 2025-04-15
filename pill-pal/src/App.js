import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import MedicalQuestionnaire from './components/MedicalQuestionnaire';
import ProviderQuestionnaire from './components/ProviderQuestionnaire';
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
                    <Route path="/patient-dashboard" element={<PatientDashboard />} />
                    <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                    <Route path="/" element={<Navigate to="/auth" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;