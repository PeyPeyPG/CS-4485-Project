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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      Cookies.set('user', JSON.stringify(data), { expires: 7 });

      if (isLogin) {
        // Navigate directly to the dashboard after login
        navigate(data.userType === 'patient' ? '/patient-dashboard' : '/provider-dashboard');
      } else {
        // Navigate to the appropriate questionnaire after registration
        navigate(data.userType === 'provider' ? '/provider-questionnaire' : '/questionnaire');
      }
    } catch (err) {
      setError(err.message);
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