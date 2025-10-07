import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.admin);
  
  // Use refs to prevent unnecessary re-renders
  const isCheckingRef = useRef(true);
  const hasNavigatedRef = useRef(false);
  const lastPathRef = useRef(location.pathname);
  const authCheckTimeoutRef = useRef(null);
  
  // Stable state for rendering
  const [renderState, setRenderState] = useState({
    showLoading: true,
    showContent: false,
    isInitialized: false
  });

  // Enhanced debounced navigation to prevent rapid redirects
  const debouncedNavigate = useCallback((path, options = {}) => {
    if (hasNavigatedRef.current) return;
    
    // Clear any existing timeout
    if (authCheckTimeoutRef.current) {
      clearTimeout(authCheckTimeoutRef.current);
    }
    
    hasNavigatedRef.current = true;
    
    // Add a small delay to ensure state is stable
    authCheckTimeoutRef.current = setTimeout(() => {
      navigate(path, { replace: true, ...options });
      
      // Reset navigation flag after navigation
      setTimeout(() => {
        hasNavigatedRef.current = false;
      }, 200);
    }, 100);
  }, [navigate]);

  // Enhanced authentication check with better state management
  const checkAuthentication = useCallback(() => {
    // Clear any existing timeout
    if (authCheckTimeoutRef.current) {
      clearTimeout(authCheckTimeoutRef.current);
    }
    
    // Only proceed if not loading and path has changed or first check
    if (isLoading || (lastPathRef.current === location.pathname && renderState.isInitialized)) {
      return;
    }

    lastPathRef.current = location.pathname;
    isCheckingRef.current = false;

    const isAuth = isAuthenticated && user;
    const isLoginPage = location.pathname === "/admin/login";

    // Add a small delay to ensure state is stable
    authCheckTimeoutRef.current = setTimeout(() => {
      if (!isAuth) {
        // Not authenticated
        if (!isLoginPage) {
          setRenderState({ showLoading: false, showContent: false, isInitialized: true });
          debouncedNavigate("/admin/login");
          return;
        }
        // On login page and not authenticated - show login
        setRenderState({ showLoading: false, showContent: true, isInitialized: true });
      } else {
        // Authenticated
        if (isLoginPage) {
          setRenderState({ showLoading: false, showContent: false, isInitialized: true });
          debouncedNavigate("/admin/dashboard");
          return;
        }
        // On protected page and authenticated - show content
        setRenderState({ showLoading: false, showContent: true, isInitialized: true });
      }
    }, 50);
  }, [isAuthenticated, user, isLoading, location.pathname, debouncedNavigate, renderState.isInitialized]);

  // Effect for authentication checking
  useEffect(() => {
    checkAuthentication();
    
    // Cleanup timeout on unmount
    return () => {
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
      }
    };
  }, [checkAuthentication]);

  // Enhanced loading state with soft blood gradient theme
  if (renderState.showLoading || isCheckingRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #ffe8e8 0%, #ffd6d6 15%, #ffc4c4 30%, #ffb3b3 45%, #ffa1a1 60%, #ff8f8f 75%, #ff7d7d 90%, #ff6b6b 100%)'
      }}>
        <div className="text-center">
          <div className="spinner mx-auto mb-4 w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Checking authentication...</p>
          <p className="text-gray-600 text-sm mt-2">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Show content only when stable
  if (renderState.showContent && renderState.isInitialized) {
    return children;
  }

  // Default: show nothing (prevents flashing)
  return null;
};

export default AdminRouteGuard;