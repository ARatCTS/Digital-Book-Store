import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, linkTo }) => (
    <Link to={linkTo} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </Link>
);

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard title="Total Books" value="1,250" linkTo="/admin/books" />
                <StatCard title="Pending Orders" value="85" linkTo="/admin/orders" />
                <StatCard title="Pending Reviews" value="12" linkTo="/admin/reviews" />
            </div>
        </div>
    );
}