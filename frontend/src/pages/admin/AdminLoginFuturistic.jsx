import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin, clearError } from "../../store/slices/adminSlice";
import { Eye, EyeOff, Shield, Zap, Droplets, Heart, Activity } from "lucide-react";
import "./AdminLoginFuturistic.css";

const AdminLoginFuturistic = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [particles, setParticles] = useState([]);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.admin);

  // Create floating particles for background animation
  useEffect(() => {
    const createParticles = () => {
      const newParticles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '#B71C1C' : '#FF6B6B'
      }));
      setParticles(newParticles);
    };

    createParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: (particle.y + particle.speed) % 100,
        x: (particle.x + Math.sin(Date.now() * 0.0005 + particle.id) * 0.2) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Handle successful login and routing
  useEffect(() => {
    if (isAuthenticated && user && !loginSuccess) {
      setLoginSuccess(true);
      // Add a small delay for the success animation
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    }
  }, [isAuthenticated, user, navigate, loginSuccess]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await dispatch(loginAdmin(formData)).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="futuristic-login-container">
      {/* Enhanced Animated Background */}
      <div className="login-background">
        <div className="smartblood-gradient-bg"></div>
        <div className="blood-flow-animation"></div>
        <div className="particles-container">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                backgroundColor: particle.color
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [particle.opacity, particle.opacity * 0.2, particle.opacity],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="success-content"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="success-icon"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <Heart className="heart-icon" />
              </motion.div>
              <h2>Login Successful!</h2>
              <p>Welcome back, {user?.name || 'Administrator'}</p>
              <motion.div
                className="loading-dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span></span>
                <span></span>
                <span></span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Login Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Enhanced Header */}
        <motion.div
          className="login-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="logo-container">
            <motion.div
              className="logo-icon"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Droplets className="droplet-icon" />
              <div className="logo-pulse"></div>
            </motion.div>
            <div className="logo-text">
              <h1>SmartBlood</h1>
              <p>Admin Portal</p>
              <div className="logo-subtitle">Advanced Blood Management System</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="error-icon" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Login Form */}
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Zap className="label-icon" />
              Email Address
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="admin@smartblood.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
              <div className="input-glow"></div>
              <div className="input-border"></div>
            </div>
            {errors.email && (
              <motion.p
                className="form-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Shield className="label-icon" />
              Password
            </label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <div className="input-glow"></div>
              <div className="input-border"></div>
            </div>
            {errors.password && (
              <motion.p
                className="form-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 0 40px rgba(183, 28, 28, 0.8)",
              y: -2
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  className="button-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Authenticating...
              </>
            ) : (
              <>
                <Shield size={20} />
                Sign In
              </>
            )}
            <div className="button-shine"></div>
          </motion.button>
        </motion.form>

        {/* Enhanced Footer */}
        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="footer-content">
            <p>SmartBlood Admin Portal v2.0</p>
            <p>Advanced Blood Management System</p>
            <div className="footer-features">
              <span><Activity size={14} /> Real-time Monitoring</span>
              <span><Shield size={14} /> Secure Access</span>
              <span><Heart size={14} /> Life-Saving Technology</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Security Badge */}
      <motion.div
        className="security-badge"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <Shield className="security-icon" />
        <span>Secure Connection</span>
        <div className="security-pulse"></div>
      </motion.div>
    </div>
  );
};

export default AdminLoginFuturistic;