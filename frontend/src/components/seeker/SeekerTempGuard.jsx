import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const hasTempToken = () => typeof window !== 'undefined' && !!localStorage.getItem('seeker_temp_token');

const SeekerTempGuard = ({ children }) => {
  const location = useLocation();
  if (!hasTempToken()) {
    return <Navigate to="/seeker/login" replace state={{ from: location }} />;
  }
  return children;
};

export default SeekerTempGuard;
