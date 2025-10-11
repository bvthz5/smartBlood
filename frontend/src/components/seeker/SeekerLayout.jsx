import React, { useEffect } from 'react';
import './SeekerLayout.css';

const SeekerLayout = ({ navbar, sidebar, children }) => {
  useEffect(() => {
    document.body.classList.add('seeker');
    return () => document.body.classList.remove('seeker');
  }, []);
  return (
    <div className="seeker-grid">
      <header className="seeker-navbar-fixed">{navbar}</header>
      <aside className="seeker-sidebar-fixed">{sidebar}</aside>
      <main className="seeker-content-scroll">{children}</main>
    </div>
  );
};

export default SeekerLayout;
