// src/pages/Contact.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/contact.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const heroRef = useRef(null);
  const contactRefs = useRef([]);

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

    // Contact sections animation
    ScrollTrigger.batch(contactRefs.current, {
      onEnter: (elements) => {
        gsap.fromTo(elements,
          { opacity: 0, y: 40 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.2,
            ease: "power3.out"
          }
        );
      },
      start: "top 85%"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 2000);
  };

  const contactInfo = language === 'en' ? [
    {
      icon: 'MapPin',
      title: 'Office Address',
      details: [
        'SmartBlood Connect Headquarters',
        'Technopark Campus, Trivandrum',
        'Kerala, India - 695581'
      ]
    },
    {
      icon: '📞',
      title: 'Phone Numbers',
      details: [
        'Emergency Hotline: +91 9847 000 000',
        'Support: +91 471 234 5678',
        'General Inquiries: +91 471 234 5679'
      ]
    },
    {
      icon: 'Email',
      title: 'Email Addresses',
      details: [
        'support@smartbloodconnect.com',
        'emergency@smartbloodconnect.com',
        'partnerships@smartbloodconnect.com'
      ]
    },
    {
      icon: '⏰',
      title: 'Working Hours',
      details: [
        'Emergency Services: 24/7',
        'Support Team: 8 AM - 8 PM',
        'Office Hours: 9 AM - 6 PM'
      ]
    }
  ] : [
    {
      icon: 'MapPin',
      title: 'ഓഫീസ് വിലാസം',
      details: [
        'സ്മാർട്ട് ബ്ലഡ് കണക്ട് ആസ്ഥാനം',
        'ടെക്നോപാർക്ക് കാമ്പസ്, തിരുവനന്തപുരം',
        'കേരളം, ഇന്ത്യ - 695581'
      ]
    },
    {
      icon: '📞',
      title: 'ഫോൺ നമ്പറുകൾ',
      details: [
        'അടിയന്തര ഹോട്ട്‌ലൈൻ: +91 9847 000 000',
        'പിന്തുണ: +91 471 234 5678',
        'പൊതു അന്വേഷണങ്ങൾ: +91 471 234 5679'
      ]
    },
    {
      icon: 'Email',
      title: 'ഇമെയിൽ വിലാസങ്ങൾ',
      details: [
        'support@smartbloodconnect.com',
        'emergency@smartbloodconnect.com',
        'partnerships@smartbloodconnect.com'
      ]
    },
    {
      icon: '⏰',
      title: 'പ്രവർത്തന സമയം',
      details: [
        'അടിയന്തര സേവനങ്ങൾ: 24/7',
        'പിന്തുണ ടീം: രാവിലെ 8 - വൈകുന്നേരം 8',
        'ഓഫീസ് സമയം: രാവിലെ 9 - വൈകുന്നേരം 6'
      ]
    }
  ];

  const inquiryTypes = language === 'en' ? [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media Inquiry' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'complaint', label: 'Complaint' }
  ] : [
    { value: 'general', label: 'പൊതു അന്വേഷണം' },
    { value: 'support', label: 'സാങ്കേതിക പിന്തുണ' },
    { value: 'partnership', label: 'പങ്കാളിത്തം' },
    { value: 'media', label: 'മീഡിയ അന്വേഷണം' },
    { value: 'feedback', label: 'ഫീഡ്‌ബാക്ക്' },
    { value: 'complaint', label: 'പരാതി' }
  ];

  return (
    <main className="contact-page">
      {/* Hero Section */}
      <section ref={heroRef} className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {language === 'en' ? 'Contact Us' : 'ഞങ്ങളെ ബന്ധപ്പെടുക'}
            </h1>
            <p className="hero-subtitle">
              {language === 'en'
                ? 'Get in touch with our team. We\'re here to help you 24/7.'
                : 'ഞങ്ങളുടെ ടീമുമായി ബന്ധപ്പെടുക. 24/7 നിങ്ങളെ സഹായിക്കാൻ ഞങ്ങൾ ഇവിടെയുണ്ട്.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-grid">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                ref={el => contactRefs.current[index] = el}
                className="contact-card"
              >
                <div className="card-icon">{info.icon}</div>
                <h3 className="card-title">{info.title}</h3>
                <div className="card-details">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="detail-item">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div ref={el => contactRefs.current[4] = el} className="form-container">
            <div className="form-header">
              <h2>
                {language === 'en' ? 'Send us a Message' : 'ഞങ്ങൾക്ക് ഒരു സന്ദേശം അയയ്ക്കുക'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Fill out the form below and we\'ll get back to you within 24 hours.'
                  : 'ചുവടെയുള്ള ഫോം പൂരിപ്പിച്ച് ഞങ്ങൾ 24 മണിക്കൂറിനുള്ളിൽ നിങ്ങളെ ബന്ധപ്പെടും.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    {language === 'en' ? 'Full Name' : 'പൂർണ്ണ പേര്'} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder={language === 'en' ? 'Enter your full name' : 'നിങ്ങളുടെ പൂർണ്ണ പേര് നൽകുക'}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    {language === 'en' ? 'Email Address' : 'ഇമെയിൽ വിലാസം'} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder={language === 'en' ? 'Enter your email' : 'നിങ്ങളുടെ ഇമെയിൽ നൽകുക'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">
                    {language === 'en' ? 'Inquiry Type' : 'അന്വേഷണ തരം'} *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">
                    {language === 'en' ? 'Subject' : 'വിഷയം'} *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder={language === 'en' ? 'Brief subject line' : 'ചുരുങ്ങിയ വിഷയ വരി'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  {language === 'en' ? 'Message' : 'സന്ദേശം'} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="form-textarea"
                  placeholder={language === 'en' ? 'Tell us how we can help you...' : 'നിങ്ങളെ എങ്ങനെ സഹായിക്കാമെന്ന് ഞങ്ങളോട് പറയുക...'}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn--primary btn--large ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      {language === 'en' ? 'Sending...' : 'അയയ്ക്കുന്നു...'}
                    </>
                  ) : (
                    language === 'en' ? 'Send Message' : 'സന്ദേശം അയയ്ക്കുക'
                  )}
                </button>
              </div>

              {submitStatus && (
                <div className={`submit-status ${submitStatus}`}>
                  <div className="status-icon">
                    {submitStatus === 'success' ? 'Success' : 'Error'}
                  </div>
                  <div className="status-message">
                    {submitStatus === 'success' 
                      ? (language === 'en' 
                          ? 'Message sent successfully! We\'ll get back to you soon.' 
                          : 'സന്ദേശം വിജയകരമായി അയച്ചു! ഞങ്ങൾ ഉടനെ നിങ്ങളെ ബന്ധപ്പെടും.')
                      : (language === 'en'
                          ? 'Failed to send message. Please try again.'
                          : 'സന്ദേശം അയയ്ക്കാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.')
                    }
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-section">
        <div className="container">
          <div ref={el => contactRefs.current[5] = el} className="emergency-content">
            <div className="emergency-icon">🚨</div>
            <h2>
              {language === 'en' ? 'Emergency Blood Request?' : 'അടിയന്തര രക്ത അഭ്യർത്ഥന?'}
            </h2>
            <p>
              {language === 'en'
                ? 'For urgent blood requests, call our emergency hotline immediately.'
                : 'അടിയന്തര രക്ത അഭ്യർത്ഥനകൾക്ക്, ഞങ്ങളുടെ അടിയന്തര ഹോട്ട്‌ലൈനിൽ ഉടനെ വിളിക്കുക.'}
            </p>
            <a href="tel:+919847000000" className="btn btn--emergency">
              📞 {language === 'en' ? 'Call Emergency Line' : 'അടിയന്തര ലൈൻ വിളിക്കുക'}
            </a>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="back-home-section">
        <div className="container">
          <div className="back-home-content">
            <Link to="/" className="btn btn--outline btn--large">
              {language === 'en' ? 'Back to Home' : 'ഹോമിലേക്ക് മടങ്ങുക'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
