// src/components/Nav.jsx
import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/nav.css'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const headerRef = useRef(null)

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
  const toggleLanguage = () => setLanguage(language === 'en' ? 'ml' : 'en')

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
          <NavLink className="header__link" to="/">Home</NavLink>
          <NavLink className="header__link" to="/find">Find Blood</NavLink>
          <NavLink className="header__link" to="/donate">Donate Blood</NavLink>
          <NavLink className="header__link" to="/center/login">Blood Bank Login</NavLink>
          <NavLink className="header__link" to="/dashboard">Dashboard</NavLink>
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
          <NavLink className="header__link" to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink className="header__link" to="/find" onClick={() => setOpen(false)}>Find Blood</NavLink>
          <NavLink className="header__link" to="/donate" onClick={() => setOpen(false)}>Donate Blood</NavLink>
          <NavLink className="header__link" to="/center/login" onClick={() => setOpen(false)}>Blood Bank Login</NavLink>
          <NavLink className="header__link" to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink className="btn btn--outline" to="/auth" onClick={() => setOpen(false)}>Register / Login</NavLink>
        </div>
      )}
    </header>
  )
}
