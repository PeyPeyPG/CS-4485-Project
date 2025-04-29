import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
    name: '',
    dateOfBirth: '',
    gender: 'male',
    height: '',
    weight: '',
    pregnancyStatus: 'false',
    profession: '',
    placeOfWork: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      
      Cookies.set('userInfo', JSON.stringify({
        username: formData.username,
        userType: data.userType
      }), { expires: 7 });

      if (isLogin) {
        navigate(data.userType === 'patient' ? '/home/patient-dashboard' : '/provider-dashboard');
      } else {
        navigate(data.userType === 'provider' ? '/provider-questionnaire' : '/questionnaire');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      Cookies.remove('userInfo');
      navigate('/auth');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
      <div className="auth-container">
        <div className="logo-container">
          <svg className="logo" viewBox="0 0 134 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG content */}
          </svg>
        </div>
        <div className="auth-box">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
              />
            </div>
            {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userType">Sign up as</label>
                    <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        required
                    >
                      <option value="patient">Patient</option>
                      <option value="provider">Provider</option>
                    </select>
                  </div>
                  {formData.userType === 'patient' && (
                      <>
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
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
                          <label htmlFor="dateOfBirth">Date of Birth</label>
                          <input
                              type="date"
                              id="dateOfBirth"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              required
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
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="height">Height (cm)</label>
                          <input
                              type="number"
                              id="height"
                              name="height"
                              value={formData.height}
                              onChange={handleChange}
                              required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="weight">Weight (kg)</label>
                          <input
                              type="number"
                              id="weight"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="pregnancyStatus">Pregnancy Status</label>
                          <select
                              id="pregnancyStatus"
                              name="pregnancyStatus"
                              value={formData.pregnancyStatus}
                              onChange={handleChange}
                              required
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </>
                  )}
                  {formData.userType === 'provider' && (
                      <>
                        <div className="form-group">
                          <label htmlFor="profession">Profession</label>
                          <input
                              type="text"
                              id="profession"
                              name="profession"
                              value={formData.profession}
                              onChange={handleChange}
                              required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="placeOfWork">Place of Work</label>
                          <input
                              type="text"
                              id="placeOfWork"
                              name="placeOfWork"
                              value={formData.placeOfWork}
                              onChange={handleChange}
                              required
                          />
                        </div>
                      </>
                  )}
                </>
            )}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
              />
            </div>
            {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                  />
                </div>
            )}
            <button type="submit" className="auth-button">
              <span>{isLogin ? 'Login' : 'Sign Up'}</span>
            </button>
          </form>
          <p className="toggle-auth">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
                className="toggle-button"
                onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
  );
};

export default Auth;