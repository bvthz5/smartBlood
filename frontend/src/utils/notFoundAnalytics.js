// src/utils/notFoundAnalytics.js - Analytics and utility functions for 404 page

/**
 * Analytics tracking for 404 page
 */
export const track404View = (path, referrer) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', '404_viewed', {
      page_path: path,
      page_referrer: referrer || 'direct',
      event_category: 'Error',
      event_label: 'Page Not Found'
    });
  }

  // Custom analytics event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('404_viewed', {
      detail: {
        path,
        referrer: referrer || 'direct',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    }));
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('404 Page View Tracked:', { path, referrer });
  }
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (label, path) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', '404_cta_click', {
      cta_label: label,
      page_path: path,
      event_category: 'Error Recovery',
      event_label: label
    });
  }

  // Custom analytics event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('404_cta_click', {
      detail: {
        label,
        path,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }
    }));
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('404 CTA Click Tracked:', { label, path });
  }
};

/**
 * Track broken link reports
 */
export const trackBrokenLinkReport = (url, userAgent, additionalInfo = '') => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'broken_link_reported', {
      broken_url: url,
      event_category: 'Error Reporting',
      event_label: 'Broken Link Report'
    });
  }

  // Custom analytics event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('broken_link_reported', {
      detail: {
        url,
        userAgent,
        additionalInfo,
        timestamp: Date.now()
      }
    }));
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Broken Link Report Tracked:', { url, userAgent, additionalInfo });
  }
};

/**
 * Performance monitoring for 404 page
 */
export const track404Performance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = window.performance.getEntriesByType('navigation')[0];
    const paint = window.performance.getEntriesByType('paint');
    
    const metrics = {
      loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      timestamp: Date.now()
    };

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', '404_performance', {
        load_time: Math.round(metrics.loadTime),
        dom_content_loaded: Math.round(metrics.domContentLoaded),
        first_paint: Math.round(metrics.firstPaint),
        first_contentful_paint: Math.round(metrics.firstContentfulPaint),
        event_category: 'Performance'
      });
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('404 Page Performance:', metrics);
    }
  }
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

/**
 * Lazy load animation assets
 */
export const lazyLoadAnimation = (callback) => {
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback if available, otherwise setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 100);
    }
  }
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined' && document) {
    // Use requestIdleCallback for better performance
    const preloadResources = () => {
      // Preload logo
      const logoLink = document.createElement('link');
      logoLink.rel = 'preload';
      logoLink.as = 'image';
      logoLink.href = '/logo.png';
      logoLink.style.display = 'none'; // Hide to prevent layout impact
      document.head.appendChild(logoLink);

      // Preload fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.href = 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2';
      fontLink.crossOrigin = 'anonymous';
      fontLink.style.display = 'none'; // Hide to prevent layout impact
      document.head.appendChild(fontLink);
    };

    if (window.requestIdleCallback) {
      requestIdleCallback(preloadResources, { timeout: 1000 });
    } else {
      setTimeout(preloadResources, 0);
    }
  }
};

/**
 * Initialize 404 page analytics and performance tracking
 */
export const initialize404Page = (path, referrer) => {
  // Track page view
  track404View(path, referrer);

  // Track performance after page load
  if (document.readyState === 'complete') {
    track404Performance();
  } else {
    window.addEventListener('load', track404Performance);
  }

  // Preload critical resources
  preloadCriticalResources();
};

export default {
  track404View,
  trackCTAClick,
  trackBrokenLinkReport,
  track404Performance,
  prefersReducedMotion,
  lazyLoadAnimation,
  preloadCriticalResources,
  initialize404Page
};
