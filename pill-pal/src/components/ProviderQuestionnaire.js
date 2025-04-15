import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderQuestionnaire.css';

const ProviderQuestionnaire = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        yearsOfExperience: '',
        clinicAddress: '',
        contactNumber: '',
        certifications: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save provider data to a database or state
        navigate('/provider-dashboard');
    };

    return (
        <div className="questionnaire-container">
            <div className="questionnaire-box">
                <h2>Provider Information</h2>
                <p className="subtitle">Please provide your professional details</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialty">Specialty</label>
                        <input
                            type="text"
                            id="specialty"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="yearsOfExperience">Years of Experience</label>
                        <input
                            type="number"
                            id="yearsOfExperience"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="clinicAddress">Clinic Address</label>
                        <textarea
                            id="clinicAddress"
                            name="clinicAddress"
                            value={formData.clinicAddress}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input
                            type="text"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="certifications">Certifications</label>
                        <textarea
                            id="certifications"
                            name="certifications"
                            value={formData.certifications}
                            onChange={handleChange}
                            placeholder="List your certifications, separated by commas"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Continue to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProviderQuestionnaire;