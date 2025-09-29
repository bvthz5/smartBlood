// src/components/AlertsBar.jsx
import React, { useState, useEffect, useRef } from 'react'

export default function AlertsBar({ language }) {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)
  const containerRef = useRef(null)
  
  const emergencyMessages = language === 'en' ? [
    "🚨 Urgent Need: O+ in Trivandrum (2 units). [Click to Help]",
    "🚨 Emergency: A- blood needed in Kochi (1 unit). [Donate Now]",
    "🚨 Critical: B+ platelets required in Kozhikode (3 units). [Urgent]"
  ] : [
    "🚨 അടിയന്തരം: തിരുവനന്തപുരത്ത് O+ രക്തം (2 യൂണിറ്റ്). [സഹായിക്കാൻ ക്ലിക്ക് ചെയ്യുക]",
    "🚨 അടിയന്തരം: കൊച്ചിയിൽ A- രക്തം ആവശ്യം (1 യൂണിറ്റ്). [ഇപ്പോൾ രക്തം ദാനം ചെയ്യുക]",
    "🚨 നിർണായകം: കോഴിക്കോട് B+ പ്ലേറ്റ്ലെറ്റുകൾ ആവശ്യം (3 യൂണിറ്റ്). [അടിയന്തരം]"
  ]

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % emergencyMessages.length)
      }, 6000) // 6 seconds display time
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isHovered, emergencyMessages.length])

  const goToPrevious = () => {
    setCurrentMessage((prev) => (prev - 1 + emergencyMessages.length) % emergencyMessages.length)
  }

  const goToNext = () => {
    setCurrentMessage((prev) => (prev + 1) % emergencyMessages.length)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      goToPrevious()
    } else if (event.key === 'ArrowRight') {
      goToNext()
    }
  }

  return (
    <div 
      className="alerts-bar" 
      role="alert" 
      aria-live="polite" 
      style={{ zIndex: 1000 }}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Emergency blood alerts"
    >
      <div className="alerts-bar__container">
        <button
          className="alerts-bar__nav-btn alerts-bar__nav-btn--prev"
          onClick={goToPrevious}
          aria-label="Previous alert"
          title="Previous alert"
        >
          ◀
        </button>
        
        <div className="alerts-bar__content">
          <span className="alerts-bar__icon" aria-hidden="true">🚨</span>
          <span className="alerts-bar__text">
            {emergencyMessages[currentMessage]}
          </span>
        </div>

        <div className="alerts-bar__controls">
          <div className="alerts-bar__indicators">
            {emergencyMessages.map((_, index) => (
              <button
                key={index}
                className={`alerts-bar__indicator ${index === currentMessage ? 'active' : ''}`}
                onClick={() => setCurrentMessage(index)}
                aria-label={`Go to alert ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          className="alerts-bar__nav-btn alerts-bar__nav-btn--next"
          onClick={goToNext}
          aria-label="Next alert"
          title="Next alert"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
