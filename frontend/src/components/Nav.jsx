// src/components/Nav.jsx
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import AuthDropdown from './AuthDropdown'
import '../styles/nav.css'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const headerRef = useRef(null)
  const location = useLocation()

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return
      if (window.scrollY > 8) headerRef.current.classList.add('scrolled')
      else headerRef.current.classList.remove('scrolled')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ml' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLanguage }))
  }

  const handleAboutClick = (e) => {
    e.preventDefault()
    const aboutElement = document.getElementById('about')
    if (aboutElement) {
      aboutElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Hide navbar completely on register/login pages
  if (location.pathname === '/register' || location.pathname === '/login') {
    return (
      <div className="auth-page-header">
        <div className="container">
          <div className="auth-header-content">
            <div className="auth-logo">
              <img src="/logo.png" alt="Smart Blood logo" />
              <span>Smart Blood</span>
            </div>
            <AuthDropdown />
          </div>
        </div>
      </div>
    )
  }

  // Home page - fixed navbar with minimal items
  if (location.pathname === '/') {
    return (
      <header className="header header--fixed" role="banner" ref={headerRef} style={{ zIndex: 999 }}>
        <div className="container header__inner">
          <div className="header__brand">
            <NavLink to="/" className="header__logo-link" aria-label="Smart Blood home">
              <div className="header__logo-wrap" aria-hidden>
                <img src="/logo.png" alt="Smart Blood logo" />
              </div>
              <div className="header__titles">
                <div className="site-title">Smart Blood</div>
                <div className="site-sub">Connect &amp; Save Lives</div>
              </div>
            </NavLink>
          </div>

          <nav className="header__nav" role="navigation" aria-label="Main navigation">
            <button className="header__link header__link--button" onClick={handleAboutClick}>About</button>
            <NavLink className="header__link" to="/seeker/request">Find Blood</NavLink>
            <NavLink className="header__link" to="/donor/register">Donate Blood</NavLink>
          </nav>

          <div className="header__actions">
            <div className="header__controls">
              <button 
                className="header__toggle-btn" 
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button 
                className="header__toggle-btn" 
                onClick={toggleLanguage}
                aria-label="Toggle language"
              >
                {language === 'en' ? '🌐 English' : '🌐 മലയാളം'}
              </button>
            </div>
            <NavLink to="/donor/register" className="btn header__cta" aria-label="Register or Login">
              {language === 'en' ? 'Register / Login' : 'രജിസ്റ്റർ / ലോഗിൻ'}
            </NavLink>

            <button
              className="header__mobile-toggle"
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen(v => !v)}
            >
              <span className="visually-hidden">Toggle navigation</span>
              <span aria-hidden>{open ? '\u2715' : '\u2630'}</span>
            </button>
          </div>
        </div>

        {open && (
          <div className="header__mobile" role="menu">
            <button className="header__link header__link--button" onClick={(e) => { handleAboutClick(e); setOpen(false); }}>About</button>
            <NavLink className="header__link" to="/seeker/request" onClick={() => setOpen(false)}>Find Blood</NavLink>
            <NavLink className="header__link" to="/donor/register" onClick={() => setOpen(false)}>Donate Blood</NavLink>
            <NavLink className="btn btn--outline" to="/donor/register" onClick={() => setOpen(false)}>Register / Login</NavLink>
          </div>
        )}
      </header>
    )
  }

  // Other pages - normal navbar without removed items
  return (
    <header className="header" role="banner" ref={headerRef}>
      <div className="container header__inner">
        <div className="header__brand">
          <NavLink to="/" className="header__logo-link" aria-label="Smart Blood home">
            <div className="header__logo-wrap" aria-hidden>
              <img src="/logo.png" alt="Smart Blood logo" />
            </div>
            <div className="header__titles">
              <div className="site-title">Smart Blood</div>
              <div className="site-sub">Connect &amp; Save Lives</div>
            </div>
          </NavLink>
        </div>

        <nav className="header__nav" role="navigation" aria-label="Main navigation">
          <NavLink className="header__link" to="/seeker/request">Find Blood</NavLink>
          <NavLink className="header__link" to="/donor/register">Donate Blood</NavLink>
        </nav>

        <div className="header__actions">
          <div className="header__controls">
            <button 
              className="header__toggle-btn" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button 
              className="header__toggle-btn" 
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              {language === 'en' ? '🌐 English' : '🌐 മലയാളം'}
            </button>
          </div>
          <NavLink to="/donor/register" className="btn header__cta" aria-label="Register or Login">
            {language === 'en' ? 'Register / Login' : 'രജിസ്റ്റർ / ലോഗിൻ'}
          </NavLink>

          <button
            className="header__mobile-toggle"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen(v => !v)}
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span aria-hidden>{open ? '\u2715' : '\u2630'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="header__mobile" role="menu">
          <NavLink className="header__link" to="/seeker/request" onClick={() => setOpen(false)}>Find Blood</NavLink>
          <NavLink className="header__link" to="/donor/register" onClick={() => setOpen(false)}>Donate Blood</NavLink>
          <NavLink className="btn btn--outline" to="/donor/register" onClick={() => setOpen(false)}>Register / Login</NavLink>
        </div>
      )}
    </header>
  )
}
