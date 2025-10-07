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

// Use requestIdleCallback for better performance
const renderApp = () => {
  const root = createRoot(document.getElementById("root"));
  
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

// Render immediately or when idle
if (window.requestIdleCallback) {
  requestIdleCallback(renderApp, { timeout: 2000 });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(renderApp, 0);
}
