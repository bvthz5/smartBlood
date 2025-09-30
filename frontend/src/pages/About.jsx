// src/pages/About.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/about.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const [language, setLanguage] = useState('en');
  const [currentStat, setCurrentStat] = useState(0);
  
  const heroRef = useRef(null);
  const statsRef = useRef([]);
  const cardsRef = useRef([]);
  const featuresRef = useRef([]);
  const timelineRef = useRef([]);

  // Get language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  // Auto-rotating stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animation setup
  useEffect(() => {
    if (!heroRef.current) return;

    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Stats animation
    gsap.fromTo(statsRef.current,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 0.5
      }
    );

    // Cards animation
    ScrollTrigger.batch(cardsRef.current, {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { opacity: 0, y: 60, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.8, 
            stagger: 0.15,
            ease: "power3.out"
          }
        );
      },
      start: "top 80%"
    });

    // Features animation
    ScrollTrigger.batch(featuresRef.current, {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { opacity: 0, x: -60 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            stagger: 0.2,
            ease: "power3.out"
          }
        );
      },
      start: "top 80%"
    });

    // Timeline animation
    ScrollTrigger.batch(timelineRef.current, {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { opacity: 0, x: 60 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            stagger: 0.2,
            ease: "power3.out"
          }
        );
      },
      start: "top 80%"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const stats = language === 'en' ? [
    { number: "500+", label: "Lives Saved", icon: "❤️" },
    { number: "50+", label: "Partner Hospitals", icon: "🏥" },
    { number: "24/7", label: "Support Available", icon: "🕐" },
    { number: "14", label: "Districts Covered", icon: "📍" }
  ] : [
    { number: "500+", label: "ജീവിതങ്ങൾ രക്ഷിച്ചു", icon: "❤️" },
    { number: "50+", label: "പങ്കാളി ആശുപത്രികൾ", icon: "🏥" },
    { number: "24/7", label: "പിന്തുണ ലഭ്യം", icon: "🕐" },
    { number: "14", label: "ജില്ലകൾ ഉൾപ്പെടുത്തി", icon: "📍" }
  ];

  const features = language === 'en' ? [
    {
      icon: "⚡",
      title: "Real-Time Matching",
      description: "Advanced algorithms instantly connect donors with patients in need, reducing response time from hours to minutes."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Bank-level encryption ensures donor and patient data remains confidential and secure at all times."
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Seamless experience across all devices with push notifications for urgent blood requests in your area."
    },
    {
      icon: "🏥",
      title: "Hospital Integration",
      description: "Direct integration with hospital systems for automated blood inventory management and request processing."
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description: "Comprehensive dashboards provide insights into donation patterns, demand forecasting, and system performance."
    },
    {
      icon: "🌐",
      title: "Multi-Language",
      description: "Supporting Malayalam and English to serve the diverse population of Kerala effectively."
    }
  ] : [
    {
      icon: "⚡",
      title: "റിയൽ-ടൈം മാച്ചിംഗ്",
      description: "ക്ഷണനെ സൂക്ഷിച്ച് ദാനികളെ രോഗികളുമായി ബന്ധിപ്പിക്കുന്ന മുമ്പോട്ടുള്ള അൽഗോരിതങ്ങൾ."
    },
    {
      icon: "🔒",
      title: "സുരക്ഷിതവും സ്വകാര്യവും",
      description: "ബാങ്ക് തലത്തിലുള്ള എൻക്രിപ്ഷൻ ദാനി, രോഗി ഡാറ്റാ സുരക്ഷിതവും സ്വകാര്യവുമായി സൂക്ഷിക്കുന്നു."
    },
    {
      icon: "📱",
      title: "മൊബൈൽ ഫസ്റ്റ്",
      description: "എല്ലാ ഉപകരണങ്ങളിലും മികച്ച അനുഭവം, അടിയന്തര രക്ത അഭ്യർത്ഥനകൾക്ക് പുഷ് അറിയിപ്പുകൾ."
    },
    {
      icon: "🏥",
      title: "ആശുപത്രി സംയോജനം",
      description: "ആശുപത്രി സിസ്റ്റങ്ങളുമായി നേരിട്ടുള്ള സംയോജനം ഓട്ടോമാറ്റഡ് രക്ത ഇൻവെന്ററി മാനേജ്മെന്റിനായി."
    },
    {
      icon: "📊",
      title: "വിശകലനവും അന്തർദൃഷ്ടികളും",
      description: "സമഗ്ര ഡാഷ്ബോർഡുകൾ ദാന പാറ്റേണുകൾ, ഡിമാൻഡ് പ്രവചനം, സിസ്റ്റം പ്രകടനം എന്നിവയെക്കുറിച്ച് അന്തർദൃഷ്ടികൾ നൽകുന്നു."
    },
    {
      icon: "🌐",
      title: "ബഹുഭാഷാ",
      description: "കേരളത്തിന്റെ വൈവിധ്യമാർന്ന ജനസംഖ്യയെ ഫലപ്രദമായി സേവിക്കാൻ മലയാളം, ഇംഗ്ലീഷ് പിന്തുണ."
    }
  ];

  const timeline = language === 'en' ? [
    {
      year: "2020",
      title: "Foundation",
      description: "SmartBlood was conceptualized during the COVID-19 pandemic when blood shortages became critical across Kerala."
    },
    {
      year: "2021",
      title: "Development",
      description: "Core platform development with real-time matching algorithms and hospital integration capabilities."
    },
    {
      year: "2022",
      title: "Pilot Launch",
      description: "Successfully launched in 5 major hospitals across Kerala with 100+ registered donors."
    },
    {
      year: "2023",
      title: "Expansion",
      description: "Expanded to all 14 districts with 50+ partner hospitals and 1000+ registered donors."
    },
    {
      year: "2024",
      title: "Current",
      description: "Serving the entire state with advanced features, mobile app, and comprehensive analytics."
    }
  ] : [
    {
      year: "2020",
      title: "സ്ഥാപനം",
      description: "കോവിഡ്-19 പാൻഡെമിക് സമയത്ത് കേരളത്തിൽ രക്ത കുറവ് നിർണായകമായിത്തീർന്നപ്പോൾ സ്മാർട്ട് ബ്ലഡ് ആശയപരമായി രൂപപ്പെടുത്തി."
    },
    {
      year: "2021",
      title: "വികസനം",
      description: "റിയൽ-ടൈം മാച്ചിംഗ് അൽഗോരിതങ്ങളും ആശുപത്രി സംയോജന കഴിവുകളും ഉള്ള കോർ പ്ലാറ്റ്ഫോം വികസനം."
    },
    {
      year: "2022",
      title: "പൈലറ്റ് ലോഞ്ച്",
      description: "കേരളത്തിലെ 5 പ്രധാന ആശുപത്രികളിൽ 100+ രജിസ്റ്റർ ചെയ്ത ദാനികളുമായി വിജയകരമായി ലോഞ്ച് ചെയ്തു."
    },
    {
      year: "2023",
      title: "വിപുലീകരണം",
      description: "എല്ലാ 14 ജില്ലകളിലും 50+ പങ്കാളി ആശുപത്രികളും 1000+ രജിസ്റ്റർ ചെയ്ത ദാനികളുമായി വിപുലീകരിച്ചു."
    },
    {
      year: "2024",
      title: "ഇപ്പോൾ",
      description: "മുമ്പോട്ടുള്ള സവിശേഷതകൾ, മൊബൈൽ ആപ്പ്, സമഗ്ര വിശകലനങ്ങൾ എന്നിവയുമായി മുഴുവൻ സംസ്ഥാനത്തിനും സേവനം നൽകുന്നു."
    }
  ];

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section ref={heroRef} className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {language === 'en' 
                ? 'About SmartBlood Connect' 
                : 'സ്മാർട്ട് ബ്ലഡ് കണക്ടിനെ കുറിച്ച്'}
            </h1>
            <p className="hero-subtitle">
              {language === 'en'
                ? 'Transforming blood donation in Kerala through technology, connecting lives, and saving communities.'
                : 'സാങ്കേതികവിദ്യയിലൂടെ കേരളത്തിലെ രക്തദാനത്തെ മാറ്റിമറിച്ച്, ജീവിതങ്ങളെ ബന്ധിപ്പിച്ച് സമൂഹങ്ങളെ രക്ഷിക്കുന്നു.'}
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  ref={el => statsRef.current[index] = el}
                  className={`stat-item ${currentStat === index ? 'active' : ''}`}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2>
                {language === 'en' ? 'Our Mission' : 'ഞങ്ങളുടെ ലക്ഷ്യം'}
              </h2>
              <p>
                {language === 'en'
                  ? 'To eliminate blood shortage crises in Kerala by creating a seamless, technology-driven platform that connects donors, recipients, and healthcare providers in real-time. We believe that no life should be lost due to blood unavailability, and every drop of blood donated has the power to save up to three lives.'
                  : 'റിയൽ-ടൈമിൽ ദാനികളെ, സ്വീകർത്താക്കളെ, ആരോഗ്യ സേവന ദാതാക്കളെ ബന്ധിപ്പിക്കുന്ന നിർവ്വിഘ്ന, സാങ്കേതികവിദ്യാ-ചാലിത പ്ലാറ്റ്ഫോം സൃഷ്ടിച്ച് കേരളത്തിലെ രക്ത കുറവ് പ്രതിസന്ധികൾ ഇല്ലാതാക്കുക. രക്തത്തിന്റെ അഭാവം കാരണം ഒരു ജീവിതവും നഷ്ടപ്പെടാതിരിക്കണമെന്നും, ദാനം ചെയ്യുന്ന ഓരോ തുള്ളി രക്തവും മൂന്ന് ജീവിതങ്ങൾ രക്ഷിക്കാനുള്ള ശക്തി ഉണ്ടെന്നും ഞങ്ങൾ വിശ്വസിക്കുന്നു.'}
              </p>
            </div>
            <div className="mission-visual">
              <div className="visual-card">
                <div className="card-icon">🩸</div>
                <h3>{language === 'en' ? 'Blood Donation' : 'രക്തദാനം'}</h3>
                <p>{language === 'en' ? 'Save Lives' : 'ജീവിതങ്ങൾ രക്ഷിക്കുക'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {language === 'en' ? 'Platform Features' : 'പ്ലാറ്റ്ഫോം സവിശേഷതകൾ'}
            </h2>
            <p>
              {language === 'en'
                ? 'Cutting-edge technology designed to make blood donation efficient, secure, and accessible to everyone.'
                : 'രക്തദാനം കാര്യക്ഷമവും സുരക്ഷിതവും എല്ലാവർക്കും ലഭ്യവുമാക്കാൻ രൂപകൽപ്പന ചെയ്ത അത്യാധുനിക സാങ്കേതികവിദ്യ.'}
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index}
                ref={el => featuresRef.current[index] = el}
                className="feature-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {language === 'en' ? 'Our Journey' : 'ഞങ്ങളുടെ യാത്ര'}
            </h2>
            <p>
              {language === 'en'
                ? 'From concept to reality, building a system that saves lives across Kerala.'
                : 'ആശയത്തിൽ നിന്ന് യാഥാർത്ഥ്യത്തിലേക്ക്, കേരളത്തിലുടനീളം ജീവിതങ്ങൾ രക്ഷിക്കുന്ന ഒരു സിസ്റ്റം നിർമ്മിക്കുന്നു.'}
            </p>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div 
                key={index}
                ref={el => timelineRef.current[index] = el}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{item.year}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="timeline-marker"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="container">
          <div className="impact-content">
            <h2>
              {language === 'en' ? 'Making a Difference' : 'വ്യത്യാസം വരുത്തുന്നു'}
            </h2>
            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-number">500+</div>
                <div className="impact-label">
                  {language === 'en' ? 'Lives Saved' : 'ജീവിതങ്ങൾ രക്ഷിച്ചു'}
                </div>
              </div>
              <div className="impact-card">
                <div className="impact-number">50+</div>
                <div className="impact-label">
                  {language === 'en' ? 'Hospitals Connected' : 'ആശുപത്രികൾ ബന്ധിപ്പിച്ചു'}
                </div>
              </div>
              <div className="impact-card">
                <div className="impact-number">1000+</div>
                <div className="impact-label">
                  {language === 'en' ? 'Active Donors' : 'സജീവ ദാനികൾ'}
                </div>
              </div>
              <div className="impact-card">
                <div className="impact-number">14</div>
                <div className="impact-label">
                  {language === 'en' ? 'Districts Served' : 'ജില്ലകൾ സേവിച്ചു'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>
              {language === 'en' 
                ? 'Join the Movement' 
                : 'പ്രസ്ഥാനത്തിൽ ചേരുക'}
            </h2>
            <p>
              {language === 'en'
                ? 'Be part of Kerala\'s largest blood donation network. Together, we can save lives and build a healthier community.'
                : 'കേരളത്തിലെ ഏറ്റവും വലിയ രക്തദാന നെറ്റ്‌വർക്കിന്റെ ഭാഗമാകുക. ഒരുമിച്ച്, ഞങ്ങൾക്ക് ജീവിതങ്ങൾ രക്ഷിക്കാനും ആരോഗ്യകരമായ സമൂഹം നിർമ്മിക്കാനും കഴിയും.'}
            </p>
            <div className="cta-buttons">
              <Link to="/donor/register" className="btn btn--primary btn--large">
                {language === 'en' ? 'Become a Donor' : 'ഒരു ദാനിയായി മാറുക'}
              </Link>
              <Link to="/" className="btn btn--outline btn--large">
                {language === 'en' ? 'Back to Home' : 'ഹോമിലേക്ക് മടങ്ങുക'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
