// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroBanner from '../components/HeroBanner'
import SectionReveal from '../components/SectionReveal'
import AlertsBar from '../components/AlertsBar'
import '../styles/home-new.css'


// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// EmergencyBar is now handled by AlertsBar component

// Hero section is now handled by HeroBanner component

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
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  
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

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current.length) return

    // Set initial state
    gsap.set(cardsRef.current, { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    })

    // Create scroll trigger animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to(cardsRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="why-donate-section">
      <div className="container">
        <h2 className="section-title">
          {language === 'en' ? 'Why Donate?' : 'എന്തുകൊണ്ട് ദാനം ചെയ്യണം?'}
        </h2>
        <div className="reasons-grid">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              ref={el => cardsRef.current[index] = el}
              className="reason-card"
            >
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
  const sectionRef = useRef(null)
  const buttonsRef = useRef([])
  const cardsRef = useRef([])
  const itemsRef = useRef([])
  
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

  useEffect(() => {
    if (!sectionRef.current) return

    // Set initial state
    gsap.set(buttonsRef.current, { opacity: 0, y: 30 })
    gsap.set(cardsRef.current, { opacity: 0, y: 40 })

    // Create scroll trigger animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to(buttonsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        })
        
        gsap.to(cardsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.3
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  useEffect(() => {
    // Animate compatibility items when blood group changes
    if (itemsRef.current.length > 0) {
      gsap.fromTo(itemsRef.current, 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.5, 
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      )
    }
  }, [selectedBloodGroup])

  return (
    <section ref={sectionRef} className="compatibility-section">
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
              {bloodGroups.map((group, index) => (
                <button
                  key={group}
                  ref={el => buttonsRef.current[index] = el}
                  className={`blood-group-btn ${selectedBloodGroup === group ? 'active' : ''}`}
                  onClick={() => setSelectedBloodGroup(group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
          <div className="compatibility-results">
            <div ref={el => cardsRef.current[0] = el} className="compatibility-card">
              <h3>{language === 'en' ? 'Can Donate To:' : 'ദാനം ചെയ്യാൻ കഴിയുന്നവർ:'}</h3>
              <div className="compatibility-list">
                {compatibility[selectedBloodGroup].receivers.map((group, index) => (
                  <span 
                    key={group} 
                    ref={el => itemsRef.current[index] = el}
                    className="compatibility-item"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
            <div ref={el => cardsRef.current[1] = el} className="compatibility-card">
              <h3>{language === 'en' ? 'Can Receive From:' : 'സ്വീകരിക്കാൻ കഴിയുന്നവർ:'}</h3>
              <div className="compatibility-list">
                {compatibility[selectedBloodGroup].donors.map((group, index) => (
                  <span 
                    key={group} 
                    ref={el => itemsRef.current[index + compatibility[selectedBloodGroup].receivers.length] = el}
                    className="compatibility-item"
                  >
                    {group}
                  </span>
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
                {alert.type === 'alert' ? 'Alert' : 'Hospital'}
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
  const sectionRef = useRef(null)
  const infoRef = useRef(null)
  const qrRef = useRef(null)
  const buttonsRef = useRef([])
  const squaresRef = useRef([])

  useEffect(() => {
    if (!sectionRef.current) return

    // Set initial state
    gsap.set([infoRef.current, qrRef.current], { opacity: 0, y: 50 })
    gsap.set(buttonsRef.current, { opacity: 0, scale: 0.8 })
    gsap.set(squaresRef.current, { opacity: 0, scale: 0 })

    // Create scroll trigger animation
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to([infoRef.current, qrRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        })

        gsap.to(buttonsRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.4
        })

        gsap.to(squaresRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.6
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="download-app-section">
      <div className="container">
        <div className="download-content">
          <div ref={infoRef} className="download-info">
            <h2>{language === 'en' ? 'Download the App' : 'ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക'}</h2>
            <p>
              {language === 'en' 
                ? 'Get instant notifications for blood requests in your area.'
                : 'നിങ്ങളുടെ പ്രദേശത്തെ രക്ത അഭ്യർത്ഥനകൾക്കായി തൽക്ഷണ അറിയിപ്പുകൾ നേടുക.'}
            </p>
            <div className="download-buttons">
              <button ref={el => buttonsRef.current[0] = el} className="store-button">
                <img src="/applestore.png" alt="App Store" />
              </button>
              <button ref={el => buttonsRef.current[1] = el} className="store-button">
                <img src="/playstore.png" alt="Google Play" />
              </button>
            </div>
          </div>
          <div ref={qrRef} className="qr-code">
            <div className="qr-placeholder">
              <div className="qr-squares">
                {Array.from({ length: 64 }, (_, index) => (
                  <div 
                    key={index} 
                    ref={el => squaresRef.current[index] = el}
                    className="qr-square"
                  />
                ))}
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
    <section id="about" className="about-section">
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

  // Listen for language changes from navbar
  useEffect(() => {
    const handleLanguageChange = () => {
      const savedLanguage = localStorage.getItem('language') || 'en'
      setLanguage(savedLanguage)
    }

    window.addEventListener('languageChanged', handleLanguageChange)
    return () => window.removeEventListener('languageChanged', handleLanguageChange)
  }, [])

  return (
    <main className="home-page">
      <AlertsBar language={language} />
      <div className="full-bleed">
        <HeroBanner language={language} />
      </div>
      
      <SectionReveal>
        <StatsSection language={language} />
      </SectionReveal>
      
      <SectionReveal>
        <WhyDonateSection language={language} />
      </SectionReveal>
      
      <SectionReveal>
        <CompatibilityTool language={language} />
      </SectionReveal>
      
      <SectionReveal>
        <HowItWorksSection language={language} />
      </SectionReveal>
      
      <SectionReveal>
        <AlertsCampsSection language={language} />
      </SectionReveal>
      
      <SectionReveal>
        <TestimonialsSection language={language} />
      </SectionReveal>
      
      <SectionReveal>
        <DownloadAppSection language={language} />
      </SectionReveal>
      
      <SectionReveal>
        <AboutSection language={language} />
      </SectionReveal>
      
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
              <a href="#" aria-label="Facebook" className="social-link facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="social-link twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-link instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="social-link youtube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <p>&copy; {new Date().getFullYear()} SmartBlood Connect. {language === 'en' ? 'All rights reserved.' : 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.'}</p>
          </div>
        </div>
      </footer>
    </main>
  )
}