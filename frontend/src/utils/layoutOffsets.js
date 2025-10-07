/**
 * Layout offset utility for dynamic header and alert bar heights
 * Optimized to prevent forced reflows and improve performance
 */

let lastHeaderHeight = 0;
let lastAlertsHeight = 0;
let isInitialized = false;
let isUpdating = false;

export function syncHeaderAlertHeights() {
  // Prevent concurrent updates
  if (isUpdating) return;
  
  try {
    isUpdating = true;
    
    // Use requestIdleCallback for better performance
    const performSync = () => {
      try {
        const header = document.querySelector('.header--fixed, .header');
        const alertsBar = document.querySelector('.alerts-bar');
        
        let headerHeight = 76; // Default fallback
        let alertsHeight = 48; // Default fallback
        
        // Batch all DOM reads to prevent forced reflows
        if (header) {
          const rect = header.getBoundingClientRect();
          headerHeight = Math.round(rect.height);
        }
        
        if (alertsBar) {
          const rect = alertsBar.getBoundingClientRect();
          alertsHeight = Math.round(rect.height);
        }
        
        // Only update if heights have changed or it's the first run
        if (!isInitialized || headerHeight !== lastHeaderHeight || alertsHeight !== lastAlertsHeight) {
          const root = document.documentElement;
          const combinedHeight = headerHeight + alertsHeight;
          
          // Use CSS custom properties in a single batch to prevent forced reflow
          const newStyles = {
            '--header-height': `${headerHeight}px`,
            '--alerts-height': `${alertsHeight}px`,
            '--combined-offset': `${combinedHeight}px`
          };
          
          // Apply all styles at once
          Object.assign(root.style, newStyles);
          
          lastHeaderHeight = headerHeight;
          lastAlertsHeight = alertsHeight;
          isInitialized = true;
        }
        
        isUpdating = false;
        
      } catch (error) {
        console.warn('Layout offset sync failed:', error);
        isUpdating = false;
      }
    };
    
    // Use requestIdleCallback for better performance
    if (window.requestIdleCallback) {
      requestIdleCallback(performSync, { timeout: 100 });
    } else {
      // Fallback to requestAnimationFrame
      requestAnimationFrame(performSync);
    }
    
  } catch (error) {
    console.warn('Layout offset sync failed:', error);
    isUpdating = false;
  }
}

// Debounced resize handler with better performance
let resizeTimeout;
let isResizing = false;

function debouncedSync() {
  if (isResizing) return; // Prevent multiple calls during resize
  
  isResizing = true;
  clearTimeout(resizeTimeout);
  
  resizeTimeout = setTimeout(() => {
    syncHeaderAlertHeights();
    isResizing = false;
  }, 150); // Increased debounce time for better performance
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
