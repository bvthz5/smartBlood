import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";
import { loginAdmin, clearError } from "../../store/slices/adminSlice";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.admin);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value.trim()) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  // Handle input blur
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    
    // Validate password
    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await dispatch(loginAdmin({
        email: formData.email.trim(),
        password: formData.password.trim()
      })).unwrap();
      
      console.log("Login successful:", result);
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (err) {
      console.error("Login failed:", err);
      
      // Handle specific error messages
      if (err.message) {
        if (err.message.includes("email") || err.message.includes("Email")) {
          setErrors({ email: err.message });
        } else if (err.message.includes("password") || err.message.includes("Password")) {
          setErrors({ password: err.message });
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: "Login failed. Please check your credentials and try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          
          {/* Futuristic Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <div className="relative">
              {/* Glowing Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl"
              >
                <Shield className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-75"></div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-4xl font-black text-white mb-2 tracking-tight"
              >
                SmartBlood
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex items-center justify-center space-x-2 text-blue-300"
              >
                <Zap className="w-5 h-5" />
                <span className="text-lg font-semibold tracking-wide">ADMIN PORTAL</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
              
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10"></div>
              
              {/* Card Header */}
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Secure Access
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-blue-200"
                >
                  Enter your credentials to continue
                </motion.p>
              </div>

              {/* Global Error Message */}
              <AnimatePresence>
                {(error || errors.general) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-red-100 text-sm font-medium">
                        {error || errors.general}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-200">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-blue-300" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="admin@smartblood.com"
                      autoComplete="email"
                      className={`w-full pl-12 pr-4 py-4 bg-white/10 border-2 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-0 transition-all duration-300 backdrop-blur-sm ${
                        errors.email && touched.email
                          ? "border-red-400 focus:border-red-300 bg-red-500/10"
                          : "border-blue-300/30 focus:border-blue-300 hover:border-blue-300/50"
                      }`}
                    />
                    
                    {/* Success Icon */}
                    {formData.email && !errors.email && touched.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Error Message */}
                  <AnimatePresence>
                    {errors.email && touched.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center space-x-2 text-red-300 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.email}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-blue-200">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-blue-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`w-full pl-12 pr-12 py-4 bg-white/10 border-2 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-0 transition-all duration-300 backdrop-blur-sm ${
                        errors.password && touched.password
                          ? "border-red-400 focus:border-red-300 bg-red-500/10"
                          : "border-blue-300/30 focus:border-blue-300 hover:border-blue-300/50"
                      }`}
                    />
                    
                    {/* Password Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    
                    {/* Success Icon */}
                    {formData.password && !errors.password && touched.password && formData.password.length >= 6 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-y-0 right-10 pr-4 flex items-center"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Error Message */}
                  <AnimatePresence>
                    {errors.password && touched.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center space-x-2 text-red-300 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.password}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isSubmitting || isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Access Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.form>

              {/* Security Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-8 pt-6 border-t border-white/20"
              >
                <div className="text-center text-blue-200 text-sm">
                  <div className="flex items-center justify-center space-x-4">
                    <span className="font-semibold">256-bit SSL Encryption</span>
                    <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                    <span className="font-semibold">Secure Database</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Support Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-blue-300 text-sm">
              For technical support, contact{" "}
              <a 
                href="mailto:admin@smartblood.com" 
                className="text-blue-200 hover:text-white transition-colors font-semibold underline decoration-2 underline-offset-2"
              >
                admin@smartblood.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}