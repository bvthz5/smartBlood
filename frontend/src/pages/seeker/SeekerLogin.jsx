import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import seekerService from "../../services/seekerService";
import Nav from "../../components/Nav";
import "./SeekerLogin.css";

export default function SeekerLogin() {
  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await seekerService.login(formData.email_or_phone, formData.password);
      if (data?.force_change) {
        // store temp token and go to activation
        if (data.temp_token) localStorage.setItem('seeker_temp_token', data.temp_token);
        localStorage.setItem('user_type', 'seeker');
        navigate('/seeker/activate-account');
      } else {
        // full access
        if (data.access_token) localStorage.setItem('seeker_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('seeker_refresh_token', data.refresh_token);
        localStorage.setItem('user_type', 'seeker');
        navigate('/seeker/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="seeker-login-page">
      <Nav />
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Seeker Login</h1>
            <p>Access your blood request portal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email_or_phone">Email or Phone Number</label>
        <input
          type="text"
          id="email_or_phone"
          name="email_or_phone"
          value={formData.email_or_phone}
          onChange={handleInputChange}
          placeholder="Enter your email or phone number"
          required
          autoComplete="email"
          className={error ? "error" : ""}
        />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className={error ? "error" : ""}
          />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="form-footer">
              <Link to="/seeker/forgot-password" className="forgot-password">
                Forgot your password?
              </Link>
              <span className="divider">|</span>
              <Link to="/seeker/register" className="register-link">
                Create a new account
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
