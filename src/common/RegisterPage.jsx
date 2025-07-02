import React, { useState } from 'react';
import apiClient from './../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return; 
    }

    setLoading(true);
    try {
      await apiClient.post('/api/auth/register', formData);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {

      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-[480px] w-full">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h1 className="text-slate-900 text-center text-3xl font-semibold">Create an Account</h1>
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Full Name</label>
                <div className="relative flex items-center">
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-12 rounded-md outline-blue-600"
                    placeholder="Enter your full name"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-12 rounded-md outline-blue-600"
                    placeholder="Enter your email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 24 24"
                  >
                      <path d="M22 5H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm-1 2-8.03 5.353a1 1 0 0 1-1.121-.001L3 7v-.382l8.441 5.627a1 1 0 0 0 1.118 0L21 6.618V7z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-12 rounded-md outline-blue-600"
                    placeholder="Enter password"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4" viewBox="0 0 24 24"><path d="M19 8h-1V6a6 6 0 0 0-12 0v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a4 4 0 0 1 8 0v2H9z" data-original="#000000"></path></svg>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
                  <p className="text-sm">{error}</p>
                </div>
              )}

<div className="!mt-12">
  <button
    type="submit"
    disabled={loading}
    className="w-full py-2.5 px-4 text-sm font-semibold tracking-wide rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none disabled:bg-gray-600"
  >
    {loading ? 'Registering...' : 'Register'}
  </button>
</div>

              <p className="text-slate-900 text-sm !mt-6 text-center">
                Already have an account?
                <Link
                  to="/login"
                  className="text-black-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
