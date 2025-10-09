import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLoading from './AdminLoading';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  
  const { theme, themes, changeTheme, currentTheme } = useTheme();
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful login
      localStorage.setItem('adminToken', 'mock-admin-token');
      
      // Show loading page before navigating
      setShowLoadingPage(true);
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Theme selector component
  const ThemeSelector = () => (
    <div className="theme-selector">
      <div className="theme-selector-label">Choose Theme:</div>
      <div className="theme-options">
        {themes.map(themeName => (
          <button
            key={themeName}
            className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
            onClick={() => changeTheme(themeName)}
            style={{
              background: currentTheme === themeName ? theme.colors.primary : 'transparent',
              color: currentTheme === themeName ? '#fff' : theme.colors.textSecondary,
              border: `2px solid ${currentTheme === themeName ? theme.colors.primary : theme.colors.border}`
            }}
          >
            {themes[themeName].name}
          </button>
        ))}
      </div>
    </div>
  );

  // Handle loading page completion
  const handleLoadingComplete = () => {
    navigate('/admin/dashboard');
  };

  // Show loading page if login was successful
  if (showLoadingPage) {
    return <AdminLoading onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="admin-login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
        <div className="floating-elements">
          <div className="floating-element" style={{ '--delay': '0s' }}>🩸</div>
          <div className="floating-element" style={{ '--delay': '2s' }}>💉</div>
          <div className="floating-element" style={{ '--delay': '4s' }}>🏥</div>
          <div className="floating-element" style={{ '--delay': '6s' }}>❤️</div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">💉</div>
            <div className="logo-text">SmartBlood</div>
            <div className="logo-tagline">Life Saver Management System</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message general-error">
              <AlertCircle size={16} />
              {errors.general}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">
              <Mail size={16} />
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="admin@smartblood.com"
                disabled={isSubmitting}
              />
              {!errors.email && formData.email && (
                <CheckCircle size={16} className="input-success" />
              )}
            </div>
            {errors.email && (
              <div className="error-message">
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">
              <Lock size={16} />
              Password
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={14} />
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Authenticating...
              </>
            ) : (
              <>
                🚀 ACCESS DASHBOARD
              </>
            )}
          </button>

          <div className="helper-links">
            <button type="button" className="helper-link">
              🔑 Forgot Password?
            </button>
            <button type="button" className="helper-link">
              📞 Need Help?
            </button>
          </div>
        </form>

        <ThemeSelector />
      </div>
    </div>
  );
};

export default AdminLogin;
