import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Policies from './pages/Policies';
import NotFound from './pages/NotFound';

// Donor Pages - Removed (not ready to start)

// Seeker Pages
import SeekerRequest from './pages/seeker/SeekerRequest';
import SeekerLogin from './pages/seeker/SeekerLogin';
import SeekerDashboard from './pages/seeker/SeekerDashboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardNew from './pages/admin/AdminDashboardNew';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import DonorManagement from './pages/admin/DonorManagement';
import HospitalManagement from './pages/admin/HospitalManagement';
import BloodMatching from './pages/admin/BloodMatching';
import DonationRequests from './pages/admin/DonationRequests';
import DonationHistory from './pages/admin/DonationHistory';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRouteGuard from './components/AdminRouteGuard';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/policies" element={<Policies />} />
          
          {/* Donor Routes - Removed (not ready to start) */}
          
          {/* Seeker Routes */}
          <Route path="/seeker/login" element={<SeekerLogin />} />
          <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
          <Route path="/seeker/request" element={<SeekerRequest />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboardNew />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/dashboard-new" element={<AdminDashboardNew />} />
          <Route path="/admin/donors" element={
            <AdminRouteGuard>
              <DonorManagement />
            </AdminRouteGuard>
          } />
          <Route path="/admin/hospitals" element={
            <AdminRouteGuard>
              <HospitalManagement />
            </AdminRouteGuard>
          } />
          <Route path="/admin/inventory" element={
            <AdminRouteGuard>
              <BloodMatching />
            </AdminRouteGuard>
          } />
          <Route path="/admin/requests" element={
            <AdminRouteGuard>
              <DonationRequests />
            </AdminRouteGuard>
          } />
          <Route path="/admin/donation-history" element={
            <AdminRouteGuard>
              <DonationHistory />
            </AdminRouteGuard>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;