import React from 'react';
import './KpiCard.css';

const KpiCard = ({ title, value, accent = 'default', icon = null, delay = 0 }) => {
  return (
    <div className={`kpi-card ${accent}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-top">
        <div className="kpi-title">{title}</div>
        {icon && <div className="kpi-icon">{icon}</div>}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-underline" />
    </div>
  );
};

export default React.memo(KpiCard);
