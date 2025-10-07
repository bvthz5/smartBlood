import React from 'react';
import { MoreHorizontal, Download, Maximize2 } from 'lucide-react';
import './ChartCard.css';

const ChartCard = ({ title, children, subtitle }) => {
  return (
    <div className="chart-card">
      <div className="chart-glow"></div>
      
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
        <div className="chart-controls">
          <button className="chart-control-btn" title="Download">
            <Download size={16} />
          </button>
          <button className="chart-control-btn" title="Maximize">
            <Maximize2 size={16} />
          </button>
          <button className="chart-control-btn" title="More options">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          {children}
        </div>
      </div>

      <div className="chart-footer">
        <div className="chart-stats">
          <div className="stat-item">
            <div className="stat-label">Total</div>
            <div className="stat-value">1,247</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">This Month</div>
            <div className="stat-value">89</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Growth</div>
            <div className="stat-value">+12%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;