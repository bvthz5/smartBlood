// src/components/HeroBanner.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { syncHeaderAlertHeights } from '../utils/layoutOffsets'
import './HeroBanner.module.css'

export default function HeroBanner({ language }) {
  const [currentImage, setCurrentImage] = useState(0)
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)
  
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1586772002606-0c6a6a7b7c52?q=80&w=1200&h=400&auto=format&fit=crop',
      alt: 'Blood donation campaign - Save lives through donation'
    },
    {
      src: 'https://images.unsplash.com/photo-1580281657525-12b4a8b3f0ee?q=80&w=1200&h=400&auto=format&fit=crop', 
      alt: 'Community blood drive - Join our network'
    },
    {
      src: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1200&h=400&auto=format&fit=crop',
      alt: 'Emergency blood request - Help when needed'
    },
    {
      src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&h=400&auto=format&fit=crop',
      alt: 'Blood bank services - Professional healthcare'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  // Sync layout offsets when component mounts
  useEffect(() => {
    syncHeaderAlertHeights()
  }, [])

  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return

    // Set initial states
    gsap.set(contentRef.current, { opacity: 0, y: 60 })

    // Hero content animation
    gsap.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3
    })

    // Subtle parallax effect on scroll - optimized to prevent forced reflows
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        // Use transform instead of backgroundPosition to avoid forced reflows
        gsap.to(heroRef.current, {
          y: progress * 20,
          duration: 0.1,
          ease: "none",
          force3D: true // Force hardware acceleration
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <header 
      ref={heroRef} 
      className="hero-outer" 
      style={{ 
        backgroundImage: `url(${images[currentImage].src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-gradient-overlay" aria-hidden="true"></div>
      
      <div className="hero-inner">
        <div ref={contentRef} className="hero-content" role="region" aria-label="Hero">
          <h1 className="hero-title">
            {language === 'en' ? 'Give Blood. Save Lives.' : 'രക്തം ദാനം ചെയ്യുക. ജീവിതങ്ങൾ രക്ഷിക്കുക.'}
          </h1>
          <p className="hero-subtitle">
            {language === 'en' 
              ? "Join Kerala's real-time blood donor network." 
              : "കേരളത്തിന്റെ റിയൽ-ടൈം രക്ത ദാനി നെറ്റ്‌വർക്കിൽ ചേരുക."}
          </p>
          <div className="hero-ctas">
            <Link to="/donor/register" className="btn btn--primary btn--large">
              {language === 'en' ? 'Become a Donor' : 'ഒരു ദാനിയായി മാറുക'}
            </Link>
            <Link to="/seeker/request" className="btn btn--outline btn--large">
              {language === 'en' ? 'Find Blood (Hospitals)' : 'രക്തം കണ്ടെത്തുക (ആശുപത്രികൾ)'}
            </Link>
          </div>
        </div>
        
        <div className="carousel-controls">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </header>
  )
}
