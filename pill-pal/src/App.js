import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import MedicalQuestionnaire from './components/MedicalQuestionnaire';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/questionnaire" element={<MedicalQuestionnaire />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          {/* Add more routes as needed */}
        </Routes>

        <Routes>
          <Route path="/home" element = {< Navbar />}>
            <Route path="dashboard" element = {< Dashboard/>}/>
            <Route path="doctors-notes" element = {<div>Doctor's Notes</div>}/>
            <Route path="messages" element = {<div>Messages</div>}/>
            <Route path="people" element = {<div>People</div>}/>
            <Route path="requests" element = {<div>Requests</div>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
