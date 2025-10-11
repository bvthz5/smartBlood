import React from 'react';
import './ActivityFeed.css';

const ActivityFeed = ({ items = [] }) => {
  return (
    <div className="card feed">
      <div className="feed-header">Recent Activity</div>
      <div className="feed-list">
        {items.length === 0 ? (
          <div className="feed-empty">No recent activity</div>
        ) : (
          items.slice(0, 10).map((it, idx) => (
            <div key={idx} className="feed-item">
              <div className={`dot ${it.type || 'info'}`} />
              <div className="feed-body">
                <div className="feed-title">{it.title}</div>
                <div className="feed-meta">{it.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
