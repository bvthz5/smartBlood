import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  Heart,
  Building2,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronDown,
  Shield,
  Activity,
  Database,
  Globe,
  Zap,
  Crown,
  HelpCircle,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  ShieldCheck,
  Lock
} from "lucide-react";
import { logout, toggleDarkMode } from "../../store/slices/adminSlice";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, user } = useSelector((state) => state.admin);

  // Mock notifications with real-time updates
  const [notifications] = useState([
    { 
      id: 1, 
      title: "New Emergency Request", 
      message: "AB+ blood needed urgently at Apollo Hospital", 
      time: "2 min ago", 
      type: "urgent",
      priority: "high",
      action: "View Request"
    },
    { 
      id: 2, 
      title: "System Maintenance Complete", 
      message: "Database optimization completed successfully", 
      time: "1 hour ago", 
      type: "info",
      priority: "medium",
      action: "View Report"
    },
    { 
      id: 3, 
      title: "New Donor Registration", 
      message: "Sarah Johnson registered as O+ donor in Mumbai", 
      time: "3 hours ago", 
      type: "success",
      priority: "low",
      action: "View Profile"
    },
    { 
      id: 4, 
      title: "Blood Stock Alert", 
      message: "B+ blood group running low at 3 hospitals", 
      time: "5 hours ago", 
      type: "warning",
      priority: "high",
      action: "Manage Stock"
    }
  ]);

  // Navigation items
  const navigationItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/admin/dashboard",
      description: "Overview and analytics",
      badge: null
    },
    {
      name: "Users",
      icon: Users,
      path: "/admin/users",
      description: "Manage users and roles",
      badge: "12,458",
      subItems: [
        { name: "All Users", path: "/admin/users" },
        { name: "Donors", path: "/admin/users/donors" },
        { name: "Hospital Staff", path: "/admin/users/staff" },
        { name: "Admins", path: "/admin/users/admins" }
      ]
    },
    {
      name: "Blood Requests",
      icon: Heart,
      path: "/admin/requests",
      description: "Manage blood requests",
      badge: "23",
      subItems: [
        { name: "All Requests", path: "/admin/requests" },
        { name: "Emergency", path: "/admin/requests/emergency" },
        { name: "Urgent", path: "/admin/requests/urgent" },
        { name: "Scheduled", path: "/admin/requests/scheduled" }
      ]
    },
    {
      name: "Hospitals",
      icon: Building2,
      path: "/admin/hospitals",
      description: "Hospital management",
      badge: "245",
      subItems: [
        { name: "All Hospitals", path: "/admin/hospitals" },
        { name: "Verified", path: "/admin/hospitals/verified" },
        { name: "Pending", path: "/admin/hospitals/pending" },
        { name: "Blood Banks", path: "/admin/hospitals/blood-banks" }
      ]
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      description: "Reports and insights",
      badge: null,
      subItems: [
        { name: "Overview", path: "/admin/analytics" },
        { name: "Blood Usage", path: "/admin/analytics/blood-usage" },
        { name: "Donor Stats", path: "/admin/analytics/donors" },
        { name: "Geographic", path: "/admin/analytics/geographic" }
      ]
    },
    {
      name: "Reports",
      icon: FileText,
      path: "/admin/reports",
      description: "Generate reports",
      badge: null
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
      description: "System configuration",
      badge: null
    }
  ];

  // Quick stats for dashboard
  const quickStats = [
    { label: "Total Users", value: "12,458", icon: Users, color: "blue", change: "+12%" },
    { label: "Active Requests", value: "23", icon: Heart, color: "red", change: "+5%" },
    { label: "Hospitals", value: "245", icon: Building2, color: "green", change: "+2%" },
    { label: "Success Rate", value: "98.5%", icon: TrendingUp, color: "purple", change: "+0.3%" }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode());
  };

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const getItemColor = (color) => {
    const colors = {
      blue: "text-blue-500 bg-blue-500/10",
      red: "text-red-500 bg-red-500/10",
      green: "text-green-500 bg-green-500/10",
      purple: "text-purple-500 bg-purple-500/10"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    }`}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
          width: isCollapsed ? "80px" : "280px"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col ${
          isDarkMode 
            ? "bg-slate-900 border-r border-slate-700" 
            : "bg-white border-r border-gray-200"
        } lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">SmartBlood</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Portal</p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Quick Stats (Desktop only) */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 border-b border-gray-200 dark:border-slate-700"
          >
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`p-2 rounded-lg ${getItemColor(stat.color)}`}
                >
                  <div className="flex items-center space-x-2">
                    <stat.icon className="w-4 h-4" />
                    <div>
                      <p className="text-xs font-medium">{stat.value}</p>
                      <p className="text-xs opacity-75">{stat.label}</p>
                      <p className="text-xs text-green-500">{stat.change}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? isDarkMode
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-slate-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs opacity-75">{item.description}</p>
                    </div>
                  )}
                </div>
                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isActiveRoute(item.path)
                      ? "bg-blue-500/30 text-blue-300"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </motion.button>
            </motion.div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-colors ${
              isDarkMode
                ? "text-red-400 hover:bg-red-900/20"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isCollapsed ? "lg:ml-20" : "lg:ml-72"
      }`}>
        {/* Top Header */}
        <AdminHeader />
        
        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;