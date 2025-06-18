// /src/components/common/HomePage.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const GuestHomePage = () => (
    <div className="text-center py-16 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-2xl text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Discover Your Next Great Read</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-indigo-100">From timeless classics to modern bestsellers, your next adventure is just a click away.</p>
        <Link to="/books" className="inline-block px-10 py-4 text-lg font-bold bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
          Explore Collection
        </Link>
    </div>
);

const UserHomePage = ({ user }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Ready to dive into a new book? Here are some quick links to get you started.</p>
        <div className="mt-6 flex space-x-4">
            <Link to="/books" className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Browse Books</Link>
            <Link to="/orders" className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">View My Orders</Link>
        </div>
    </div>
);

const AdminHomePage = () => (
     <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Admin Control Center</h1>
        <p className="text-gray-600 mt-2">Manage your bookstore's inventory, orders, and more from one place.</p>
        <div className="mt-6">
            <Link to="/admin/dashboard" className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Go to Admin Dashboard</Link>
        </div>
    </div>
);

export default function HomePage() {
  const { isAuthenticated, isAdmin, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return isAdmin ? <AdminHomePage /> : <UserHomePage user={user} />;
  }
  
  return <GuestHomePage />;
}
