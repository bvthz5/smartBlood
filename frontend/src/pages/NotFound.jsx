// src/pages/NotFound.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { initialize404Page, trackCTAClick, lazyLoadAnimation } from '../utils/notFoundAnalytics';
import '../styles/not-found.css';

export default function NotFound() {
  const location = useLocation();
  const svgRef = useRef(null);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Analytics tracking
  useEffect(() => {
    initialize404Page(location.pathname, document.referrer);
  }, [location.pathname]);

  // Handle CTA click tracking
  const handleCTAClick = (label) => {
    trackCTAClick(label, location.pathname);
  };

  // Lazy load animation
  useEffect(() => {
    lazyLoadAnimation(() => {
      setAnimationLoaded(true);
    });
  }, []);

  return (
    <div className="page-404">
      {/* Main Content */}
      <main className="page-404__main">
        <div className="page-404__container">
          {/* Extraordinary 404 Typography */}
          <div className="page-404__hero">
            <div className="page-404__number-container">
              <svg 
                ref={svgRef}
                className={`page-404__svg ${animationLoaded ? 'loaded' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''}`}
                viewBox="0 0 800 400" 
                aria-hidden="true"
                role="img"
                aria-label="404 Error Animation"
              >
                {/* Professional Gradients and Filters */}
                <defs>
                  {/* Realistic Blood Gradient */}
                  <radialGradient id="bloodGradient" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ff4757" stopOpacity="1" />
                    <stop offset="30%" stopColor="#c83b3b" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#8b0000" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#5c0000" stopOpacity="0.7" />
                  </radialGradient>
                  
                  {/* Liquid Glass Effect */}
                  <linearGradient id="liquidGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                  </linearGradient>
                  
                  {/* Deep Shadow */}
                  <radialGradient id="deepShadow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                  </radialGradient>
                  
                  {/* Volumetric Glow Filter */}
                  <filter id="volumetricGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.8  0 0.2 0 0 0.2  0 0 0.2 0 0.2  0 0 0 1 0" result="redBlur"/>
                    <feMerge> 
                      <feMergeNode in="redBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  {/* Realistic Shadow Filter */}
                  <filter id="realisticShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
                    <feOffset dx="4" dy="8" result="offset"/>
                    <feFlood floodColor="rgba(0,0,0,0.4)"/>
                    <feComposite in2="offset" operator="in"/>
                    <feMerge>
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  {/* Liquid Reflection Filter */}
                  <filter id="liquidReflection" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.9  0 0.9 0 0 0.9  0 0 0.9 0 0.9  0 0 0 0.6 0" result="highlight"/>
                    <feMerge> 
                      <feMergeNode in="highlight"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Cinematic Background */}
                <rect width="100%" height="100%" fill="url(#deepShadow)" />
                
                {/* Ambient Light Source */}
                <radialGradient id="ambientLight" cx="50%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="rgba(200, 59, 59, 0.15)" />
                  <stop offset="50%" stopColor="rgba(200, 59, 59, 0.08)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0.05)" />
                </radialGradient>
                <ellipse cx="400" cy="120" rx="300" ry="200" fill="url(#ambientLight)" className="page-404__ambient-light" />

                {/* Professional 404 Typography - Proper Layout */}
                <g className="page-404__number-group">
                  
                  {/* First 4 - Left Side */}
                  <g className="page-404__number-4-group" transform="translate(80, 50) scale(4)">
                    <path 
                      className="page-404__number-4"
                      d="M13.719 1.375v15.438h2.781v2.25h-2.781v6.531h-2.219v-6.531h-10.219zM5.594 16.813h5.906v-8.344z"
                      fill="url(#bloodGradient)"
                      filter="url(#realisticShadow)"
                    />
                    {/* Liquid glass highlight */}
                    <path 
                      className="page-404__number-4-highlight"
                      d="M13.719 1.375v15.438h2.781v2.25h-2.781v6.531h-2.219v-6.531h-10.219zM5.594 16.813h5.906v-8.344z"
                      fill="url(#liquidGlass)"
                      opacity="0.6"
                    />
                  </g>

                  {/* Central Zero - Perfectly Centered */}
                  <g className="page-404__zero-group" transform="translate(360, 80) scale(1.4)" style={{transformOrigin: 'center'}}>
                    <path 
                      className="page-404__zero"
                      d="M192.82129,50.2793C177.64941,25.23682,155.23437,12,128,12S78.35059,25.23682,63.17871,50.2793C50.81055,70.69238,44,98.294,44,128c0,29.70361,6.81055,57.30469,19.17773,77.71777C78.35059,230.76221,100.76562,244,128,244s49.64941-13.23779,64.82227-38.28223C205.18945,185.30469,212,157.70361,212,128,212,98.294,205.18945,70.69238,192.82129,50.2793ZM128,220c-41.44727,0-60-46.20654-60-92s18.55273-92,60-92,60,46.20654,60,92S169.44727,220,128,220Z"
                      fill="url(#bloodGradient)"
                      filter="url(#realisticShadow)"
                    />
                    
                    {/* Liquid glass highlight for zero */}
                    <path 
                      className="page-404__zero-highlight"
                      d="M192.82129,50.2793C177.64941,25.23682,155.23437,12,128,12S78.35059,25.23682,63.17871,50.2793C50.81055,70.69238,44,98.294,44,128c0,29.70361,6.81055,57.30469,19.17773,77.71777C78.35059,230.76221,100.76562,244,128,244s49.64941-13.23779,64.82227-38.28223C205.18945,185.30469,212,157.70361,212,128,212,98.294,205.18945,70.69238,192.82129,50.2793ZM128,220c-41.44727,0-60-46.20654-60-92s18.55273-92,60-92,60,46.20654,60,92S169.44727,220,128,220Z"
                      fill="url(#liquidGlass)"
                      opacity="0.4"
                    />
                    
                    {/* Blood Drop - Centered in Zero */}
                    <g className="page-404__blood-drop-group" transform="translate(64, 64) scale(0.7)">
                      <path 
                        className="page-404__blood-drop"
                        d="M88.04 44.26C75.44 28.81 69.87 15.67 66.68 7.83c-1.01-2.47-4.36-2.47-5.36 0c-3.19 7.84-8.76 20.98-21.36 36.43c-7.89 9.68-15.67 23.85-15.67 37.81c0 23.82 17.19 39.95 39.71 39.95s39.71-16.14 39.71-39.95c0-14.51-7.78-28.13-15.67-37.81z"
                        fill="#e5322e"
                        filter="url(#volumetricGlow)"
                      />
                      <path 
                        className="page-404__blood-drop-highlight"
                        d="M74.98 79.84c6.35-12.08 5.45-23.9 10.47-21.77c6.82 2.91 14.37 17.86 11.54 31.41c-2.02 9.66-8.54 15.51-16.85 12.72c-6.71-2.25-10.88-11.48-5.16-22.36z"
                        fill="#ff6050"
                        filter="url(#liquidReflection)"
                      />
                    </g>
                  </g>

                  {/* Second 4 - Right Side */}
                  <g className="page-404__number-4-group-2" transform="translate(720, 50) scale(4)">
                    <path 
                      className="page-404__number-4-second"
                      d="M13.719 1.375v15.438h2.781v2.25h-2.781v6.531h-2.219v-6.531h-10.219zM5.594 16.813h5.906v-8.344z"
                      fill="url(#bloodGradient)"
                      filter="url(#realisticShadow)"
                    />
                    {/* Liquid glass highlight */}
                    <path 
                      className="page-404__number-4-highlight-2"
                      d="M13.719 1.375v15.438h2.781v2.25h-2.781v6.531h-2.219v-6.531h-10.219zM5.594 16.813h5.906v-8.344z"
                      fill="url(#liquidGlass)"
                      opacity="0.6"
                    />
                  </g>
                </g>

                {/* Realistic Particle System */}
                <g className="page-404__particles">
                  <circle className="page-404__particle" cx="100" cy="80" r="3" fill="#ff4757" opacity="0.7" />
                  <circle className="page-404__particle" cx="700" cy="90" r="2" fill="#c83b3b" opacity="0.6" />
                  <circle className="page-404__particle" cx="150" cy="320" r="2.5" fill="#8b0000" opacity="0.5" />
                  <circle className="page-404__particle" cx="650" cy="310" r="2" fill="#ff4757" opacity="0.6" />
                  <circle className="page-404__particle" cx="80" cy="200" r="1.5" fill="#c83b3b" opacity="0.4" />
                  <circle className="page-404__particle" cx="720" cy="220" r="3" fill="#8b0000" opacity="0.7" />
                </g>

                {/* Volumetric Light Rays */}
                <g className="page-404__light-rays">
                  <path 
                    className="page-404__light-ray"
                    d="M 400 50 L 350 150 L 450 150 Z"
                    fill="rgba(255, 71, 87, 0.1)"
                    opacity="0.3"
                  />
                  <path 
                    className="page-404__light-ray"
                    d="M 400 50 L 300 200 L 500 200 Z"
                    fill="rgba(200, 59, 59, 0.08)"
                    opacity="0.2"
                  />
                </g>
              </svg>
            </div>

            {/* Stylish Content */}
            <div className="page-404__content">
              <div className="page-404__oops">
                <span className="page-404__oops-text">Oops...</span>
                <span className="page-404__oops-dot">.</span>
                <span className="page-404__oops-dot">.</span>
                <span className="page-404__oops-dot">.</span>
              </div>
              <h1 className="page-404__title">
                Page Not Found
              </h1>
              <p className="page-404__subtitle">
                The page you're looking for seems to have wandered off. 
                Let's get you back to saving lives.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="page-404__actions">
            <Link 
              to="/" 
              className="page-404__cta page-404__cta--primary"
              onClick={() => handleCTAClick('return_home')}
            >
              <svg className="page-404__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Return Home
            </Link>

            <div className="page-404__secondary-actions">
              <Link 
                to="/seeker/request" 
                className="page-404__cta page-404__cta--secondary"
                onClick={() => handleCTAClick('find_blood')}
              >
                <svg className="page-404__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Find Blood
              </Link>

              <Link 
                to="/donor/register" 
                className="page-404__cta page-404__cta--secondary"
                onClick={() => handleCTAClick('donate_blood')}
              >
                <svg className="page-404__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Donate Blood
              </Link>

              <Link 
                to="/contact" 
                className="page-404__cta page-404__cta--secondary"
                onClick={() => handleCTAClick('contact_support')}
              >
                <svg className="page-404__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact Support
              </Link>
            </div>
          </div>

          {/* Quick Search */}
          <div className="page-404__search">
            <p className="page-404__search-label">Looking for something specific?</p>
            <div className="page-404__search-suggestions">
              <Link to="/about" className="page-404__search-link">About Us</Link>
              <Link to="/faq" className="page-404__search-link">FAQ</Link>
              <Link to="/policies" className="page-404__search-link">Policies</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="page-404__footer">
        <div className="page-404__footer-content">
          <p className="page-404__footer-text">
            Smart Blood Connect — Connecting lives, saving futures
          </p>
        </div>
      </footer>
    </div>
  );
}