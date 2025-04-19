import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "boxicons/css/boxicons.min.css";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [recaptchaToken, setRecaptchaToken] = useState("");


  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Add this function to handle reCAPTCHA changes
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  // Update your handleSubmit function to include the reCAPTCHA token
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate AUB email
    if (!email.endsWith('@mail.aub.edu') && !email.endsWith('@aub.edu.lb')) {
      setError("Please use a valid AUB email address (@mail.aub.edu or @aub.edu.lb)");
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setError("Please verify that you are not a robot");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password, recaptchaToken);
      console.log("Login successful:", response);

      // Show success animation before redirecting
      setTimeout(() => {
        // Handle redirect based on user role
        if (response.user.role === 'admin') {
          // Admin users go to admin dashboard
          navigate('/admin/dashboard');
        } else {
          // Regular users go to homepage
          navigate('/homepage');
        }
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      {/* Header Bar */}
      <div className="w-full bg-[#6D0B24] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 mr-2">
                  <svg viewBox="0 0 100 100" className="h-full w-full fill-current text-white">
                    <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                  </svg>
                </div>
                <span className="font-serif text-xl tracking-tight">AubConnect</span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Header simplified - removed links */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6D0B24]/90 to-[#45051A]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[url('/campus-background.jpg')] bg-cover bg-center opacity-40 animate-slow-pan"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div
            className={`w-full max-w-md transition-all duration-1000 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            {/* Login Card */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
              {/* Card Header */}
              <div className="bg-[#6D0B24] p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/aub-pattern.png')] bg-repeat opacity-10"></div>
                <div className="relative z-10 flex justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm p-1 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="h-10 w-10 fill-current text-white">
                      <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-white text-center text-2xl font-serif font-bold">Welcome to AUB Portal</h2>
                <p className="text-white/80 text-center mt-1 text-sm">Sign in with your AUB credentials</p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Error message */}
                {error && (
                  <div className="mb-6 animate-shake">
                    <div className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
                      <i className="bx bx-error-circle text-xl mr-2"></i>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">
                      AUB Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="bx bx-envelope text-gray-500 group-focus-within:text-[#6D0B24] transition-colors"></i>
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24] transition-all duration-300 bg-white"
                        placeholder="username@mail.aub.edu"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Only AUB email addresses are accepted</p>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="bx bx-lock-alt text-gray-500 group-focus-within:text-[#6D0B24] transition-colors"></i>
                      </div>
                      <input
                        type={passwordVisible ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24] transition-all duration-300 bg-white"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i className={`bx ${passwordVisible ? "bx-hide" : "bx-show"} text-gray-500 hover:text-gray-700 transition-colors`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 text-[#6D0B24] border-gray-300 rounded focus:ring-[#6D0B24]"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-[#6D0B24] hover:text-[#990F34] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="mt-4 flex justify-center">
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                      theme="light"
                    />
                  </div>

                  {/* Login Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none transition-all duration-300 relative overflow-hidden ${isLoading
                        ? "bg-[#6D0B24]/70 cursor-not-allowed"
                        : "bg-[#6D0B24] hover:bg-[#990F34]"
                        }`}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full animate-shimmer"></span>
                      <span className="relative flex items-center">
                        {isLoading ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <i className="bx bx-log-in-circle mr-2"></i>
                        )}
                        {isLoading ? "Signing in..." : "Sign in"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center w-full">
                      <span className="text-gray-600 text-sm">New to AUB? </span>
                      <Link to="/signup" className="text-[#6D0B24] hover:text-[#990F34] font-medium text-sm transition-colors">
                        Create account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 text-center text-gray-500 text-xs">
              <p>© {new Date().getFullYear()} American University of Beirut. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;