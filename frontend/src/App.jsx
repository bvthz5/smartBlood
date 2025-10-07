import React, { useCallback, useMemo, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeAuth } from "./store/slices/adminSlice";
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
import NotFound from "./pages/NotFound";

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
import AdminLoginFuturistic from "./pages/admin/AdminLoginFuturistic";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

// Admin Layout
import AdminLayout from "./components/admin/AdminLayout";
import AdminRouteGuard from "./components/AdminRouteGuard";

// Component to initialize authentication
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return children;
}

function App() {
  // Memoize the layout sync function to prevent unnecessary re-renders
  const handleLayoutSync = useCallback(() => {
    // Use requestIdleCallback for better performance when available
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        syncHeaderAlertHeights();
      }, { timeout: 1000 });
    } else {
      // Fallback to requestAnimationFrame
      requestAnimationFrame(() => {
        syncHeaderAlertHeights();
      });
    }
  }, []);

  // Sync layout offsets only once on mount to prevent performance issues
  React.useEffect(() => {
    // Delay initial sync to avoid blocking initial render
    const timeoutId = setTimeout(() => {
      handleLayoutSync();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []); // Remove handleLayoutSync dependency to prevent re-runs

  return (
    <Provider store={store}>
      <AuthProvider>
        <AuthInitializer>
          <ScrollToTop />
          <Routes>
          {/* Admin Routes - Protected with Route Guard */}
              <Route path="/admin/*" element={
                <AdminRouteGuard>
                  <Routes>
                    <Route path="login" element={<AdminLoginFuturistic />} />
                    <Route path="*" element={
                      <AdminLayout>
                        <Routes>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="settings" element={<AdminSettings />} />
                          <Route path="" element={<AdminDashboard />} />
                          <Route path="*" element={<AdminDashboard />} />
                        </Routes>
                      </AdminLayout>
                    } />
                  </Routes>
                </AdminRouteGuard>
              } />

          {/* User Routes - With Nav */}
          <Route path="/*" element={
            <div className="site-wrapper">
              <Nav />
              <main className="page-container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/about-us" element={<About />} />
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

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          } />
          </Routes>
        </AuthInitializer>
      </AuthProvider>
    </Provider>
  );
}

export default App;
