// src/pages/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from './../store/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // To get state from navigation

  const { status, error, isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  // Get the success message from the registration page, if it exists
  const registrationSuccessMessage = location.state?.message;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    // Redirect user after successful login
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-[480px] w-full">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h1 className="text-slate-900 text-center text-3xl font-semibold">Sign in</h1>

            {registrationSuccessMessage && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md text-center">
                    <p className="text-sm">{registrationSuccessMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-12 rounded-md outline-blue-600"
                    placeholder="Enter your email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M256 256a112 112 0 1 0-112-112 112 112 0 0 0 112 112zm0 32c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-12 rounded-md outline-blue-600"
                    placeholder="Enter password"
                  />
                  <svg
                    onClick={() => setShowPassword(!showPassword)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-5 h-5 absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Display specific error messages from the backend */}
              {status === 'failed' && error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
                    <p className="text-sm">
                      {typeof error === 'string' ? error : error.message || 'Login failed. Please check your credentials.'}
                    </p>
                  </div>
              )}

<div className="!mt-12">
  <button
    type="submit"
    disabled={status === 'loading'}
    className="w-full py-2.5 px-4 text-sm font-semibold tracking-wide rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none disabled:bg-gray-600"
  >
    {status === 'loading' ? 'Signing in...' : 'Sign in'}
  </button>
</div>

              <p className="text-slate-900 text-sm !mt-6 text-center">
                Don't have an account?
                <Link
                  to="/register"
                  className="text-black-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}