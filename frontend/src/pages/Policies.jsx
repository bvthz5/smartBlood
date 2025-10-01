// src/pages/Policies.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/policies.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Policies() {
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('privacy');
  
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const contentRefs = useRef([]);

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

  // Animation setup
  useEffect(() => {
    if (!heroRef.current) return;

    // Hero animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Navigation animation
    gsap.fromTo(navRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
    );

    // Content sections animation
    ScrollTrigger.batch(contentRefs.current, {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.15,
            ease: "power3.out"
          }
        );
      },
      start: "top 85%"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeSection]);

  const sections = language === 'en' ? [
    { id: 'privacy', title: 'Privacy Policy', icon: '🔒' },
    { id: 'terms', title: 'Terms of Service', icon: '📋' },
    { id: 'data', title: 'Data Protection', icon: '🛡️' },
    { id: 'medical', title: 'Medical Guidelines', icon: '🏥' },
    { id: 'donor', title: 'Donor Rights', icon: '❤️' }
  ] : [
    { id: 'privacy', title: 'സ്വകാര്യതാ നയം', icon: '🔒' },
    { id: 'terms', title: 'സേവന നിബന്ധനകൾ', icon: '📋' },
    { id: 'data', title: 'ഡാറ്റാ സംരക്ഷണം', icon: '🛡️' },
    { id: 'medical', title: 'മെഡിക്കൽ മാർഗ്ഗനിർദ്ദേശങ്ങൾ', icon: '🏥' },
    { id: 'donor', title: 'ദാനി അവകാശങ്ങൾ', icon: '❤️' }
  ];

  const policyContent = {
    privacy: language === 'en' ? {
      title: 'Privacy Policy',
      lastUpdated: 'January 2025',
      content: [
        {
          section: 'Information We Collect',
          details: [
            'Personal information: Name, age, contact details, blood type',
            'Health information: Medical history, donation eligibility',
            'Usage data: Platform interactions, preferences, location data',
            'Communication records: Messages, notifications, support interactions'
          ]
        },
        {
          section: 'How We Use Your Information',
          details: [
            'Facilitate blood donation matching and coordination',
            'Send important notifications about blood requests',
            'Maintain medical records for donation safety',
            'Improve platform functionality and user experience',
            'Comply with legal and regulatory requirements'
          ]
        },
        {
          section: 'Information Sharing',
          details: [
            'Partner hospitals receive necessary donor information for matching',
            'Emergency services may access contact details in critical situations',
            'Anonymized data used for research and platform improvement',
            'Information shared only with explicit consent or legal requirement'
          ]
        },
        {
          section: 'Data Security',
          details: [
            'Bank-level encryption for all sensitive data transmission',
            'Regular security audits and vulnerability assessments',
            'Access controls and authentication protocols',
            'Secure data centers with 24/7 monitoring'
          ]
        }
      ]
    } : {
      title: 'സ്വകാര്യതാ നയം',
      lastUpdated: 'ജനുവരി 2025',
      content: [
        {
          section: 'ഞങ്ങൾ ശേഖരിക്കുന്ന വിവരങ്ങൾ',
          details: [
            'വ്യക്തിഗത വിവരങ്ങൾ: പേര്, വയസ്സ്, കോൺടാക്റ്റ് വിവരങ്ങൾ, രക്തഗ്രൂപ്പ്',
            'ആരോഗ്യ വിവരങ്ങൾ: മെഡിക്കൽ ചരിത്രം, ദാന യോഗ്യത',
            'ഉപയോഗ ഡാറ്റ: പ്ലാറ്റ്ഫോം ഇടപെടലുകൾ, പ്രാഥമികതകൾ, ലൊക്കേഷൻ ഡാറ്റ',
            'ആശയവിനിമയ റെക്കോർഡുകൾ: സന്ദേശങ്ങൾ, അറിയിപ്പുകൾ, പിന്തുണ ഇടപെടലുകൾ'
          ]
        },
        {
          section: 'നിങ്ങളുടെ വിവരങ്ങൾ ഞങ്ങൾ എങ്ങനെ ഉപയോഗിക്കുന്നു',
          details: [
            'രക്തദാന മാച്ചിംഗും കോർഡിനേഷനും സുഗമമാക്കുക',
            'രക്ത അഭ്യർത്ഥനകളെക്കുറിച്ചുള്ള പ്രധാന അറിയിപ്പുകൾ അയയ്ക്കുക',
            'ദാന സുരക്ഷയ്ക്കായി മെഡിക്കൽ റെക്കോർഡുകൾ നിലനിർത്തുക',
            'പ്ലാറ്റ്ഫോം പ്രവർത്തനക്ഷമതയും ഉപയോക്തൃ അനുഭവവും മെച്ചപ്പെടുത്തുക',
            'നിയമപരമായ ആവശ്യകതകൾ പാലിക്കുക'
          ]
        },
        {
          section: 'വിവരങ്ങൾ പങ്കിടൽ',
          details: [
            'പങ്കാളി ആശുപത്രികൾ മാച്ചിംഗിനായി ആവശ്യമായ ദാനി വിവരങ്ങൾ സ്വീകരിക്കുന്നു',
            'നിർണായക സാഹചര്യങ്ങളിൽ അടിയന്തര സേവനങ്ങൾ കോൺടാക്റ്റ് വിവരങ്ങൾ ആക്സസ് ചെയ്യാം',
            'ഗവേഷണത്തിനും പ്ലാറ്റ്ഫോം മെച്ചപ്പെടുത്തലിനും അജ്ഞാത ഡാറ്റ ഉപയോഗിക്കുന്നു',
            'വ്യക്തമായ സമ്മതത്തോടെയോ നിയമപരമായ ആവശ്യകതയോടെയോ മാത്രം വിവരങ്ങൾ പങ്കിടുന്നു'
          ]
        },
        {
          section: 'ഡാറ്റാ സുരക്ഷ',
          details: [
            'എല്ലാ സെൻസിറ്റീവ് ഡാറ്റ ട്രാൻസ്മിഷനുമായി ബാങ്ക് തലത്തിലുള്ള എൻക്രിപ്ഷൻ',
            'നിരന്തര സുരക്ഷാ ഓഡിറ്റുകളും ദുർബലതാ വിലയിരുത്തലുകളും',
            'ആക്സസ് നിയന്ത്രണങ്ങളും ഓഥന്റികേഷൻ പ്രോട്ടോക്കോളുകളും',
            '24/7 മോണിറ്ററിംഗുള്ള സുരക്ഷിത ഡാറ്റാ സെന്ററുകൾ'
          ]
        }
      ]
    },
    terms: language === 'en' ? {
      title: 'Terms of Service',
      lastUpdated: 'January 2025',
      content: [
        {
          section: 'Platform Usage',
          details: [
            'SmartBlood Connect is a free platform for blood donation coordination',
            'Users must provide accurate and up-to-date information',
            'Platform is available 24/7 but may experience maintenance periods',
            'Users are responsible for maintaining account security'
          ]
        },
        {
          section: 'Donor Responsibilities',
          details: [
            'Maintain eligibility requirements for blood donation',
            'Respond promptly to blood requests when available',
            'Update availability status regularly',
            'Follow medical guidelines and safety protocols'
          ]
        },
        {
          section: 'Hospital Responsibilities',
          details: [
            'Verify patient information and blood requirements',
            'Coordinate with donors professionally and respectfully',
            'Maintain confidentiality of donor information',
            'Report any issues or complications promptly'
          ]
        },
        {
          section: 'Limitations',
          details: [
            'Platform does not guarantee donor availability',
            'Users are responsible for their own medical decisions',
            'SmartBlood Connect is not liable for medical outcomes',
            'Platform may suspend accounts for policy violations'
          ]
        }
      ]
    } : {
      title: 'സേവന നിബന്ധനകൾ',
      lastUpdated: 'ജനുവരി 2025',
      content: [
        {
          section: 'പ്ലാറ്റ്ഫോം ഉപയോഗം',
          details: [
            'സ്മാർട്ട് ബ്ലഡ് കണക്ട് രക്തദാന കോർഡിനേഷനുള്ള സൗജന്യ പ്ലാറ്റ്ഫോമാണ്',
            'ഉപയോക്താക്കൾ കൃത്യവും അപ്ഡേറ്റും ആയ വിവരങ്ങൾ നൽകണം',
            'പ്ലാറ്റ്ഫോം 24/7 ലഭ്യമാണ് എന്നാൽ പരിപാലന കാലയളവുകൾ ഉണ്ടാകാം',
            'ഉപയോക്താക്കൾ അക്കൗണ്ട് സുരക്ഷ നിലനിർത്താൻ ഉത്തരവാദികളാണ്'
          ]
        },
        {
          section: 'ദാനി ഉത്തരവാദിത്തങ്ങൾ',
          details: [
            'രക്തദാനത്തിനുള്ള യോഗ്യതാ ആവശ്യകതകൾ നിലനിർത്തുക',
            'ലഭ്യമാകുമ്പോൾ രക്ത അഭ്യർത്ഥനകൾക്ക് തൽക്ഷണം പ്രതികരിക്കുക',
            'ലഭ്യതാ സ്റ്റാറ്റസ് നിരന്തരം അപ്ഡേറ്റ് ചെയ്യുക',
            'മെഡിക്കൽ മാർഗ്ഗനിർദ്ദേശങ്ങളും സുരക്ഷാ പ്രോട്ടോക്കോളുകളും പാലിക്കുക'
          ]
        },
        {
          section: 'ആശുപത്രി ഉത്തരവാദിത്തങ്ങൾ',
          details: [
            'രോഗി വിവരങ്ങളും രക്ത ആവശ്യകതകളും സ്ഥിരീകരിക്കുക',
            'ദാനികളുമായി പ്രൊഫഷണലും ആദരവോടെയും കോർഡിനേറ്റ് ചെയ്യുക',
            'ദാനി വിവരങ്ങളുടെ ഗോപ്യത നിലനിർത്തുക',
            'ഏതെങ്കിലും പ്രശ്നങ്ങളോ സങ്കീർണതകളോ തൽക്ഷണം റിപ്പോർട്ട് ചെയ്യുക'
          ]
        },
        {
          section: 'പരിമിതികൾ',
          details: [
            'പ്ലാറ്റ്ഫോം ദാനി ലഭ്യത ഉറപ്പാക്കുന്നില്ല',
            'ഉപയോക്താക്കൾ അവരുടെ സ്വന്തം മെഡിക്കൽ തീരുമാനങ്ങൾക്ക് ഉത്തരവാദികളാണ്',
            'മെഡിക്കൽ ഫലങ്ങൾക്ക് സ്മാർട്ട് ബ്ലഡ് കണക്ട് ഉത്തരവാദിയല്ല',
            'നയ ലംഘനങ്ങൾക്ക് പ്ലാറ്റ്ഫോം അക്കൗണ്ടുകൾ സസ്പെൻഡ് ചെയ്യാം'
          ]
        }
      ]
    }
  };

  const renderPolicyContent = (policy) => (
    <div className="policy-content">
      <div className="policy-header">
        <h2 className="policy-title">{policy.title}</h2>
        <p className="policy-date">
          {language === 'en' ? 'Last Updated:' : 'അവസാനം അപ്ഡേറ്റ് ചെയ്തത്:'} {policy.lastUpdated}
        </p>
      </div>
      
      <div className="policy-sections">
        {policy.content.map((section, index) => (
          <div key={index} className="policy-section">
            <h3 className="section-title">{section.section}</h3>
            <ul className="section-details">
              {section.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="detail-item">
                  <span className="detail-bullet">•</span>
                  <span className="detail-text">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="policies-page">
      {/* Hero Section */}
      <section ref={heroRef} className="policies-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {language === 'en' ? 'Policies & Guidelines' : 'നയങ്ങളും മാർഗ്ഗനിർദ്ദേശങ്ങളും'}
            </h1>
            <p className="hero-subtitle">
              {language === 'en'
                ? 'Comprehensive information about our policies, terms, and guidelines.'
                : 'ഞങ്ങളുടെ നയങ്ങൾ, നിബന്ധനകൾ, മാർഗ്ഗനിർദ്ദേശങ്ങൾ എന്നിവയെക്കുറിച്ചുള്ള സമഗ്ര വിവരങ്ങൾ.'}
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="policies-nav">
        <div className="container">
          <nav ref={navRef} className="policy-navigation">
            {sections.map((section, index) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-title">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Content Section */}
      <section className="policies-content">
        <div className="container">
          <div 
            ref={el => contentRefs.current[0] = el}
            className="content-wrapper"
          >
            {policyContent[activeSection] && renderPolicyContent(policyContent[activeSection])}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="policies-contact">
        <div className="container">
          <div ref={el => contentRefs.current[1] = el} className="contact-content">
            <h2>
              {language === 'en' ? 'Questions About Our Policies?' : 'ഞങ്ങളുടെ നയങ്ങളെക്കുറിച്ച് ചോദ്യങ്ങൾ?'}
            </h2>
            <p>
              {language === 'en'
                ? 'Contact our legal team for clarification on any policy or guideline.'
                : 'ഏതെങ്കിലും നയത്തെക്കുറിച്ചോ മാർഗ്ഗനിർദ്ദേശത്തെക്കുറിച്ചോ വ്യക്തതയ്ക്കായി ഞങ്ങളുടെ നിയമ ടീമുമായി ബന്ധപ്പെടുക.'}
            </p>
            <div className="contact-buttons">
              <Link to="/contact" className="btn btn--primary btn--large">
                {language === 'en' ? 'Contact Legal Team' : 'നിയമ ടീമുമായി ബന്ധപ്പെടുക'}
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
