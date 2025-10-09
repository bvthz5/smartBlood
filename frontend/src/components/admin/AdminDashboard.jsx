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

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const stats = await getCachedHomepageStats();
        
        if (stats) {
          setDashboardData({
            metrics: [
              {
                title: 'Total Donors',
                value: stats.donors_registered || 0,
                subtitle: 'Active donors',
                trend: 'up',
                trendValue: '+12%',
                icon: '👥',
                type: 'donors'
              },
              {
                title: 'Partner Hospitals',
                value: stats.active_hospitals || 0,
                subtitle: 'Active partnerships',
                trend: 'up',
                trendValue: '+5%',
                icon: '🏥',
                type: 'hospitals'
              },
              {
                title: 'Blood Units',
                value: stats.units_collected || 0,
                subtitle: 'Total collected',
                trend: 'up',
                trendValue: '+8%',
                icon: '🩸',
                type: 'inventory'
              },
              {
                title: 'Districts Covered',
                value: stats.districts_covered || 0,
                subtitle: 'Geographic reach',
                trend: 'up',
                trendValue: '+3%',
                icon: '📍',
                type: 'coverage'
              }
            ]
          });
        } else {
          // Fallback to mock data
          setDashboardData(mockData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err);
        setDashboardData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const refreshInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
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

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDashboardData(mockData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Blood Group Distribution Chart Component
  const BloodGroupChart = () => (
    <div className="blood-group-chart">
      <div className="chart-legend">
        {dashboardData.charts.bloodGroups.map((group) => (
          <div key={group.group} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: group.color }}
            />
            <span className="legend-label">{group.group}</span>
            <span className="legend-count">{group.count}</span>
            <span className="legend-percentage">
              ({((group.count / 1221) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
      <div className="chart-visual">
        <div className="pie-chart">
          {dashboardData.charts.bloodGroups.map((group, index) => {
            const percentage = (group.count / 1221) * 100;
            const rotation = dashboardData.charts.bloodGroups
              .slice(0, index)
              .reduce((acc, g) => acc + (g.count / 1221) * 360, 0);
            
            return (
              <div
                key={group.group}
                className="pie-slice"
                style={{
                  background: `conic-gradient(${group.color} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                  transform: `rotate(${rotation}deg)`
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  // Donation Trends Chart Component
  const DonationTrendsChart = () => (
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
          {dashboardData.charts.donationTrends.map((data) => (
            <div key={data.month} className="chart-bar">
              <div 
                className="bar-fill"
                style={{ height: `${(data.donations / 200) * 100}%` }}
              />
              <div className="bar-value">{data.donations}</div>
            </div>
          ))}
        </div>
        <div className="chart-labels">
          {dashboardData.charts.donationTrends.map(data => (
            <span key={data.month} className="chart-label">
              {data.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  // Hospital Donations Chart Component
  const HospitalDonationsChart = () => (
    <div className="hospital-donations-chart">
      <div className="chart-filters">
        <button className="filter-button active">Monthly</button>
        <button className="filter-button">Quarterly</button>
        <button className="filter-button">Yearly</button>
      </div>
      <div className="bar-chart">
        {dashboardData.charts.hospitalDonations.map((data) => (
          <div key={data.hospital} className="hospital-bar">
            <div className="hospital-label">{data.hospital}</div>
            <div className="hospital-bar-container">
              <div 
                className="hospital-bar-fill"
                style={{ width: `${(data.donations / 50) * 100}%` }}
              />
              <span className="hospital-count">{data.donations}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Request Analysis Chart Component
  const RequestAnalysisChart = () => (
    <div className="request-analysis-chart">
      <div className="chart-summary">
        {dashboardData.charts.requestAnalysis.map((data) => (
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
          {dashboardData.charts.requestAnalysis.map((data, index) => (
            <div
              key={data.status}
              className="area-segment"
              style={{
                height: `${data.count}%`,
                backgroundColor: data.color,
                opacity: 0.8 - (index * 0.1)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

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
