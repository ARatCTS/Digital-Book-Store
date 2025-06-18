import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminSidebarLink = ({ to, children }) => (
    <NavLink to={to} className={({ isActive }) => `block px-4 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
        {children}
    </NavLink>
);

export default function AdminLayout() {
    return (
        <div className="flex items-start gap-6">
            <aside className="w-56 bg-white p-4 rounded-lg shadow-md sticky top-24">
                <nav className="space-y-2">
                    <AdminSidebarLink to="/admin/dashboard">Dashboard</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/books">Books</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/orders">Orders</AdminSidebarLink>
                    <AdminSidebarLink to="/admin/reviews">Reviews</AdminSidebarLink>
                </nav>
            </aside>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}