import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Heart,
  Building2,
  TrendingUp,
  Activity,
  Crown,
  Bell,
  Search,
  User,
  Sun,
  LogOut
} from "lucide-react";
import { fetchDashboardData } from "../../store/slices/adminSlice";

const AdminDashboardSimple = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, dashboardData, isLoading } = useSelector((state) => state.admin);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch dashboard data on mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading && !dashboardData.stats.totalDonors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Simple Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 backdrop-blur-xl border-b bg-slate-900/80 border-slate-700/50"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Side - Logo */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SmartBlood Admin</h1>
                  <p className="text-xs text-gray-400">Management Portal</p>
                </div>
              </motion.div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users, requests, analytics..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-2">
              
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-yellow-400 hover:bg-slate-800 transition-colors"
              >
                <Sun className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-gray-300 hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Profile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">System Administrator</p>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || "Admin"}! 👋
            </h2>
            <p className="text-lg text-gray-400">
              Here's what's happening with SmartBlood today
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Total Donors", value: "12,458", icon: Users, color: "blue" },
              { title: "Blood Requests", value: "23", icon: Heart, color: "red" },
              { title: "Hospitals", value: "245", icon: Building2, color: "green" },
              { title: "Success Rate", value: "98.5%", icon: TrendingUp, color: "purple" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl backdrop-blur-xl border bg-gray-800/50 border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    stat.color === 'red' ? 'bg-red-500/20 text-red-400' :
                    stat.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl backdrop-blur-xl border bg-gray-800/50 border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Activity className="w-6 h-6" />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-colors"
              >
                <Users className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="font-semibold text-white">Manage Users</h4>
                <p className="text-sm text-gray-400">View and manage all users</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-colors"
              >
                <Heart className="w-8 h-8 text-red-400 mb-2" />
                <h4 className="font-semibold text-white">Blood Requests</h4>
                <p className="text-sm text-gray-400">Handle blood requests</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-colors"
              >
                <Building2 className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="font-semibold text-white">Hospitals</h4>
                <p className="text-sm text-gray-400">Manage hospitals</p>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardSimple;
