import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#DC2626',      // Emergency Red
      secondary: '#2563EB',    // Trust Blue
      background: '#FFFFFF',
      surface: '#F8FAFC',
      surfaceVariant: '#F1F5F9',
      text: '#1E293B',
      textSecondary: '#64748B',
      textMuted: '#94A3B8',
      border: '#E2E8F0',
      borderLight: '#F1F5F9',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
      secondary: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      surface: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 4px 12px rgba(0, 0, 0, 0.15)',
      lg: '0 8px 25px rgba(0, 0, 0, 0.2)',
      xl: '0 20px 40px rgba(0, 0, 0, 0.25)',
      glow: '0 0 20px rgba(220, 38, 38, 0.3)',
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#EF4444',
      secondary: '#3B82F6',
      background: '#0F172A',
      surface: '#1E293B',
      surfaceVariant: '#334155',
      text: '#F1F5F9',
      textSecondary: '#CBD5E1',
      textMuted: '#94A3B8',
      border: '#334155',
      borderLight: '#475569',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      secondary: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      surface: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
      md: '0 4px 12px rgba(0, 0, 0, 0.4)',
      lg: '0 8px 25px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 40px rgba(0, 0, 0, 0.6)',
      glow: '0 0 20px rgba(239, 68, 68, 0.4)',
    }
  },
  blue: {
    name: 'Medical Blue',
    colors: {
      primary: '#1D4ED8',
      secondary: '#0369A1',
      background: '#F0F9FF',
      surface: '#E0F2FE',
      surfaceVariant: '#BAE6FD',
      text: '#0C4A6E',
      textSecondary: '#0369A1',
      textMuted: '#0284C7',
      border: '#BAE6FD',
      borderLight: '#E0F2FE',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#1D4ED8',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
      secondary: 'linear-gradient(135deg, #0369A1 0%, #0284C7 100%)',
      success: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      warning: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      error: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      surface: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    },
    shadows: {
      sm: '0 1px 3px rgba(29, 78, 216, 0.1)',
      md: '0 4px 12px rgba(29, 78, 216, 0.15)',
      lg: '0 8px 25px rgba(29, 78, 216, 0.2)',
      xl: '0 20px 40px rgba(29, 78, 216, 0.25)',
      glow: '0 0 20px rgba(29, 78, 216, 0.3)',
    }
  },
  red: {
    name: 'Emergency Red',
    colors: {
      primary: '#DC2626',
      secondary: '#991B1B',
      background: '#FEF2F2',
      surface: '#FECACA',
      surfaceVariant: '#FCA5A5',
      text: '#7F1D1D',
      textSecondary: '#991B1B',
      textMuted: '#B91C1C',
      border: '#FCA5A5',
      borderLight: '#FECACA',
      success: '#065F46',
      warning: '#92400E',
      error: '#B91C1C',
      info: '#1E40AF',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
      secondary: 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)',
      success: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
      warning: 'linear-gradient(135deg, #92400E 0%, #B45309 100%)',
      error: 'linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)',
      surface: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)',
    },
    shadows: {
      sm: '0 1px 3px rgba(220, 38, 38, 0.1)',
      md: '0 4px 12px rgba(220, 38, 38, 0.15)',
      lg: '0 8px 25px rgba(220, 38, 38, 0.2)',
      xl: '0 20px 40px rgba(220, 38, 38, 0.25)',
      glow: '0 0 20px rgba(220, 38, 38, 0.3)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('bloodBankTheme') || 'light';
    setCurrentTheme(savedTheme);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const theme = themes[currentTheme];
    const root = document.documentElement;

    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply gradient variables
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });

    // Apply shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Set theme attribute for CSS targeting
    root.setAttribute('data-theme', currentTheme);

    // Save to localStorage
    localStorage.setItem('bloodBankTheme', currentTheme);
  }, [currentTheme, isLoading]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes: Object.keys(themes),
    changeTheme,
    isLoading
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--color-background)',
        color: 'var(--color-text)'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          Loading SmartBlood...
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
