import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './SeekerSidebar.css';

const SeekerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('seeker_sidebar_collapsed');
    if (saved) setCollapsed(saved === '1');
  }, []);
  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('seeker_sidebar_collapsed', next ? '1' : '0');
  };
  return (
    <div className={`seekerside ${collapsed ? 'collapsed' : ''}`}>
      <div className="side-header">
        <button className="collapse" onClick={toggle} title="Toggle sidebar">≡</button>
      </div>
      <nav className="side-nav">
        <NavLink to="/seeker/dashboard" className="link">🏠 <span>Dashboard</span></NavLink>
        <div className="group">
          <div className="group-title">Blood Requests</div>
          <NavLink to="/seeker/requests/create" className="link">➕ <span>Create Request</span></NavLink>
          <NavLink to="/seeker/requests" className="link">📋 <span>View All Requests</span></NavLink>
        </div>
        <NavLink to="/seeker/matches" className="link">🤝 <span>Donor Matches</span></NavLink>
        <NavLink to="/seeker/hospital" className="link">🏥 <span>Hospital Info</span></NavLink>
        <NavLink to="/seeker/analytics" className="link">📈 <span>Analytics</span></NavLink>
        <NavLink to="/seeker/settings" className="link">⚙️ <span>Settings</span></NavLink>
      </nav>
    </div>
  );
};

export default SeekerSidebar;
