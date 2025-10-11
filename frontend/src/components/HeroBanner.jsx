// src/components/HeroBanner.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import { syncHeaderAlertHeights } from "../utils/layoutOffsets";
import { scheduleTask, scheduleLowPriorityTask } from "../utils/taskScheduler";
import "./HeroBanner.module.css";

export default function HeroBanner({ language }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const heroRef = useRef(null);

  const contentRef = useRef(null);
  const textContentRef = useRef(null);
  const imageRef = useRef(null);

  const images = [
    {
      src: "/banner1.png",
      alt: "Blood donation campaign - Save lives through donation",
      title: language === "en" ? "Blood Donation" : "രക്തദാനം",
      description: language === "en" ? "Save Lives" : "ജീവിതങ്ങൾ രക്ഷിക്കുക",
      theme: "Celebration",
    },
    {
      src: "/banner2.png",
      alt: "Community blood drive - Join our network",
      title: language === "en" ? "Join Network" : "നെറ്റ്‌വർക്കിൽ ചേരുക", 
      description: language === "en" ? "Be a Hero" : "ഹീറോ ആകുക",   
      theme: "Community",
    },
    {
      src: "/banner3.png",
      alt: "Emergency blood request - Help when needed",
      title: language === "en" ? "Emergency Blood" : "അടിയന്തര രക്തം", 
      description: language === "en" ? "Urgent Need" : "അടിയന്തര ആവശ്യം", 
      theme: "Emergency",
    },
    {
      src: "/banner4.png",
      alt: "Blood donation awareness - Together we save lives",
      title: language === "en" ? "Spread Awareness" : "അവബോധം പരത്തുക", 
      description: language === "en" ? "Make a Difference" : "വ്യത്യാസം വരുത്തുക",   
      theme: "Awareness",
    },
    {
      src: "/banner5.png",
      alt: "Blood bank services - Professional healthcare",
      title: language === "en" ? "Quality Healthcare" : "നിലവാര ആരോഗ്യസേവനം", 
      description: language === "en" ? "Reliable Supply" : "വിശ്വസനീയ വിതരണം",   
      theme: "Healthcare",
    },
    {
      src: "/banner6.png",
      alt: "Motivational message - Donate blood, save lives",
      title: language === "en" ? "Donate Today" : "ഇന്ന് ദാനം ചെയ്യുക", 
      description: language === "en" ? "Inspire Hope" : "പ്രതീക്ഷ പകരുക", 
      theme: "Motivation",
    },
    {
      src: "/banner7.png",
      alt: "Healthcare support - Together we make a difference",
      title: language === "en" ? "Healthcare Support" : "ആരോഗ്യസേവന പിന്തുണ", 
      description: language === "en" ? "United We Stand" : "ഒന്നിച്ച് നിൽക്കുന്നു", 
      theme: "Support",
    },
  ];
  

  useEffect(() => {
    let timeoutId;
    const scheduleNext = () => {
      // Use requestIdleCallback to prevent blocking the main thread
      if (window.requestIdleCallback) {
        requestIdleCallback(() => {
          timeoutId = setTimeout(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
            scheduleNext(); // Schedule the next transition
          }, 5000);
        }, { timeout: 1000 });
      } else {
        timeoutId = setTimeout(() => {
          setCurrentImage((prev) => (prev + 1) % images.length);
          scheduleNext(); // Schedule the next transition
        }, 5000);
      }
    };
    
    scheduleNext();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [images.length]);

  // Disable GSAP animations to eliminate performance violations
  // useEffect(() => {
  //   if (textContentRef.current && currentImage > 0) {
  //     gsap.fromTo(textContentRef.current,
  //       { opacity: 0, x: 30 },
  //       { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
  //     );
  //   }
  // }, [currentImage]);

  // Ensure text content is visible immediately on mount
  useEffect(() => {
    const ensureTextVisible = () => {
      if (textContentRef.current) {
        // Use CSS custom properties to avoid forced reflows
        const root = document.documentElement;
        root.style.setProperty('--text-opacity', '1');
        root.style.setProperty('--text-transform', 'translateX(0) translateY(0) scale(1) rotate(0deg)');
        root.style.setProperty('--text-display', 'block');
        root.style.setProperty('--text-visibility', 'visible');
        
        // Apply the custom properties to the element
        textContentRef.current.style.opacity = "var(--text-opacity)";
        textContentRef.current.style.transform = "var(--text-transform)";
        textContentRef.current.style.display = "var(--text-display)";
        textContentRef.current.style.visibility = "var(--text-visibility)";
      }
    };

    // Set immediately
    ensureTextVisible();
    
    // Use task scheduler for better performance
    scheduleLowPriorityTask(ensureTextVisible);
  }, []);

  // Sync layout offsets when component mounts
  useEffect(() => {
    syncHeaderAlertHeights();
  }, []);

  // Track dark mode theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    
    // Check initial theme
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;

    // Disable GSAP animations to eliminate performance violations
    // gsap.set(contentRef.current, { opacity: 0, y: 60 });
    
    // Ensure text content is immediately visible and not affected by any animations
    // Use CSS custom properties to avoid forced reflows
    if (textContentRef.current) {
      // gsap.set(textContentRef.current, { 
      //   opacity: 1, 
      //   x: 0,
      //   y: 0,
      //   scale: 1,
      //   rotation: 0,
      //   force3D: true // Force hardware acceleration
      // });
      // Use CSS custom properties instead of direct style manipulation
      const root = document.documentElement;
      root.style.setProperty('--text-opacity', '1');
      root.style.setProperty('--text-transform', 'translateX(0) translateY(0) scale(1) rotate(0deg)');
    }

    // Disable hero content animation
    // gsap.to(contentRef.current, {
    //   opacity: 1,
    //   y: 0,
    //   duration: 1.2,
    //   ease: "power3.out",
    //   delay: 0.3,
    // });

    // Disable ScrollTrigger to eliminate performance violations
    // ScrollTrigger.create({
    //   trigger: heroRef.current,
    //   start: "top top",
    //   end: "bottom top",
    //   scrub: 2,
    //   onUpdate: (self) => {
    //     const progress = self.progress;
    //     requestAnimationFrame(() => {
    //       if (heroRef.current) {
    //         heroRef.current.style.transform = `translate3d(0, ${progress * 20}px, 0)`;
    //       }
    //     });
    //   },
    // });

    return () => {
      // ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <header
      ref={heroRef}
      className="hero-outer"
      style={{
        backgroundImage: isDarkMode 
          ? 'none' 
          : `url(${images[currentImage].src})`,
        backgroundSize: isDarkMode 
          ? 'initial' 
          : "contain",
        backgroundPosition: isDarkMode 
          ? 'initial' 
          : "center center",
        backgroundRepeat: isDarkMode 
          ? 'initial' 
          : "no-repeat",
        backgroundColor: isDarkMode 
          ? '#1a1a1a' 
          : 'transparent',
      }}
    >
      <div className="hero-gradient-overlay" aria-hidden="true"></div>

      <div
        ref={textContentRef}
        className="hero-overlay-text"
        role="region"
        aria-label="Dynamic Content"
        style={{
          position: "absolute",
          top: "60px",
          right: "60px",
          zIndex: 25,
          maxWidth: "250px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <div className="hero-text-content" style={{ 
          textAlign: "center",
          color: "#2c3e50",
          marginTop: "-15px",
          marginRight: "70px",
          opacity: 1,
          transform: "translateX(0)"
        }}>
          <div className="hero-text-title" style={{ 
            fontSize: "1.3rem", 
            fontWeight: "800", 
            color: "#e74c3c", 
            marginBottom: "8px", 
            lineHeight: "1.2",
            textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)"
          }}>
            {images[currentImage].title}
          </div>
          <div className="hero-text-description" style={{ 
            fontSize: "1rem", 
            color: "#34495e", 
            lineHeight: "1.4",
            fontWeight: "600",
            textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)"
          }}>
            {images[currentImage].description}
          </div>
        </div>
      </div>

      <div className="hero-inner">
        <div
          ref={contentRef}
          className="hero-content"
          role="region"
          aria-label="Hero"
        >
          <h1 className="hero-title" style={{ 
            transform: "translateX(30px)",
            fontSize: "2.8rem",
            fontWeight: "800",
            lineHeight: "1.2",
            marginTop: "4px",
            marginLeft: "10px"
          }}>
            {language === "en"
              ? "Give Blood. Save Lives."
              : "രക്തം ദാനം ചെയ്യുക"}
          </h1>

          <p
            className="hero-subtitle"
            style={{ 
              transform: "translateX(-200px)",
              fontSize: "1.2rem",
              fontWeight: "500",
              lineHeight: "1.4",
              marginBottom: "2rem",
              marginRight: "662px"
            }}
          >
            {language === "en"
              ? "Join Kerala's real-time blood donor network."
              : "കേരള രക്ത ദാനി നെറ്റ്‌വർക്ക്"}
          </p>

          <div
            className="hero-ctas"
            style={{ transform: "translateX(20px) translateY(5px)" }}
          >
            <Link
              to="/seeker/login"
              className="btn btn--primary btn--large"
              style={{ transform: "translateX(5px) translateY(5px)" }}
            >
              {language === "en" ? "Become a Donor" : "ഒരു ദാനിയായി മാറുക"}
            </Link>

            <Link
              to="/seeker/login"
              className="btn btn--outline btn--large"
              style={{ 
                transform: "translateX(10px) translateY(5px)",
                background: "#9c02021c",
                transition: "all 0.3s ease",
                marginLeft: "10px"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgb(240 0 0 / 78%)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#9c02021c";
              }}
            >
              {language === "en"
                ? "Find Blood (Hospitals)"
                : "രക്തം കണ്ടെത്തുക"}
            </Link>
          </div>
        </div>

        <div
          className="carousel-controls"
          style={{ transform: "translateX(15px)" }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${
                index === currentImage ? "active" : ""
              }`}
              onClick={() => setCurrentImage(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
