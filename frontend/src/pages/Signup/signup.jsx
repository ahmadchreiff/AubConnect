import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "boxicons/css/boxicons.min.css";
import ReCAPTCHA from "react-google-recaptcha";


const Signup = () => {
  const [password, setPassword] = useState("");
  const [passwordFormateError, setPasswordFormatError] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [requirementsVisible, setRequirementsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState("");


  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };
  const requirements = [
    { regex: /.{8,}/, id: "lengthReq", text: "At least 8 characters" },
    { regex: /[a-z]/, id: "lowercaseReq", text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, id: "uppercaseReq", text: "At least 1 uppercase letter" },
    { regex: /[^A-Za-z0-9]/, id: "symbolReq", text: "At least 1 special symbol" },
    { regex: /\d/, id: "numberReq", text: "At least 1 number" },
  ];

  const checkPassword = (value) => {
    setPassword(value);
    let allValid = true;

    requirements.forEach(({ regex, id }) => {
      const isValid = regex.test(value);
      allValid = allValid && isValid;
    });
  };

  const validatePasswordMatch = () => {
    if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  const validateEmailFormat = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@mail\.aub\.edu$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please use an AUB email (@mail.aub.edu)");
    } else {
      setEmailError("");
    }
  };

  const togglePassword = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "passwordConfirm") {
      setPasswordConfirmVisible(!passwordConfirmVisible);
    }
  };

  const verifyCode = async () => {
    setIsLoading(true);
    try {
      const verifyResponse = await axios.post("https://aubconnectbackend-h22c.onrender.com/api/auth/verify-code", { email, verificationCode });
  
      if (verifyResponse.data.token) {
        localStorage.setItem('token', verifyResponse.data.token);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired verification code");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateEmailFormat();
    validatePasswordMatch();

    if (emailError || passwordError || passwordFormateError) {
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setError("Please verify that you are not a robot");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("https://aubconnectbackend-h22c.onrender.com/api/auth/send-verification-code", {
        name: username,
        username,
        email,
        password,
        recaptchaToken  // Add this line
      });

      setShowVerificationPopup(true);
      setError("");
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification code");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans overflow-y-auto">
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
      <div className="relative overflow-y-auto">
        {/* Background Image with Overlay */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg bg-cover bg-center opacity-40 animate-slow-pan"></div>
        </div>

        <div className=" absolute inset-0 bg-gradient-to-br from-[#6D0B24]/90 to-[#45051A]/80 mix-blend-multiply relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center pt-4 pb-16">
          <div
            className={`w-full max-w-md transition-all duration-1000 transform ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              } mb-16 mt-4`}
          >
            {/* Signup Card */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
              {/* Card Header */}
              <div className="bg-[#6D0B24] p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/aub-pattern.png')] bg-repeat opacity-10"></div>
                <div className="relative z-10 flex justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm p-1 flex items-center justify-center">
                    <i className="bx bx-user-plus text-white text-3xl"></i>
                  </div>
                </div>
                <h2 className="text-white text-center text-2xl font-serif font-bold">Create Account</h2>
                <p className="text-white/80 text-center mt-1 text-sm">Join the AUB student community</p>
              </div>

              {/* Card Body */}
              <div className="p-4 md:p-6">
                {/* Error message */}
                {error && (
                  <div className="mb-6 animate-shake">
                    <div className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
                      <i className="bx bx-error-circle text-xl mr-2"></i>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Username Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">
                      Username
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="bx bx-user text-gray-500 group-focus-within:text-[#6D0B24] transition-colors"></i>
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24] transition-all duration-300 bg-white"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

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
                        onBlur={validateEmailFormat}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24] transition-all duration-300 bg-white"
                        placeholder="username@mail.aub.edu"
                      />
                    </div>
                    {emailError ? (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <i className="bx bx-error-circle mr-1"></i> {emailError}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">Only @mail.aub.edu email addresses are accepted</p>
                    )}
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
                        onChange={(e) => checkPassword(e.target.value)}
                        onFocus={() => setRequirementsVisible(true)}
                        onBlur={() => {
                          setRequirementsVisible(false);
                          setPasswordFormatError(
                            password && !requirements.every(({ regex }) => regex.test(password))
                              ? "Password doesn't meet all requirements"
                              : ""
                          );
                        }}
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24] transition-all duration-300 bg-white"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("password")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i className={`bx ${passwordVisible ? "bx-hide" : "bx-show"} text-gray-500 hover:text-gray-700 transition-colors`}></i>
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className={`mt-2 bg-gray-50 rounded-md border border-gray-200 p-3 transition-all duration-300 ${requirementsVisible ? "opacity-100 max-h-60" : "opacity-0 max-h-0 overflow-hidden"
                      }`}>
                     
                        {requirements.map(({ id, text, regex }) => {
                          const isValid = regex.test(password);
                          return (
                            <li key={id} className="flex items-center text-xs">
                              <i className={`bx ${isValid ? "bx-check text-green-500" : "bx-x text-gray-400"} mr-2`}></i>
                              <span className={isValid ? "text-green-600" : "text-gray-600"}>{text}</span>
                            </li>
                          );
                        })}
                 
                    </div>

                    {passwordFormateError && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <i className="bx bx-error-circle mr-1"></i> {passwordFormateError}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="bx bx-lock-alt text-gray-500 group-focus-within:text-[#6D0B24] transition-colors"></i>
                      </div>
                      <input
                        type={passwordConfirmVisible ? "text" : "password"}
                        required
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        onBlur={validatePasswordMatch}
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24] transition-all duration-300 bg-white"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("passwordConfirm")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i className={`bx ${passwordConfirmVisible ? "bx-hide" : "bx-show"} text-gray-500 hover:text-gray-700 transition-colors`}></i>
                      </button>
                    </div>

                    {passwordError && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <i className="bx bx-error-circle mr-1"></i> {passwordError}
                      </p>
                    )}
                  </div>
                  {/* reCAPTCHA */}
                  <div className="mt-4 flex justify-center">
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptchaChange}
                      theme="light"
                    />
                  </div>

                  {/* Signup Button */}
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
                          <i className="bx bx-user-plus mr-2"></i>
                        )}
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center w-full">
                      <span className="text-gray-600 text-sm">Already have an account? </span>
                      <Link to="/login" className="text-[#6D0B24] hover:text-[#990F34] font-medium text-sm transition-colors">
                        Sign in
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-3 mb-8 text-center text-gray-500 text-xs">
              <p>© {new Date().getFullYear()} American University of Beirut. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Popup Modal */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 overflow-y-auto py-4">
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 my-8"
          >
            <div className="bg-[#6D0B24] p-4">
              <h3 className="text-white text-xl font-serif font-bold text-center">Verify Your Email</h3>
            </div>

            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="h-16 w-16 mx-auto bg-[#6D0B24]/10 rounded-full flex items-center justify-center mb-4">
                  <i className="bx bx-envelope text-[#6D0B24] text-3xl"></i>
                </div>
                <p className="text-gray-600">We've sent a verification code to your email <span className="font-medium">{email}</span></p>
                <p className="text-gray-500 text-sm mt-1">Check your inbox (and spam folder) and enter the code below</p>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="bx bx-check-shield text-gray-500"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24] transition-all duration-300 bg-white text-center font-medium text-lg tracking-wider"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowVerificationPopup(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyCode}
                  disabled={isLoading}
                  className="flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D0B24] hover:bg-[#990F34] focus:outline-none transition-colors duration-300 relative"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Didn't receive the code? <button className="text-[#6D0B24] hover:text-[#990F34] font-medium">Resend</button></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add these styles to your global CSS or a style tag */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slow-pan {
          0% { transform: scale(1.05) translateX(0) translateY(0); }
          33% { transform: scale(1.05) translateX(-1%) translateY(-1%); }
          66% { transform: scale(1.05) translateX(1%) translateY(1%); }
          100% { transform: scale(1.05) translateX(0) translateY(0); }
        }
        
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        
        .animate-slow-pan {
          animation: slow-pan 20s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        html, body {
          height: 100%;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default Signup;