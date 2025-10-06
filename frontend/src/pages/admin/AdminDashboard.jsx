import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Heart,
  Building2,
  AlertTriangle,
  Clock,
  TrendingUp,
  LogOut,
  Moon,
  Sun,
  Activity,
  MapPin,
  Award,
  Bell,
  RefreshCw,
} from "lucide-react";
import { fetchDashboardData } from "../../store/slices/adminSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeaderTest from "../../components/admin/AdminHeaderTest";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000, className = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{count.toLocaleString()}</span>;
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, change, color, delay = 0, urgent = false }) => {
  const colorClasses = {
    red: "from-red-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-violet-500",
    orange: "from-orange-500 to-yellow-500",
    indigo: "from-indigo-500 to-blue-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-xl hover:shadow-2xl transition-all duration-300 ${
        urgent ? "animate-pulse-glow" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        {urgent && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 bg-red-400 rounded-full"
          />
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-white/80 mb-1">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <AnimatedCounter
            value={value}
            className="text-3xl font-bold"
          />
          {change && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`text-sm font-medium ${
                change > 0 ? "text-green-200" : "text-red-200"
              }`}
            >
              {change > 0 ? "+" : ""}{change}%
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Chart Components
const RequestsOverTimeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: "Blood Requests",
        data: data.map(item => item.count),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

const BloodGroupChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.group),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#22c55e",
          "#06b6d4",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

const DistrictChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.district),
    datasets: [
      {
        label: "Requests",
        data: data.map(item => item.count),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default function AdminDashboard() {
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
    <AdminLayout>
      {/* Main Content */}
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Donors"
            value={dashboardData.stats.totalDonors}
            change={12}
            color="blue"
            delay={0.1}
          />
          <StatCard
            icon={Activity}
            title="Active Donors"
            value={dashboardData.stats.activeDonors}
            change={8}
            color="green"
            delay={0.2}
          />
          <StatCard
            icon={Building2}
            title="Hospitals"
            value={dashboardData.stats.hospitals}
            change={5}
            color="purple"
            delay={0.3}
          />
          <StatCard
            icon={Clock}
            title="Open Requests"
            value={dashboardData.stats.openRequests}
            change={-3}
            color="orange"
            delay={0.4}
          />
          <StatCard
            icon={AlertTriangle}
            title="Urgent Requests"
            value={dashboardData.stats.urgentRequests}
            change={15}
            color="red"
            delay={0.5}
            urgent={dashboardData.stats.urgentRequests > 0}
          />
          <StatCard
            icon={TrendingUp}
            title="Donations Today"
            value={dashboardData.stats.donationsToday}
            change={22}
            color="indigo"
            delay={0.6}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Requests Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              "bg-gray-800/50 border-gray-700"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Requests Over Time</span>
            </h3>
            <RequestsOverTimeChart data={dashboardData.charts.requestsOverTime} />
          </motion.div>

          {/* Blood Group Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              "bg-gray-800/50 border-gray-700"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Blood Group Distribution</span>
            </h3>
            <BloodGroupChart data={dashboardData.charts.bloodGroupDistribution} />
          </motion.div>
        </div>

        {/* District Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`p-6 rounded-2xl backdrop-blur-xl border mb-8 ${
            darkMode 
              ? "bg-gray-800/50 border-gray-700" 
              : "bg-white/50 border-gray-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Requests by District</span>
          </h3>
          <DistrictChart data={dashboardData.charts.requestsByDistrict} />
        </motion.div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Emergencies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              "bg-gray-800/50 border-gray-700"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Recent Emergencies</span>
            </h3>
            <div className="space-y-3">
              {dashboardData.recentEmergencies.map((emergency, index) => (
                <motion.div
                  key={emergency.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{emergency.hospital}</p>
                      <p className="text-sm text-red-400">{emergency.bloodGroup}</p>
                    </div>
                    <span className="text-xs text-red-500">{emergency.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Hospitals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              "bg-gray-800/50 border-gray-700"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Top Hospitals</span>
            </h3>
            <div className="space-y-3">
              {dashboardData.topHospitals.map((hospital, index) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{hospital.name}</p>
                    <p className="text-sm text-gray-500">{hospital.location}</p>
                  </div>
                  <span className="text-sm font-semibold">{hospital.requests}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Donors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border ${
              "bg-gray-800/50 border-gray-700"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Top Donors</span>
            </h3>
            <div className="space-y-3">
              {dashboardData.topDonors.map((donor, index) => (
                <motion.div
                  key={donor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{donor.name}</p>
                    <p className="text-sm text-gray-500">{donor.bloodGroup}</p>
                  </div>
                  <span className="text-sm font-semibold">{donor.donations}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
