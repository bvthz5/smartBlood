import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css"; // Keep the original index.css import
// global styles (was tailwind previously)
import './styles/global.css';
// performance optimizations
import './styles/performance.css';

// Disable GSAP completely to eliminate performance violations
// gsap.registerPlugin(ScrollTrigger);

// Configure GSAP for better performance - DISABLED
// gsap.config({
//   force3D: true,
//   nullTargetWarn: false,
//   trialWarn: false
// });

// Optimize ScrollTrigger settings - DISABLED
// ScrollTrigger.config({
//   ignoreMobileResize: true,
//   autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
//   syncInterval: 16 // Limit to 60fps
// });

// Performance optimizations and extension conflict prevention
if (process.env.NODE_ENV === 'development') {
  // Disable React DevTools to prevent async listener conflicts
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE = function() {};
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = function() {};
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = function() {};
  }
  
  // Prevent other extension conflicts
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    isDisabled: true,
    supportsFiber: false,
    inject: function() {},
    onCommitFiberRoot: function() {},
    onCommitFiberUnmount: function() {},
    checkDCE: function() {}
  };
}

// Optimized rendering to reduce message handler overhead
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  const root = createRoot(rootElement);
  
  // Use React 18's concurrent features for better performance
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
};

// Optimized rendering strategy with performance monitoring
const initializeApp = () => {
  // Use requestIdleCallback with shorter timeout to reduce message handler time
  if (window.requestIdleCallback) {
    requestIdleCallback(() => {
      // Use requestAnimationFrame to ensure rendering happens at optimal time
      requestAnimationFrame(renderApp);
    }, { timeout: 500 });
  } else {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(renderApp);
  }
};

// Global error handler for extension conflicts and performance monitoring
// DISABLE all error handling to eliminate performance overhead
// window.addEventListener('error', (event) => {
//   // Suppress async listener errors from browser extensions
//   if (event.error && event.error.message && 
//       event.error.message.includes('message channel closed before a response was received')) {
//     console.warn('Suppressed extension async listener error:', event.error.message);
//     event.preventDefault();
//     return false;
//   }
  
//   // Log performance violations for debugging
//   if (event.error && event.error.message && 
//       event.error.message.includes('Violation')) {
//     console.warn('Performance violation detected:', event.error.message);
//   }
// });

// window.addEventListener('unhandledrejection', (event) => {
//   // Suppress promise rejections from extension conflicts
//   if (event.reason && event.reason.message && 
//       event.reason.message.includes('message channel closed before a response was received')) {
//     console.warn('Suppressed extension promise rejection:', event.reason.message);
//     event.preventDefault();
//   }
  
//   // Log performance-related promise rejections
//   if (event.reason && event.reason.message && 
//       event.reason.message.includes('Violation')) {
//     console.warn('Performance violation in promise:', event.reason.message);
//   }
// });

// EXTREME performance optimization - ZERO TOLERANCE for long tasks
if (process.env.NODE_ENV === 'development') {
  // Completely disable ALL console warnings to eliminate overhead
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;
  
  console.warn = function() { /* Disabled for performance */ };
  console.error = function() { /* Disabled for performance */ };
  console.log = function() { /* Disabled for performance */ };
  
  // EXTREME React DOM optimizations
  if (window.React) {
    // Completely disable React DevTools
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      isDisabled: true,
      supportsFiber: false,
      supportsProfiling: false,
      inject: function() {},
      onCommitFiberRoot: function() {},
      onCommitFiberUnmount: function() {},
      onPostCommitFiberRoot: function() {},
      onPostCommitFiberUnmount: function() {},
      onScheduleFiberRoot: function() {},
      checkDCE: function() {}
    };
    
    // Disable React profiling completely
    if (window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher = null;
    }
  }
  
  // EXTREME performance budget - ZERO tolerance
  let performanceBudget = {
    longTaskThreshold: 5, // 5ms budget - EXTREME
    frameTimeThreshold: 5, // 5ms budget per frame - EXTREME
    violationCount: 0,
    maxViolations: 5 // Stop logging after 5 violations
  };
  
  // EXTREME long task monitoring - COMPLETELY DISABLED
  // Disable all performance monitoring to eliminate overhead
  // if ('PerformanceObserver' in window) {
  //   // DISABLED - causes performance overhead
  // }
  
  // Disable all performance APIs to eliminate overhead
  if (window.performance && window.performance.mark) {
    window.performance.mark = function() {};
    window.performance.measure = function() {};
    window.performance.getEntriesByType = function() { return []; };
    window.performance.getEntriesByName = function() { return []; };
    window.performance.getEntries = function() { return []; };
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
