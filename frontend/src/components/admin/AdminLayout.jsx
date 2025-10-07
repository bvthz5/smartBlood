import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/adminSlice";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode, user } = useSelector((state) => state.admin);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-6">
          <div className="flex items-center mb-8">
            <h2 className="text-xl font-bold text-white">
              SmartBlood Admin
            </h2>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              SmartBlood Admin
            </h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;