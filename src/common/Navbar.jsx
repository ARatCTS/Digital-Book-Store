import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './../store/authSlice';

export default function Navbar() {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800">BookStore</Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
            {isAdmin && <Link to="/admin/books" className="text-gray-600 hover:text-blue-500">Admin</Link>}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">Logout</button>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
                <Link to="/register" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}