import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import App from "./App";
import "./index.css"; // Keep the original index.css import
// global styles (was tailwind previously)
import './styles/global.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Performance optimizations
if (process.env.NODE_ENV === 'development') {
  // Disable React DevTools in development to reduce overhead
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    isDisabled: true,
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
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Optimized rendering strategy
const initializeApp = () => {
  // Use requestIdleCallback with shorter timeout to reduce message handler time
  if (window.requestIdleCallback) {
    requestIdleCallback(renderApp, { timeout: 500 });
  } else {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(renderApp);
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
