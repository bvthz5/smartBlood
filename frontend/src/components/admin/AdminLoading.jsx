import React, { useEffect, useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { scheduleTask, scheduleLowPriorityTask } from '../../utils/taskScheduler';
import './AdminLoading.css';

const AdminLoading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing SmartBlood System...');
  const { theme } = useTheme();

  const loadingSteps = [
    { text: 'Initializing SmartBlood System...', duration: 1000 },
    { text: 'Loading Dashboard Components...', duration: 800 },
    { text: 'Connecting to Blood Database...', duration: 600 },
    { text: 'Preparing Analytics Engine...', duration: 500 },
    { text: 'Welcome, Admin! 🎉', duration: 400 }
  ];

  useEffect(() => {
    let currentStep = 0;
    let totalDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;
    let animationId;

    const animate = () => {
      // Use task scheduler to prevent long tasks
      scheduleTask(() => {
        elapsed += 100; // Reduced frequency from 50ms to 100ms
        const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(newProgress);

        // Update text based on progress - optimized loop
        let stepProgress = 0;
        for (let i = 0; i < loadingSteps.length; i++) {
          stepProgress += loadingSteps[i].duration;
          if (elapsed <= stepProgress) {
            setCurrentText(loadingSteps[i].text);
            break;
          }
        }

        if (newProgress >= 100) {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          // Use task scheduler for completion callback
          scheduleLowPriorityTask(() => onComplete && onComplete());
        } else {
          animationId = requestAnimationFrame(animate);
        }
      }, 'low');
    };

    // Start animation
    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onComplete]);

  // DISABLE all blood drops to eliminate long tasks
  const bloodDrops = useMemo(() => {
    // NO DROPS - completely disabled for performance
    return [];
  }, []);

  return (
    <div className="admin-loading">
      <div className="loading-background">
        <div className="blood-drops">
          {bloodDrops}
        </div>
        {/* DISABLE floating elements to eliminate long tasks */}
        {/* <div className="floating-elements">
          <div className="floating-element" style={{ '--delay': '0s' }}>💉</div>
          <div className="floating-element" style={{ '--delay': '1s' }}>🏥</div>
          <div className="floating-element" style={{ '--delay': '2s' }}>❤️</div>
          <div className="floating-element" style={{ '--delay': '3s' }}>🩺</div>
        </div> */}
      </div>

      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-container">
            <div className="logo-icon">💉</div>
            <div className="logo-pulse"></div>
          </div>
          <div className="logo-text">SmartBlood</div>
          <div className="logo-subtitle">Admin Panel</div>
        </div>

        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        <div className="loading-message">
          <div className="message-text">{currentText}</div>
          <div className="message-dots">
            <span className="dot" style={{ '--delay': '0s' }}>.</span>
            <span className="dot" style={{ '--delay': '0.2s' }}>.</span>
            <span className="dot" style={{ '--delay': '0.4s' }}>.</span>
          </div>
        </div>

        <div className="loading-stats">
          <div className="stat-item">
            <div className="stat-icon">👥</div>
            <div className="stat-text">1,247 Active Donors</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏥</div>
            <div className="stat-text">45 Partner Hospitals</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🩸</div>
            <div className="stat-text">256 Blood Units Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoading;
