// /src/components/common/HomePage.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';

const GuestHomePage = () => (
    <HeroSection/>
);

const UserHomePage = ({ user }) => (
    <>
    <HeroSection/>
    <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Ready to dive into a new book? Here are some quick links to get you started.</p>
        <div className="mt-6 flex space-x-4">
            <Link to="/books" className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Browse Books</Link>
            <Link to="/orders" className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">View My Orders</Link>
        </div>
    </div>
    </>
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