import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { syncHeaderAlertHeights } from "./utils/layoutOffsets";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Policies from "./pages/Policies";
import Contact from "./pages/Contact";

// Donor pages
import DonorRegister from "./pages/donor/Register";
import DonorLogin from "./pages/donor/Login";
import DonorForgot from "./pages/donor/ForgotPassword";
import DonorChange from "./pages/donor/ChangePassword";
import DonorDashboard from "./pages/donor/DonorDashboard";     
import DonorEdit from "./pages/donor/EditProfile";

// Seeker pages 
import CreateRequest from "./pages/seeker/SeekerRequest";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  // Sync layout offsets on route changes (only once on mount)
  React.useEffect(() => {
    // Use requestAnimationFrame to avoid blocking the main thread
    requestAnimationFrame(() => {
      syncHeaderAlertHeights();
    });
  }, []);

  return (
    <AuthProvider>
      <div className="site-wrapper">
        <ScrollToTop />
        <Nav />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/contact" element={<Contact />} />

            {/* General Auth Routes */}
            <Route path="/register" element={<DonorRegister />} />
            <Route path="/login" element={<DonorLogin />} />

            {/* Donor Routes */}
            <Route path="/donor/register" element={<DonorRegister />} />
            <Route path="/donor/login" element={<DonorLogin />} />
            <Route path="/donor/forgot" element={<DonorForgot />} />
            <Route path="/donor/change-password" element={<DonorChange />} />
            <Route 
              path="/donor/edit" 
              element={
                <ProtectedRoute>
                  <DonorEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donor/dashboard" 
              element={
                <ProtectedRoute>
                  <DonorDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Seeker Routes */}
            <Route 
              path="/seeker/request" 
              element={
                <ProtectedRoute>
                  <CreateRequest />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="error-page">
                  <h1 className="error-title">404</h1>
                  <p className="error-message">Page not found</p>
                </div>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
