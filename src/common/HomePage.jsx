import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';
import UserSection from './UserSection';

const GuestHomePage = () => (
    <HeroSection/>
);

const UserHomePage = ({ user }) => (
    <>
        <UserSection user={user} />
        <HeroSection/>
    </>
);

const AdminHomePage = () => (
    <div className="bg-white p-8 rounded-xl shadow-lg mt-10">
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