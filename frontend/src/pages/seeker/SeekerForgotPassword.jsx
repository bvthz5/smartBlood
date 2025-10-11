import React, { useState } from "react";
import { Link } from "react-router-dom";
import seekerService from "../../services/seekerService";
import Nav from "../../components/Nav";

export default function SeekerForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await seekerService.forgotPassword(emailOrPhone);
      setSuccess("If the account exists, password reset instructions have been sent.");
    } catch (err) {
      setError(err?.response?.data?.error || "Request failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seeker-forgot-page">
      <Nav />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Forgot Password</h1>
            <p>Enter your registered email or phone</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email_or_phone">Email or Phone Number</label>
              <input
                type="text"
                id="email_or_phone"
                name="email_or_phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter your email or phone number"
                required
                autoComplete="email"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Submitting..." : "Send Reset Instructions"}
            </button>

            <div className="form-footer">
              <Link to="/seeker/login" className="forgot-password">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
