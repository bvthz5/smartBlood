import React from "react";
import { motion } from "framer-motion";
import { Crown, Shield, Globe, Activity, Database } from "lucide-react";

const AdminLoginHeader = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl border-b bg-slate-900/80 border-slate-700/50"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side - Logo & Brand */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-bold text-white">SmartBlood Admin</h1>
              <p className="text-sm text-gray-400">Management Portal</p>
            </div>
          </motion.div>

          {/* Center - Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="hidden lg:flex items-center space-x-6"
          >
            <div className="flex items-center space-x-2 text-gray-300">
              <Database className="w-4 h-4" />
              <span className="text-sm">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Live Monitoring</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Global Reach</span>
            </div>
          </motion.div>

          {/* Right Side - Security Badge */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Secure Access</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminLoginHeader;
