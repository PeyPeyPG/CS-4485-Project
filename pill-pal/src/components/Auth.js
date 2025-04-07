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
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // In a real application, you would make an API call here
    // For demo purposes, we'll just simulate authentication
    if (isLogin) {
      // Simulate login
      if (formData.username && formData.password) {
        Cookies.set('user', JSON.stringify({ username: formData.username }), { expires: 7 });
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields');
      }
    } else {
      // Simulate signup
      if (formData.username && formData.password && formData.email) {
        Cookies.set('user', JSON.stringify({ 
          username: formData.username,
          email: formData.email
        }), { expires: 7 });
        navigate('/questionnaire');
      } else {
        setError('Please fill in all fields');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <svg className="logo" viewBox="0 0 134 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M27.4005 70.2291C12.6346 63.3436 6.24624 45.7917 13.1317 31.0258L14.8222 27.4005C21.7076 12.6346 39.2596 6.24624 54.0255 13.1317L85.2931 27.712L58.6682 84.8094L27.4005 70.2291Z" fill="#E70000" stroke="black" strokeWidth="2"/>
          <path d="M59.5 85.5H122.5V120C122.5 136.292 109.292 149.5 93 149.5H89C72.7076 149.5 59.5 136.292 59.5 120V85.5Z" fill="white" stroke="black" strokeWidth="2"/>
          <path d="M77 74.5C77 67.0442 83.0442 61 90.5 61C97.9558 61 104 67.0442 104 74.5V85H77V74.5Z" fill="#9EC9F9" stroke="black" strokeWidth="2"/>
          <circle cx="91" cy="52" r="15" fill="#9EC9F9" stroke="black" strokeWidth="2"/>
          <rect x="93.9959" y="74.8882" width="29" height="6.35612" rx="3.17806" transform="rotate(-40 93.9959 74.8882)" fill="#9EC9F9" stroke="black" strokeWidth="2"/>
          <circle cx="121.5" cy="55.5" r="3.5" fill="#9EC9F9" stroke="black" strokeWidth="2"/>
          <path d="M123.707 45.4749C127.316 46.1117 130.141 48.9372 130.778 52.5459L130.071 53.253C129.434 49.6443 126.609 46.8188 123 46.182L123.707 45.4749Z" fill="black"/>
          <path d="M121.707 47.4749C125.316 48.1117 128.141 50.9372 128.778 54.5459L128.071 55.253C127.434 51.6443 124.609 48.8188 121 48.182L121.707 47.4749Z" fill="black"/>
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