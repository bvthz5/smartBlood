import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.admin);
  
  // Check if user is authenticated and has a valid token
  if (!isAuthenticated || !user) {
    return <Navigate to="/donor/login" replace />;
  }
  
  return children;
}
