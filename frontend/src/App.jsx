// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";

// donor pages
import DonorRegister from "./pages/donor/Register";
import DonorLogin from "./pages/donor/Login";
import DonorForgot from "./pages/donor/ForgotPassword";
import DonorChange from "./pages/donor/ChangePassword";
import DonorDashboard from "./pages/donor/DonorDashboard";     
import DonorEdit from "./pages/donor/EditProfile";

// seeker pages 
import CreateRequest from "./pages/seeker/SeekerRequest";

// admin pages
import AdminLogin from "./pages/admin/AdminLogin";

import Home from "./pages/Home";

export default function App(){
  return (
    <>
      <Nav />
      <div className="container mx-auto mt-8">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Donor */}
          <Route path="/donor/register" element={<DonorRegister/>} />
          <Route path="/donor/login" element={<DonorLogin/>} />
          <Route path="/donor/forgot" element={<DonorForgot/>} />
          <Route path="/donor/change-password" element={<DonorChange/>} />
          <Route path="/donor/edit" element={<ProtectedRoute><DonorEdit/></ProtectedRoute>} />
          <Route path="/donor/dashboard" element={<ProtectedRoute><DonorDashboard/></ProtectedRoute>} />

          {/* Seeker */}
          <Route path="/seeker/request" element={<ProtectedRoute><CreateRequest/></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin/>} />

          <Route path="*" element={<div className="p-8 text-center">Not found</div>} />
        </Routes>
      </div>
    </>
  );
}
