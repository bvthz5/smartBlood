import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  LogOut, 
  Home, 
  Users, 
  Building2, 
  Heart, 
  History, 
  Settings, 
  User,
  ChevronDown,
  Droplets,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import MetricCard from '../../components/dashboard/MetricCard';
import ChartCard from '../../components/dashboard/ChartCard';
import ActivityTable from '../../components/dashboard/ActivityTable';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const AdminDashboardFuturistic = () => {
  const { user } = useSelector((state) => state.admin);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const profileRef = useRef(null);
  const passwordRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (passwordRef.current && !passwordRef.current.contains(event.target)) {
        setChangePasswordOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock data for demonstration
  const dashboardData = {
    stats: {
      totalDonors: 1247,
      activeDonors: 892,
      totalHospitals: 45,
      pendingRequests: 23,
      completedDonations: 156,
      totalRequests: 89
    },
    recentRequests: [
      {
        id: 1,
        type: 'request',
        donor: 'John Smith',
        hospital: 'City General Hospital',
        bloodGroup: 'A+',
        units: 2,
        status: 'pending',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'donation',
        donor: 'Sarah Johnson',
        hospital: 'Metro Medical Center',
        bloodGroup: 'O-',
        units: 1,
        status: 'completed',
        time: '4 hours ago'
      },
      {
        id: 3,
        type: 'request',
        donor: 'Mike Wilson',
        hospital: 'Regional Hospital',
        bloodGroup: 'B+',
        units: 3,
        status: 'in-progress',
        time: '6 hours ago'
      },
      {
        id: 4,
        type: 'donation',
        donor: 'Emily Davis',
        hospital: 'University Hospital',
        bloodGroup: 'AB+',
        units: 1,
        status: 'completed',
        time: '8 hours ago'
      },
      {
        id: 5,
        type: 'request',
        donor: 'David Brown',
        hospital: 'Community Health Center',
        bloodGroup: 'O+',
        units: 2,
        status: 'pending',
        time: '10 hours ago'
      }
    ]
  };

  // Chart data
  const bloodGroupData = {
    labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    datasets: [{
      data: [25, 8, 20, 6, 5, 2, 30, 4],
      backgroundColor: [
        '#FF6B6B',
        '#FF8A80',
        '#2196F3',
        '#64B5F6',
        '#9C27B0',
        '#BA68C8',
        '#4CAF50',
        '#81C784'
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const monthlyDonationsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Donations',
      data: [45, 52, 38, 67, 73, 89],
      borderColor: '#FF6B6B',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }]
  };

  const requestStatusData = {
    labels: ['Completed', 'Pending', 'In Progress', 'Cancelled'],
    datasets: [{
      data: [65, 23, 8, 4],
      backgroundColor: [
        '#4CAF50',
        '#FF9800',
        '#2196F3',
        '#F44336'
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 107, 107, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 107, 107, 0.1)'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      }
    }
  };

  const currentTime = new Date().toLocaleTimeString();
  const currentDate = new Date().toLocaleDateString();

  const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Donors', count: 12 },
    { icon: Building2, label: 'Hospitals', count: 3 },
    { icon: Heart, label: 'Blood Requests', count: 8 },
    { icon: History, label: 'Donation History' },
    { icon: Settings, label: 'Settings' }
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Handle password change logic here
    console.log('Password change submitted:', passwordData);
    setChangePasswordOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="professional-dashboard">
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Droplets className="logo-icon" size={32} />
            <span className="logo-text">BloodFlow</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <button key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.count && (
                <span className="notification-badge">{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Admin User'}</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <Home size={16} />
              <span>/</span>
              <span className="breadcrumb-current">Dashboard</span>
            </div>
          </div>

          <div className="header-center">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search donors, hospitals, requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            
            <div 
              className="user-menu" 
              ref={profileRef}
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <div className="user-avatar-small">
                <User size={16} />
              </div>
              <span className="user-name-small">{user?.name || 'Admin'}</span>
              <ChevronDown size={16} />
              
              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="user-avatar-dropdown">
                      <User size={20} />
                    </div>
                    <div className="user-info-dropdown">
                      <div className="user-name-dropdown">{user?.name || 'Admin User'}</div>
                      <div className="user-email-dropdown">{user?.email || 'admin@bloodflow.com'}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item">
                    <User size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setChangePasswordOpen(true);
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <Lock size={16} />
                    <span>Change Password</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Change Password Modal */}
        {changePasswordOpen && (
          <div className="modal-overlay">
            <div className="modal-content" ref={passwordRef}>
              <div className="modal-header">
                <h2 className="modal-title">Change Password</h2>
                <button 
                  className="modal-close"
                  onClick={() => setChangePasswordOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="password-input"
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="password-input"
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="password-input"
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setChangePasswordOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main className="dashboard-content">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Welcome back, <span className="highlight">{user?.name || 'Admin'}</span>
              </h1>
              <p className="welcome-subtitle">
                Here's what's happening with your blood management system today.
              </p>
            </div>
            <div className="welcome-meta">
              <div className="meta-item">
                <Calendar size={16} />
                <span>{currentDate}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{currentTime}</span>
              </div>
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="metrics-grid">
            <MetricCard
              title="Total Donors"
              value={dashboardData.stats.totalDonors}
              icon={Users}
              trend="+12%"
              type="primary"
            />
            <MetricCard
              title="Active Donors"
              value={dashboardData.stats.activeDonors}
              icon={Activity}
              trend="+8%"
              type="success"
            />
            <MetricCard
              title="Total Hospitals"
              value={dashboardData.stats.totalHospitals}
              icon={Building2}
              trend="+2"
              type="info"
            />
            <MetricCard
              title="Pending Requests"
              value={dashboardData.stats.pendingRequests}
              icon={Heart}
              trend="-5%"
              type="warning"
            />
            <MetricCard
              title="Completed Donations"
              value={dashboardData.stats.completedDonations}
              icon={TrendingUp}
              trend="+15%"
              type="success"
            />
            <MetricCard
              title="Total Requests"
              value={dashboardData.stats.totalRequests}
              icon={Heart}
              trend="+3%"
              type="primary"
            />
          </section>

          {/* Charts Section */}
          <section className="charts-section">
            <div className="charts-grid">
              <ChartCard title="Blood Group Distribution">
                <Pie data={bloodGroupData} options={pieOptions} />
              </ChartCard>
              <ChartCard title="Monthly Donations">
                <Line data={monthlyDonationsData} options={chartOptions} />
              </ChartCard>
              <ChartCard title="Request Status">
                <Bar data={requestStatusData} options={chartOptions} />
              </ChartCard>
            </div>
          </section>

          {/* Activity Section */}
          <section className="activity-section">
            <ActivityTable 
              title="Recent Blood Requests" 
              data={dashboardData.recentRequests}
              filter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardFuturistic;