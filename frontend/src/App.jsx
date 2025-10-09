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

// Donor Pages
import DonorLogin from './pages/donor/Login';
import DonorRegister from './pages/donor/Register';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorForgotPassword from './pages/donor/ForgotPassword';
import DonorChangePassword from './pages/donor/ChangePassword';
import DonorEditProfile from './pages/donor/EditProfile';

// Seeker Pages
import SeekerRequest from './pages/seeker/SeekerRequest';

// Admin Pages
import AdminLogin from './pages/admin/jsx/AdminLogin';
import AdminLoginNew from './pages/admin/AdminLoginNew';
import AdminDashboardNew from './pages/admin/AdminDashboardNew';
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
          
          {/* Donor Routes */}
          <Route path="/donor/login" element={<DonorLogin />} />
          <Route path="/donor/register" element={<DonorRegister />} />
          <Route path="/donor/forgot-password" element={<DonorForgotPassword />} />
          <Route path="/donor/dashboard" element={
            <ProtectedRoute>
              <DonorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/donor/change-password" element={
            <ProtectedRoute>
              <DonorChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/donor/edit-profile" element={
            <ProtectedRoute>
              <DonorEditProfile />
            </ProtectedRoute>
          } />
          
          {/* Seeker Routes */}
          <Route path="/seeker/request" element={<SeekerRequest />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/login-new" element={<AdminLoginNew />} />
          <Route path="/admin/dashboard" element={<AdminDashboardNew />} />
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