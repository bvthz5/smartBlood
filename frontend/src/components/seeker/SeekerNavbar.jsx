import React, { useState, useRef, useEffect } from 'react';
import './SeekerNavbar.css';

const SeekerNavbar = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(3);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="seekernav">
      <div className="seekernav-left">
        <div className="brand">SmartBlood | <span>Seeker Portal</span></div>
      </div>
      <div className="seekernav-right" ref={ref}>
        <button className="icon-btn" title="Notifications">
          <span className="bell">🔔</span>
          {notif > 0 && <span className="badge">{notif}</span>}
        </button>
        <div className="profile">
          <button className="avatar" onClick={()=>setOpen(v=>!v)} title="Profile">👤</button>
          {open && (
            <div className="menu">
              <button onClick={()=>setOpen(false)}>View Profile</button>
              <button onClick={()=>setOpen(false)}>Settings</button>
              <div className="divider" />
              <button className="danger" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerNavbar;
