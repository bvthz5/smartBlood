import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import ActivityTable from './ActivityTable';
import { getCachedHomepageStats } from '../../services/homepageService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Initialize dashboard data immediately to prevent reflows
  useEffect(() => {
    // Set data immediately without any async operations
    setDashboardData(mockData);
    setLoading(false);
  }, []);

  // Mock dashboard data (fallback)
  const mockData = {
    metrics: [
      {
        title: 'Total Donors',
        value: 1247,
        subtitle: 'Active this month',
        trend: 'up',
        trendValue: '+12%',
        icon: '👥',
        type: 'donors'
      },
      {
        title: 'Partner Hospitals',
        value: 45,
        subtitle: 'Active partnerships',
        trend: 'up',
        trendValue: '+5%',
        icon: '🏥',
        type: 'hospitals'
      },
      {
        title: 'Blood Units',
        value: 256,
        subtitle: 'Available stock',
        trend: 'down',
        trendValue: '-8%',
        icon: '🩸',
        type: 'inventory'
      },
      {
        title: 'Pending Requests',
        value: 18,
        subtitle: 'Urgent: 5 critical',
        trend: 'up',
        trendValue: '+23%',
        icon: '📋',
        type: 'requests'
      },
      {
        title: 'Completed Donations',
        value: 892,
        subtitle: 'This quarter',
        trend: 'up',
        trendValue: '+15%',
        icon: '💚',
        type: 'donations'
      },
      {
        title: 'Critical Alerts',
        value: 7,
        subtitle: 'Require immediate action',
        trend: 'up',
        trendValue: '+3',
        icon: '🚨',
        type: 'alerts'
      }
    ],
    charts: {
      bloodGroups: [
        { group: 'A+', count: 312, color: '#FF6B6B' },
        { group: 'B+', count: 249, color: '#4ECDC4' },
        { group: 'O+', count: 374, color: '#45B7D1' },
        { group: 'AB+', count: 62, color: '#96CEB4' },
        { group: 'A-', count: 89, color: '#FECA57' },
        { group: 'B-', count: 67, color: '#FF9FF3' },
        { group: 'O-', count: 45, color: '#54A0FF' },
        { group: 'AB-', count: 23, color: '#5F27CD' }
      ],
      donationTrends: [
        { month: 'Jan', donations: 120 },
        { month: 'Feb', donations: 135 },
        { month: 'Mar', donations: 142 },
        { month: 'Apr', donations: 158 },
        { month: 'May', donations: 167 },
        { month: 'Jun', donations: 189 }
      ],
      hospitalDonations: [
        { hospital: 'City General', donations: 45 },
        { hospital: 'Metro Medical', donations: 38 },
        { hospital: 'Regional Hospital', donations: 32 },
        { hospital: 'University Hospital', donations: 28 },
        { hospital: 'Community Health', donations: 22 }
      ],
      requestAnalysis: [
        { status: 'Completed', count: 65, color: '#10B981' },
        { status: 'Pending', count: 23, color: '#F59E0B' },
        { status: 'Cancelled', count: 12, color: '#EF4444' }
      ]
    }
  };

  // Remove duplicate useEffect - data loading is handled above

  // Blood Group Distribution Chart Component - static data to prevent reflows
  const BloodGroupChart = React.memo(() => {
    // Static data to prevent any calculations during render
    const staticData = [
      { group: 'A+', count: 312, color: '#FF6B6B', percentage: '25.6' },
      { group: 'B+', count: 249, color: '#4ECDC4', percentage: '20.4' },
      { group: 'O+', count: 374, color: '#45B7D1', percentage: '30.6' },
      { group: 'AB+', count: 62, color: '#96CEB4', percentage: '5.1' },
      { group: 'A-', count: 89, color: '#FECA57', percentage: '7.3' },
      { group: 'B-', count: 67, color: '#FF9FF3', percentage: '5.5' },
      { group: 'O-', count: 45, color: '#54A0FF', percentage: '3.7' },
      { group: 'AB-', count: 23, color: '#5F27CD', percentage: '1.9' }
    ];

    return (
      <div className="blood-group-chart">
        <div className="chart-legend">
          {staticData.map((group) => (
            <div key={group.group} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: group.color }}
              />
              <span className="legend-label">{group.group}</span>
              <span className="legend-count">{group.count}</span>
              <span className="legend-percentage">
                ({group.percentage}%)
              </span>
            </div>
          ))}
        </div>
        <div className="chart-visual">
          <div className="pie-chart">
            <div className="pie-slice" style={{ background: 'conic-gradient(#FF6B6B 0deg 92deg, transparent 92deg)' }} />
            <div className="pie-slice" style={{ background: 'conic-gradient(#4ECDC4 92deg 165deg, transparent 165deg)', transform: 'rotate(92deg)' }} />
            <div className="pie-slice" style={{ background: 'conic-gradient(#45B7D1 165deg 275deg, transparent 275deg)', transform: 'rotate(165deg)' }} />
            <div className="pie-slice" style={{ background: 'conic-gradient(#96CEB4 275deg 293deg, transparent 293deg)', transform: 'rotate(275deg)' }} />
            <div className="pie-slice" style={{ background: 'conic-gradient(#FECA57 293deg 319deg, transparent 319deg)', transform: 'rotate(293deg)' }} />
            <div className="pie-slice" style={{ background: 'conic-gradient(#FF9FF3 319deg 339deg, transparent 339deg)', transform: 'rotate(319deg)' }} />
            <div className="pie-slice" style={{ background: 'conic-gradient(#54A0FF 339deg 352deg, transparent 352deg)', transform: 'rotate(339deg)' }} />
            <div className="pie-slice" style={{ background: 'conic-gradient(#5F27CD 352deg 360deg, transparent 360deg)', transform: 'rotate(352deg)' }} />
          </div>
        </div>
      </div>
    );
  });

  // Donation Trends Chart Component - static data to prevent reflows
  const DonationTrendsChart = React.memo(() => {
    // Static data with pre-calculated heights to prevent reflows
    const staticBars = [
      { month: 'Jan', donations: 120, height: '60%' },
      { month: 'Feb', donations: 135, height: '67.5%' },
      { month: 'Mar', donations: 142, height: '71%' },
      { month: 'Apr', donations: 158, height: '79%' },
      { month: 'May', donations: 167, height: '83.5%' },
      { month: 'Jun', donations: 189, height: '94.5%' }
    ];

    return (
      <div className="donation-trends-chart">
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-icon">📈</span>
            <span className="stat-text">15% increase this month</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-text">89% target achievement</span>
          </div>
        </div>
        <div className="line-chart">
          <div className="chart-bars">
            {staticBars.map((data) => (
              <div key={data.month} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ height: data.height }}
                />
                <div className="bar-value">{data.donations}</div>
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {staticBars.map(data => (
              <span key={data.month} className="chart-label">
                {data.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  });

  // Hospital Donations Chart Component - static data to prevent reflows
  const HospitalDonationsChart = React.memo(() => {
    // Static data with pre-calculated widths to prevent reflows
    const staticHospitals = [
      { hospital: 'City General', donations: 45, width: '90%' },
      { hospital: 'Metro Medical', donations: 38, width: '76%' },
      { hospital: 'Regional Hospital', donations: 32, width: '64%' },
      { hospital: 'University Hospital', donations: 28, width: '56%' },
      { hospital: 'Community Health', donations: 22, width: '44%' }
    ];

    return (
      <div className="hospital-donations-chart">
        <div className="chart-filters">
          <button className="filter-button active">Monthly</button>
          <button className="filter-button">Quarterly</button>
          <button className="filter-button">Yearly</button>
        </div>
        <div className="bar-chart">
          {staticHospitals.map((data) => (
            <div key={data.hospital} className="hospital-bar">
              <div className="hospital-label">{data.hospital}</div>
              <div className="hospital-bar-container">
                <div 
                  className="hospital-bar-fill"
                  style={{ width: data.width }}
                />
                <span className="hospital-count">{data.donations}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  });

  // Request Analysis Chart Component - static data to prevent reflows
  const RequestAnalysisChart = React.memo(() => {
    // Static data with pre-calculated values to prevent reflows
    const staticAnalysis = [
      { status: 'Completed', count: 65, color: '#10B981', height: '65%', opacity: 0.8 },
      { status: 'Pending', count: 23, color: '#F59E0B', height: '23%', opacity: 0.7 },
      { status: 'Cancelled', count: 12, color: '#EF4444', height: '12%', opacity: 0.6 }
    ];

    return (
      <div className="request-analysis-chart">
        <div className="chart-summary">
          {staticAnalysis.map((data) => (
            <div key={data.status} className="summary-item">
              <div 
                className="summary-color" 
                style={{ backgroundColor: data.color }}
              />
              <span className="summary-label">{data.status}</span>
              <span className="summary-count">{data.count}%</span>
            </div>
          ))}
        </div>
        <div className="area-chart">
          <div className="chart-area">
            {staticAnalysis.map((data) => (
              <div
                key={data.status}
                className="area-segment"
                style={{
                  height: data.height,
                  backgroundColor: data.color,
                  opacity: data.opacity
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  });

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-logo">💉</div>
          <div className="loading-text">Loading SmartBlood Dashboard...</div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Failed to load dashboard data</div>
          <div className="error-subtitle">Please try refreshing the page</div>
          <button className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome to SmartBlood Admin</h1>
          <p className="welcome-subtitle">Monitor and manage your blood donation network</p>
        </div>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <span className="stat-number">12</span>
            <span className="stat-label">Donations Today</span>
          </div>
          <div className="welcome-stat">
            <span className="stat-number">3</span>
            <span className="stat-label">Urgent Requests</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {dashboardData.metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            loading={loading}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <ChartCard 
          title="Blood Group Distribution" 
          subtitle="Distribution of blood types in the system"
        >
          <BloodGroupChart />
        </ChartCard>

        <ChartCard 
          title="Monthly Donation Trends" 
          subtitle="Donation patterns over the last 6 months"
        >
          <DonationTrendsChart />
        </ChartCard>

        <ChartCard 
          title="Hospital-wise Donations" 
          subtitle="Donation performance by hospital"
        >
          <HospitalDonationsChart />
        </ChartCard>

        <ChartCard 
          title="Request Status Analysis" 
          subtitle="Breakdown of request completion rates"
        >
          <RequestAnalysisChart />
        </ChartCard>
      </div>

      {/* Activity Table */}
      <div className="activity-section">
        <ActivityTable 
          loading={loading}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
