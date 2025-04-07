import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import MedicalQuestionnaire from './components/MedicalQuestionnaire';
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
      </div>
    </Router>
  );
}

export default App;
