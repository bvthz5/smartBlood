import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './MetricCard.css';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon, 
  type = 'default',
  loading = false 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} />;
    if (trend === 'down') return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'positive';
    if (trend === 'down') return 'negative';
    return 'neutral';
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  if (loading) {
    return (
      <div className={`metric-card ${type} loading`}>
        <div className="metric-card-header">
          <div className="metric-icon skeleton"></div>
          <div className="metric-trend skeleton"></div>
        </div>
        <div className="metric-content">
          <div className="metric-value skeleton"></div>
          <div className="metric-title skeleton"></div>
          <div className="metric-subtitle skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`metric-card ${type}`}>
      <div className="metric-card-header">
        <div className="metric-icon">
          {icon}
        </div>
        {trend && (
          <div className={`metric-trend ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="metric-content">
        <div className="metric-value">
          {formatValue(value)}
        </div>
        <div className="metric-title">
          {title}
        </div>
        {subtitle && (
          <div className="metric-subtitle">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
