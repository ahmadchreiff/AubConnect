import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use full backend URL with port 5001
      const response = await axios.post(
        'https://aubconnectbackend-h22c.onrender.com/api/auth/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(response.data.message);
      if (response.data.debugCode) {
        console.log("DEBUG CODE:", response.data.debugCode);
        setSuccess(`Development Mode - Code: ${response.data.debugCode}`);
      }
      setStep(2);
    } catch (err) {
      console.error("Full error:", err);
      setError(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'https://aubconnectbackend-h22c.onrender.com/api/auth/verify-reset-code', 
        { email, code },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Verification response:', response.data); // Debug log
      
      if (response.data.success) {
        localStorage.setItem('resetToken', response.data.token);
        setSuccess(response.data.message);
        setStep(3);
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!isPasswordValid()) {
      setError('Please meet all password requirements');
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem('resetToken');
      const response = await axios.post(
        'https://aubconnectbackend-h22c.onrender.com/api/auth/reset-password',
        { token, newPassword },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Reset response:', response.data); // Debug log
      
      if (response.data.message === 'Password reset successful') {
        setSuccess('Password reset successfully!');
        localStorage.removeItem('resetToken');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || 'Password reset failed');
      }
    } catch (err) {
      console.error('Reset error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  const isPasswordValid = () => {
    return (
      newPassword.length >= 8 &&
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[!@#$%^&*]/.test(newPassword) &&
      newPassword === confirmPassword
    );
  };
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#6D0B24] p-6 text-center">
          <h2 className="text-white text-2xl font-bold">Reset Your Password</h2>
          <p className="text-white/80 mt-1">
            {step === 1 ? 'Enter your email to get started' : 
             step === 2 ? 'Enter the code sent to your email' : 
             'Create a new password'}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              <i className="bx bx-error-circle mr-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
              <i className="bx bx-check-circle mr-2"></i>
              {success}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">AUB Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24]"
                  placeholder="username@mail.aub.edu"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6D0B24] text-white py-2 rounded hover:bg-[#990F34] disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24]"
                  placeholder="Enter 6-digit code"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Check your email for the reset code
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6D0B24] text-white py-2 rounded hover:bg-[#990F34] disabled:opacity-70"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

{step === 3 && (
  <form onSubmit={handleResetPassword}>
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24]"
        placeholder="Enter new password"
        required
      />
      {/* Password Requirements */}
      <div className="mt-2 text-sm text-gray-600">
        <p className="font-medium">Password must contain:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li className={newPassword.length >= 8 ? 'text-green-500' : 'text-gray-500'}>
            At least 8 characters
          </li>
          <li className={/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-gray-500'}>
            At least 1 lowercase letter
          </li>
          <li className={/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-500'}>
            At least 1 uppercase letter
          </li>
          <li className={/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-500'}>
            At least 1 number
          </li>
          <li className={/[!@#$%^&*]/.test(newPassword) ? 'text-green-500' : 'text-gray-500'}>
            At least 1 special symbol (!@#$%^&*)
          </li>
        </ul>
      </div>
    </div>
    
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Confirm Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#6D0B24]/20 focus:border-[#6D0B24]"
        placeholder="Confirm new password"
        required
      />
    </div>
    
    <button
      type="submit"
      disabled={loading || !isPasswordValid()}
      className="w-full bg-[#6D0B24] text-white py-2 rounded hover:bg-[#990F34] disabled:opacity-70"
    >
      {loading ? 'Resetting...' : 'Reset Password'}
    </button>
  </form>
)}

          <div className="mt-4 text-center">
            <Link to="/login" className="text-[#6D0B24] hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;