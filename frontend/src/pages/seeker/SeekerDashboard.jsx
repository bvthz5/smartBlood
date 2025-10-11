import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SeekerDashboard.css";

export default function SeekerDashboard() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890"
      });
      setRequests([
        {
          id: 1,
          bloodGroup: "A+",
          units: 2,
          urgency: "High",
          status: "Active",
          hospital: "City General Hospital",
          createdDate: "2024-01-15"
        },
        {
          id: 2,
          bloodGroup: "O+",
          units: 1,
          urgency: "Medium",
          status: "Matched",
          hospital: "Regional Medical Center",
          createdDate: "2024-01-10"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("seeker_access_token");
    localStorage.removeItem("seeker_refresh_token");
    localStorage.removeItem("user_type");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="seeker-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seeker-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h1>Welcome back, {user?.name}</h1>
              <p>Manage your blood requests and find matches</p>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/seeker/request" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
              </svg>
              New Request
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11H15V13H9V11ZM9 7H15V9H9V7ZM9 15H15V17H9V15ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Total Requests</h3>
              <p className="stat-number">{requests.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon active">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Active Requests</h3>
              <p className="stat-number">{requests.filter(r => r.status === 'Active').length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon matched">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Matched Requests</h3>
              <p className="stat-number">{requests.filter(r => r.status === 'Matched').length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p className="stat-number">{requests.filter(r => r.status === 'Completed').length}</p>
            </div>
          </div>
        </div>

        <div className="requests-section">
          <div className="section-header">
            <h2>Recent Requests</h2>
            <Link to="/seeker/requests" className="view-all-link">View All</Link>
          </div>

          <div className="requests-list">
            {requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-info">
                    <h3>{request.bloodGroup} Blood Request</h3>
                    <p className="hospital">{request.hospital}</p>
                  </div>
                  <div className="request-status">
                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                
                <div className="request-details">
                  <div className="detail-item">
                    <span className="label">Units Required:</span>
                    <span className="value">{request.units}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Urgency:</span>
                    <span className={`urgency ${request.urgency.toLowerCase()}`}>
                      {request.urgency}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Created:</span>
                    <span className="value">{request.createdDate}</span>
                  </div>
                </div>

                <div className="request-actions">
                  <button className="btn btn-sm btn-outline">View Details</button>
                  {request.status === 'Active' && (
                    <button className="btn btn-sm btn-primary">Update Request</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
