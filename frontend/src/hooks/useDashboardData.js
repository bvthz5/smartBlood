import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../store/slices/adminSlice";

/**
 * Custom hook for managing dashboard data loading and state
 * Follows React Hooks rules and provides stable state management
 */
export const useDashboardData = () => {
  const dispatch = useDispatch();
  const { dashboardData, isLoading, error } = useSelector((state) => state.admin);
  
  // Use refs to prevent unnecessary re-renders
  const dataLoadedRef = useRef(false);
  const isInitializingRef = useRef(false);
  
  // Stable state for rendering
  const [renderState, setRenderState] = useState({
    showLoading: true,
    showContent: false,
    hasError: false
  });

  // Memoize the load data function to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    if (isInitializingRef.current || dataLoadedRef.current) return;
    
    isInitializingRef.current = true;
    
    try {
      await dispatch(fetchDashboardData()).unwrap();
      dataLoadedRef.current = true;
      setRenderState({ showLoading: false, showContent: true, hasError: false });
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      dataLoadedRef.current = true;
      setRenderState({ showLoading: false, showContent: false, hasError: true });
    } finally {
      isInitializingRef.current = false;
    }
  }, [dispatch]);

  // Memoize retry handler
  const retry = useCallback(() => {
    dataLoadedRef.current = false;
    setRenderState({ showLoading: true, showContent: false, hasError: false });
    loadData();
  }, [loadData]);

  // Fetch dashboard data on mount with performance optimization
  useEffect(() => {
    // Only load if not already loaded
    if (!dataLoadedRef.current && !isInitializingRef.current) {
      // Use requestIdleCallback for better performance
      if (window.requestIdleCallback) {
        requestIdleCallback(() => {
          loadData();
        }, { timeout: 500 });
      } else {
        // Fallback to setTimeout
        setTimeout(loadData, 0);
      }
    }
  }, [loadData]);

  return {
    dashboardData,
    renderState,
    retry,
    error
  };
};
