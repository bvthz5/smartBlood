/**
 * Navigation Optimizer
 * Prevents authentication checks during internal navigation
 */

// Cache for navigation state
let navigationCache = {
  isNavigating: false,
  lastPath: null,
  navigationTimeout: null
};

// Optimized navigation function
export const optimizedNavigate = (navigate, path, options = {}) => {
  // Clear any existing navigation timeout
  if (navigationCache.navigationTimeout) {
    clearTimeout(navigationCache.navigationTimeout);
  }

  // Set navigation flag to prevent auth checks
  navigationCache.isNavigating = true;
  navigationCache.lastPath = path;

  // Use requestIdleCallback for smooth navigation
  if (window.requestIdleCallback) {
    navigationCache.navigationTimeout = requestIdleCallback(() => {
      navigate(path, options);
      // Reset navigation flag after a short delay
      setTimeout(() => {
        navigationCache.isNavigating = false;
      }, 100);
    }, { timeout: 50 });
  } else {
    navigationCache.navigationTimeout = setTimeout(() => {
      navigate(path, options);
      // Reset navigation flag after a short delay
      setTimeout(() => {
        navigationCache.isNavigating = false;
      }, 100);
    }, 0);
  }
};

// Check if currently navigating
export const isNavigating = () => {
  return navigationCache.isNavigating;
};

// Get last navigation path
export const getLastNavigationPath = () => {
  return navigationCache.lastPath;
};

// Reset navigation state
export const resetNavigationState = () => {
  navigationCache.isNavigating = false;
  navigationCache.lastPath = null;
  if (navigationCache.navigationTimeout) {
    clearTimeout(navigationCache.navigationTimeout);
    navigationCache.navigationTimeout = null;
  }
};
