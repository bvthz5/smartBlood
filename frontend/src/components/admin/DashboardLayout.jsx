import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { throttle } from '../../utils/performance';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  // Keep sidebar collapsed all the time
  const sidebarCollapsed = true;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  // Handle mobile sidebar toggle (only for mobile)
  const handleMobileToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [children]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.navbar')) {
        setSidebarOpen(false);
      }
    };

    // Use throttled mouse handler for better performance
    const throttledHandleClickOutside = throttle(handleClickOutside, 16);
    
    document.addEventListener('mousedown', throttledHandleClickOutside, { passive: true });
    return () => document.removeEventListener('mousedown', throttledHandleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="dashboard-layout" data-theme={theme.name.toLowerCase()}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => {}} // No-op since sidebar is always collapsed
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Navbar */}
        <Navbar
          onToggleSidebar={handleMobileToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
