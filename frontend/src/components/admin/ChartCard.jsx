import React from 'react';
import './ChartCard.css';

const ChartCard = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  loading = false,
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`chart-card ${className} loading`}>
        <div className="chart-header">
          <div className="chart-title skeleton"></div>
          {subtitle && <div className="chart-subtitle skeleton"></div>}
        </div>
        <div className="chart-content">
          <div className="chart-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
        {actions && (
          <div className="chart-actions">
            {actions}
          </div>
        )}
      </div>
      <div className="chart-content">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
