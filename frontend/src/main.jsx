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

createRoot(document.getElementById("root")).render(
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
