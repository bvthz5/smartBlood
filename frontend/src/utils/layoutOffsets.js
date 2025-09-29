/**
 * Layout offset utility for dynamic header and alert bar heights
 * Ensures proper spacing between fixed elements and content
 */

let lastHeaderHeight = 0;
let lastAlertsHeight = 0;
let isInitialized = false;

export function syncHeaderAlertHeights() {
  try {
    const header = document.querySelector('.header--fixed, .header');
    const alertsBar = document.querySelector('.alerts-bar');
    
    let headerHeight = 76; // Default fallback
    let alertsHeight = 48; // Default fallback
    
    if (header) {
      headerHeight = header.offsetHeight;
    }
    
    if (alertsBar) {
      alertsHeight = alertsBar.offsetHeight;
    }
    
    // Only update if heights have changed or it's the first run
    if (!isInitialized || headerHeight !== lastHeaderHeight || alertsHeight !== lastAlertsHeight) {
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      document.documentElement.style.setProperty('--alerts-height', `${alertsHeight}px`);
      
      // Set combined offset for hero sections
      const combinedHeight = headerHeight + alertsHeight;
      document.documentElement.style.setProperty('--combined-offset', `${combinedHeight}px`);
      
      lastHeaderHeight = headerHeight;
      lastAlertsHeight = alertsHeight;
      isInitialized = true;
    }
    
  } catch (error) {
    console.warn('Layout offset sync failed:', error);
    // Fallback values
    document.documentElement.style.setProperty('--header-height', '76px');
    document.documentElement.style.setProperty('--alerts-height', '48px');
    document.documentElement.style.setProperty('--combined-offset', '124px');
  }
}

// Debounced resize handler
let resizeTimeout;
function debouncedSync() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(syncHeaderAlertHeights, 100);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncHeaderAlertHeights);
} else {
  syncHeaderAlertHeights();
}

// Re-sync on window resize (debounced)
window.addEventListener('resize', debouncedSync);

// Re-sync on route changes (for SPA)
window.addEventListener('popstate', debouncedSync);
