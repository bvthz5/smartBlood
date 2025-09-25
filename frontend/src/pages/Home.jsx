// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

// Component for Emergency Alert Bar
function EmergencyBar({ language }) {
  const [currentMessage, setCurrentMessage] = useState(0)
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
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % emergencyMessages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [emergencyMessages.length])

  return (
    <div className="emergency-bar">
      <div className="emergency-scroll">
        <span className="emergency-icon">🚨</span>
        <span className="emergency-text">{emergencyMessages[currentMessage]}</span>
      </div>
    </div>
  )
}

// Component for Hero Section
function HeroSection({ language }) {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400', 
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            {language === 'en' ? 'Give Blood. Save Lives.' : 'രക്തം ദാനം ചെയ്യുക. ജീവിതങ്ങൾ രക്ഷിക്കുക.'}
          </h1>
          <p className="hero-subtitle">
            {language === 'en' 
              ? "Join Kerala's real-time blood donor network." 
              : "കേരളത്തിന്റെ റിയൽ-ടൈം രക്ത ദാനി നെറ്റ്‌വർക്കിൽ ചേരുക."}
          </p>
          <div className="hero-buttons">
            <Link to="/donor/register" className="btn btn-primary">
              {language === 'en' ? 'Become a Donor' : 'ഒരു ദാനിയായി മാറുക'}
            </Link>
            <Link to="/seeker/request" className="btn btn-outline">
              {language === 'en' ? 'Find Blood (Hospitals)' : 'രക്തം കണ്ടെത്തുക (ആശുപത്രികൾ)'}
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-carousel">
            <img 
              src={images[currentImage]} 
              alt="Blood donation" 
              className="carousel-image"
            />
            <div className="carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>
          <div className="video-placeholder">
            <div className="play-button">▶️</div>
            <span>{language === 'en' ? 'Watch How It Works' : 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു കാണുക'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Component for Statistics
function StatsSection({ language }) {
  const [counts, setCounts] = useState({ donors: 0, units: 0, hospitals: 0, districts: 0 })
  const targetCounts = { donors: 12458, units: 8732, hospitals: 245, districts: 14 }
  const intervalRef = useRef(null)

  useEffect(() => {
    const animateCounts = () => {
      setCounts(prev => ({
        donors: Math.min(prev.donors + 50, targetCounts.donors),
        units: Math.min(prev.units + 35, targetCounts.units),
        hospitals: Math.min(prev.hospitals + 1, targetCounts.hospitals),
        districts: Math.min(prev.districts + 1, targetCounts.districts)
      }))
    }

    intervalRef.current = setInterval(animateCounts, 50)
    return () => clearInterval(intervalRef.current)
  }, [])

  const stats = language === 'en' ? [
    { label: 'Donors Registered', value: counts.donors.toLocaleString() },
    { label: 'Units Collected', value: counts.units.toLocaleString() },
    { label: 'Active Hospitals', value: counts.hospitals.toLocaleString() },
    { label: 'Districts Covered', value: counts.districts.toLocaleString() }
  ] : [
    { label: 'രജിസ്റ്റർ ചെയ്ത ദാനികൾ', value: counts.donors.toLocaleString() },
    { label: 'ശേഖരിച്ച യൂണിറ്റുകൾ', value: counts.units.toLocaleString() },
    { label: 'സജീവ ആശുപത്രികൾ', value: counts.hospitals.toLocaleString() },
    { label: 'ഉൾപ്പെടുത്തിയ ജില്ലകൾ', value: counts.districts.toLocaleString() }
  ]

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Component for Why Donate Section
function WhyDonateSection({ language }) {
  const reasons = language === 'en' ? [
    { title: 'Takes Only 1 Hour', description: 'Quick and safe at certified centers.' },
    { title: 'Free Health Check-up', description: 'Medical screening before donation.' },
    { title: 'Save Up to 3 Lives', description: 'Your gift multiplies impact.' },
    { title: 'Help Kerala Community', description: 'Support your local community.' },
    { title: 'Trusted by Hospitals', description: 'Partnered with leading medical centers.' }
  ] : [
    { title: '1 മണിക്കൂർ മാത്രം', description: 'സർട്ടിഫൈഡ് സെന്ററുകളിൽ വേഗവും സുരക്ഷിതവുമാണ്.' },
    { title: 'സൗജന്യ ആരോഗ്യ പരിശോധന', description: 'ദാനത്തിന് മുമ്പ് മെഡിക്കൽ സ്ക്രീനിംഗ്.' },
    { title: '3 ജീവിതങ്ങൾ രക്ഷിക്കുക', description: 'നിങ്ങളുടെ സമ്മാനം പ്രഭാവം ഗുണിക്കുന്നു.' },
    { title: 'കേരള സമൂഹത്തെ സഹായിക്കുക', description: 'നിങ്ങളുടെ പ്രാദേശിക സമൂഹത്തെ പിന്തുണയ്ക്കുക.' },
    { title: 'ആശുപത്രികൾ ആശ്രയിക്കുന്നു', description: 'മുൻനിര മെഡിക്കൽ സെന്ററുകളുമായി പങ്കാളിത്തം.' }
  ]

  return (
    <section className="why-donate-section">
      <div className="container">
        <h2 className="section-title">
          {language === 'en' ? 'Why Donate?' : 'എന്തുകൊണ്ട് ദാനം ചെയ്യണം?'}
        </h2>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div key={index} className="reason-card">
              <h3 className="reason-title">{reason.title}</h3>
              <p className="reason-description">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Component for Blood Compatibility Tool
function CompatibilityTool({ language }) {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+')
  
  const compatibility = {
    'O+': { donors: ['O+', 'O-'], receivers: ['O+', 'A+', 'B+', 'AB+'] },
    'O-': { donors: ['O-'], receivers: ['Everyone'] },
    'A+': { donors: ['A+', 'A-', 'O+', 'O-'], receivers: ['A+', 'AB+'] },
    'A-': { donors: ['A-', 'O-'], receivers: ['A+', 'A-', 'AB+', 'AB-'] },
    'B+': { donors: ['B+', 'B-', 'O+', 'O-'], receivers: ['B+', 'AB+'] },
    'B-': { donors: ['B-', 'O-'], receivers: ['B+', 'B-', 'AB+', 'AB-'] },
    'AB+': { donors: ['Everyone'], receivers: ['AB+'] },
    'AB-': { donors: ['AB-', 'A-', 'B-', 'O-'], receivers: ['AB+', 'AB-'] }
  }

  const bloodGroups = Object.keys(compatibility)

  return (
    <section className="compatibility-section">
      <div className="container">
        <h2 className="section-title">
          {language === 'en' ? 'Blood Compatibility Tool' : 'രക്ത സാമ്യത ഉപകരണം'}
        </h2>
        <div className="compatibility-container">
          <div className="blood-group-selector">
            <label>
              {language === 'en' ? 'Select Blood Group:' : 'രക്തഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക:'}
            </label>
            <div className="blood-group-buttons">
              {bloodGroups.map(group => (
                <button
                  key={group}
                  className={`blood-group-btn ${selectedBloodGroup === group ? 'active' : ''}`}
                  onClick={() => setSelectedBloodGroup(group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
          <div className="compatibility-results">
            <div className="compatibility-card">
              <h3>{language === 'en' ? 'Can Donate To:' : 'ദാനം ചെയ്യാൻ കഴിയുന്നവർ:'}</h3>
              <div className="compatibility-list">
                {compatibility[selectedBloodGroup].receivers.map(group => (
                  <span key={group} className="compatibility-item">{group}</span>
                ))}
              </div>
            </div>
            <div className="compatibility-card">
              <h3>{language === 'en' ? 'Can Receive From:' : 'സ്വീകരിക്കാൻ കഴിയുന്നവർ:'}</h3>
              <div className="compatibility-list">
                {compatibility[selectedBloodGroup].donors.map(group => (
                  <span key={group} className="compatibility-item">{group}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Component for How It Works
function HowItWorksSection({ language }) {
  const donorSteps = language === 'en' ? [
    { step: '1', title: 'Register', description: 'Sign up as a donor' },
    { step: '2', title: 'Get Matched', description: 'Receive blood requests' },
    { step: '3', title: 'Donate', description: 'Visit hospital & donate' }
  ] : [
    { step: '1', title: 'രജിസ്റ്റർ', description: 'ഒരു ദാനിയായി സൈൻ അപ്പ് ചെയ്യുക' },
    { step: '2', title: 'മാച്ച് ചെയ്യുക', description: 'രക്ത അഭ്യർത്ഥനകൾ സ്വീകരിക്കുക' },
    { step: '3', title: 'ദാനം ചെയ്യുക', description: 'ആശുപത്രിയിൽ സന്ദർശിക്കുകയും ദാനം ചെയ്യുക' }
  ]

  const hospitalSteps = language === 'en' ? [
    { step: '1', title: 'Login', description: 'Hospital admin login' },
    { step: '2', title: 'Create Request', description: 'Post blood requirements' },
    { step: '3', title: 'Donors Notified', description: 'Automatic donor matching' }
  ] : [
    { step: '1', title: 'ലോഗിൻ', description: 'ആശുപത്രി അഡ്മിൻ ലോഗിൻ' },
    { step: '2', title: 'അഭ്യർത്ഥന സൃഷ്ടിക്കുക', description: 'രക്ത ആവശ്യകതകൾ പോസ്റ്റ് ചെയ്യുക' },
    { step: '3', title: 'ദാനികൾക്ക് അറിയിക്കുക', description: 'ഓട്ടോമാറ്റിക് ദാനി മാച്ചിംഗ്' }
  ]

  return (
    <section className="how-it-works-section">
      <div className="container">
        <h2 className="section-title">
          {language === 'en' ? 'How It Works' : 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു'}
        </h2>
        <div className="workflows">
          <div className="workflow">
            <h3>{language === 'en' ? 'For Donors' : 'ദാനികൾക്ക്'}</h3>
            <div className="steps">
              {donorSteps.map((step, index) => (
                <div key={index} className="step">
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="workflow">
            <h3>{language === 'en' ? 'For Hospitals' : 'ആശുപത്രികൾക്ക്'}</h3>
            <div className="steps">
              {hospitalSteps.map((step, index) => (
                <div key={index} className="step">
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Component for Alerts & Camps
function AlertsCampsSection({ language }) {
  const alerts = language === 'en' ? [
    { type: 'alert', title: 'Platelet Shortage', message: 'Critical shortage of platelets in central Kerala' },
    { type: 'camp', title: 'Blood Donation Camp', message: 'March 15, 2024 at Medical College, Trivandrum' },
    { type: 'camp', title: 'Community Drive', message: 'March 20, 2024 at Kochi Convention Centre' }
  ] : [
    { type: 'alert', title: 'പ്ലേറ്റ്ലെറ്റ് കുറവ്', message: 'മധ്യ കേരളത്തിൽ പ്ലേറ്റ്ലെറ്റുകളുടെ നിർണായക കുറവ്' },
    { type: 'camp', title: 'രക്തദാന ക്യാമ്പ്', message: 'മാർച്ച് 15, 2024 മെഡിക്കൽ കോളേജ്, തിരുവനന്തപുരം' },
    { type: 'camp', title: 'കമ്മ്യൂണിറ്റി ഡ്രൈവ്', message: 'മാർച്ച് 20, 2024 കൊച്ചി കൺവെൻഷൻ സെന്റർ' }
  ]

  return (
    <section className="alerts-camps-section">
      <div className="container">
        <h2 className="section-title">
          {language === 'en' ? 'Alerts & Upcoming Camps' : 'അലേർട്ടുകളും വരാനിരിക്കുന്ന ക്യാമ്പുകളും'}
        </h2>
        <div className="alerts-grid">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert-card ${alert.type}`}>
              <div className="alert-icon">
                {alert.type === 'alert' ? '🚨' : '🏥'}
              </div>
              <div className="alert-content">
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Component for Testimonials
function TestimonialsSection({ language }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const testimonials = language === 'en' ? [
    {
      quote: "SmartBlood saved my father's life by connecting us with a donor within hours.",
      author: "Priya S.",
      role: "Patient's Family"
    },
    {
      quote: "As a regular donor, this platform makes it so easy to help when needed most.",
      author: "Rajesh K.",
      role: "Blood Donor"
    },
    {
      quote: "The real-time matching system has revolutionized our blood bank operations.",
      author: "Dr. Meera",
      role: "Hospital Administrator"
    }
  ] : [
    {
      quote: "സ്മാർട്ട് ബ്ലഡ് മണിക്കൂറുകൾക്കുള്ളിൽ ഒരു ദാനിയുമായി ഞങ്ങളെ ബന്ധിപ്പിച്ച് എന്റെ അച്ഛന്റെ ജീവിതം രക്ഷിച്ചു.",
      author: "പ്രിയ എസ്.",
      role: "രോഗിയുടെ കുടുംബം"
    },
    {
      quote: "ഒരു സാധാരണ ദാനിയായി, ആവശ്യമുള്ളപ്പോൾ സഹായിക്കാൻ ഈ പ്ലാറ്റ്ഫോം വളരെ എളുപ്പമാക്കുന്നു.",
      author: "രാജേഷ് കെ.",
      role: "രക്ത ദാനി"
    },
    {
      quote: "റിയൽ-ടൈം മാച്ചിംഗ് സിസ്റ്റം ഞങ്ങളുടെ ബ്ലഡ് ബാങ്ക് പ്രവർത്തനങ്ങളിൽ വിപ്ലവം സൃഷ്ടിച്ചു.",
      author: "ഡോ. മീര",
      role: "ആശുപത്രി അഡ്മിനിസ്ട്രേറ്റർ"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">
          {language === 'en' ? 'What People Say' : 'ആളുകൾ എന്താണ് പറയുന്നത്'}
        </h2>
        <div className="testimonial-carousel">
          <div className="testimonial-card">
            <div className="testimonial-quote">"{testimonials[currentTestimonial].quote}"</div>
            <div className="testimonial-author">
              <strong>{testimonials[currentTestimonial].author}</strong>
              <span>{testimonials[currentTestimonial].role}</span>
            </div>
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Component for Download App
function DownloadAppSection({ language }) {
  return (
    <section className="download-app-section">
      <div className="container">
        <div className="download-content">
          <div className="download-info">
            <h2>{language === 'en' ? 'Download the App' : 'ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക'}</h2>
            <p>
              {language === 'en' 
                ? 'Get instant notifications for blood requests in your area.'
                : 'നിങ്ങളുടെ പ്രദേശത്തെ രക്ത അഭ്യർത്ഥനകൾക്കായി തൽക്ഷണ അറിയിപ്പുകൾ നേടുക.'}
            </p>
            <div className="download-buttons">
              <button className="store-button">
                <img src="/api/placeholder/120/40" alt="App Store" />
              </button>
              <button className="store-button">
                <img src="/api/placeholder/120/40" alt="Google Play" />
              </button>
            </div>
          </div>
          <div className="qr-code">
            <div className="qr-placeholder">
              <div className="qr-squares">
                <div className="qr-square"></div>
                <div className="qr-square"></div>
                <div className="qr-square"></div>
                <div className="qr-square"></div>
              </div>
              <span>{language === 'en' ? 'Scan to Download' : 'ഡൗൺലോഡ് ചെയ്യാൻ സ്കാൻ ചെയ്യുക'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Component for About Section
function AboutSection({ language }) {
  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>{language === 'en' ? 'About SmartBlood' : 'സ്മാർട്ട് ബ്ലഡിനെ കുറിച്ച്'}</h2>
            <p>
              {language === 'en' 
                ? "SmartBlood is Kerala's premier blood donation platform, connecting donors, recipients, and hospitals in real-time. Our mission is to ensure no life is lost due to blood unavailability."
                : "സ്മാർട്ട് ബ്ലഡ് കേരളത്തിന്റെ പ്രമുഖ രക്തദാന പ്ലാറ്റ്ഫോമാണ്, ദാനികൾ, സ്വീകർത്താക്കൾ, ആശുപത്രികൾ എന്നിവയെ റിയൽ-ടൈമിൽ ബന്ധിപ്പിക്കുന്നു. രക്തത്തിന്റെ അഭാവം കാരണം ഒരു ജീവിതവും നഷ്ടപ്പെടാതിരിക്കാൻ ഞങ്ങളുടെ ലക്ഷ്യം."}
            </p>
            <Link to="/about" className="btn btn-outline">
              {language === 'en' ? 'Learn More' : 'കൂടുതൽ അറിയുക'}
            </Link>
          </div>
          <div className="about-stats">
            <div className="about-stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">{language === 'en' ? 'Lives Saved' : 'ജീവിതങ്ങൾ രക്ഷിച്ചു'}</div>
            </div>
            <div className="about-stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">{language === 'en' ? 'Partner Hospitals' : 'പങ്കാളി ആശുപത്രികൾ'}</div>
            </div>
            <div className="about-stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">{language === 'en' ? 'Support' : 'പിന്തുണ'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Home Component
export default function Home() {
  const [language, setLanguage] = useState('en')

  // Get language from parent context or localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
  }, [])

  return (
    <main className="home-page">
      <EmergencyBar language={language} />
      <HeroSection language={language} />
      <StatsSection language={language} />
      <WhyDonateSection language={language} />
      <CompatibilityTool language={language} />
      <HowItWorksSection language={language} />
      <AlertsCampsSection language={language} />
      <TestimonialsSection language={language} />
      <DownloadAppSection language={language} />
      <AboutSection language={language} />
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{language === 'en' ? 'Find Blood' : 'രക്തം കണ്ടെത്തുക'}</h3>
              <ul>
                <li><Link to="/seeker/request">{language === 'en' ? 'Blood Availability' : 'രക്ത ലഭ്യത'}</Link></li>
                <li><Link to="/hospitals">{language === 'en' ? 'Blood Centers' : 'രക്ത കേന്ദ്രങ്ങൾ'}</Link></li>
                <li><Link to="/requests">{language === 'en' ? 'Requests' : 'അഭ്യർത്ഥനകൾ'}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>{language === 'en' ? 'Donate Blood' : 'രക്തം ദാനം ചെയ്യുക'}</h3>
              <ul>
                <li><Link to="/camps">{language === 'en' ? 'Camps' : 'ക്യാമ്പുകൾ'}</Link></li>
                <li><Link to="/donor/login">{language === 'en' ? 'Donor Login' : 'ദാനി ലോഗിൻ'}</Link></li>
                <li><Link to="/how-to-donate">{language === 'en' ? 'How to Donate' : 'എങ്ങനെ ദാനം ചെയ്യാം'}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>{language === 'en' ? 'Hospital Login' : 'ആശുപത്രി ലോഗിൻ'}</h3>
              <ul>
                <li><Link to="/hospital/register">{language === 'en' ? 'Center Registration' : 'കേന്ദ്ര രജിസ്ട്രേഷൻ'}</Link></li>
                <li><Link to="/admin/login">{language === 'en' ? 'Login' : 'ലോഗിൻ'}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>{language === 'en' ? 'About Us' : 'ഞങ്ങളെ കുറിച്ച്'}</h3>
              <ul>
                <li><Link to="/faq">{language === 'en' ? 'FAQs' : 'പതിവ് ചോദ്യങ്ങൾ'}</Link></li>
                <li><Link to="/policies">{language === 'en' ? 'Policies' : 'നയങ്ങൾ'}</Link></li>
                <li><Link to="/contact">{language === 'en' ? 'Contact' : 'ബന്ധപ്പെടുക'}</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="YouTube">📺</a>
            </div>
            <p>&copy; 2024 SmartBlood Connect. {language === 'en' ? 'All rights reserved.' : 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.'}</p>
          </div>
        </div>
      </footer>
    </main>
  )
}