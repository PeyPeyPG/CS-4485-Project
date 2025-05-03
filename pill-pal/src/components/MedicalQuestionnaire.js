import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MedicalQuestionnaire.css';

const MedicalQuestionnaire = () => {
  const navigate = useNavigate();
  const [isMetric, setIsMetric] = useState(true);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    allergies: '',
    currentMedications: '',
    medicalConditions: '',
    isPregnant: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming userType is stored in cookies or context
    const userType = 'patient'; // Replace with actual logic to determine userType
    navigate(userType === 'patient' ? '/dashboard' : '/provider-dashboard');
  };

  const toggleUnits = () => {
    setIsMetric(!isMetric);
    // Convert values when switching units
    if (formData.height) {
      setFormData(prev => ({
        ...prev,
        height: isMetric
            ? (parseFloat(prev.height) * 0.393701).toFixed(1) // cm to inches
            : (parseFloat(prev.height) * 2.54).toFixed(1) // inches to cm
      }));
    }
    if (formData.weight) {
      setFormData(prev => ({
        ...prev,
        weight: isMetric
            ? (parseFloat(prev.weight) * 2.20462).toFixed(1) // kg to lbs
            : (parseFloat(prev.weight) * 0.453592).toFixed(1) // lbs to kg
      }));
    }
  };

  return (
      <div className="questionnaire-container">
        <div className="questionnaire-box">
          <h2>Medical Information</h2>
          <p className="subtitle">Please provide your medical information to help us better serve you</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="0"
                  max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="units-toggle">
              <span>Units: </span>
              <button
                  type="button"
                  className="toggle-button"
                  onClick={toggleUnits}
              >
                {isMetric ? 'Metric (cm, kg)' : 'Imperial (in, lbs)'}
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="height">
                Height {isMetric ? '(cm)' : '(inches)'}
              </label>
              <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="0"
                  max={isMetric ? "300" : "120"}
                  step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">
                Weight {isMetric ? '(kg)' : '(lbs)'}
              </label>
              <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="0"
                  max={isMetric ? "500" : "1100"}
                  step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="allergies">Allergies (if any)</label>
              <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="List any allergies you have, separated by commas"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentMedications">Current Medications</label>
              <textarea
                  id="currentMedications"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  placeholder="List your current medications, separated by commas"
              />
            </div>

            <div className="form-group">
              <label htmlFor="medicalConditions">Medical Conditions</label>
              <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  placeholder="List any medical conditions you have, separated by commas"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                    type="checkbox"
                    name="isPregnant"
                    checked={formData.isPregnant}
                    onChange={handleChange}
                />
                Are you currently pregnant?
              </label>
            </div>

            <button type="submit" className="submit-button">
              Continue to Dashboard
            </button>
          </form>
        </div>
      </div>
  );
};

export default MedicalQuestionnaire; 