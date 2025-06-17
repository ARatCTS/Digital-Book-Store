import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminSidebarLink = ({ to, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`
        }
    >
        {children}
    </NavLink>
);

export default function AdminLayout() {
    return (
        <div className="flex">
            <aside className="w-64 bg-white p-4 rounded-lg shadow-lg mr-6">
                <nav className="space-y-2">
                    <AdminSidebarLink to="/admin/dashboard">Dashboard</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/books">Manage Books</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/orders">Manage Orders</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/reviews">Manage Reviews</AdminSidebarLink>
                </nav>
            </aside>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}