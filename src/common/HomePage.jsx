// /src/components/common/HomePage.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const GuestHomePage = () => (
    <div className="bg-white py-14 px-6 sm:px-12 bg-gradient-to-r from-pink-50 via-pink-50 to-blue-100">
        <div className="max-w-screen-xl mx-auto">
            <div className="max-w-screen-md">
                <h2 className="text-slate-900 xl:text-6xl md:text-5xl text-4xl font-bold !leading-tight">Discover Your Next Great Read</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 mt-6">
                <div>
                    <p className="text-slate-600 text-base leading-relaxed">Explore a curated collection of ready-to-use components and design blocks, empowering you to create stunning, responsive interfaces with ease. Streamline your workflow and discover the future of web development.</p>
                    <div className="mt-12 flex gap-6 items-center flex-wrap">
                        <Link to="/books"
                            className="bg-[#55F5A3] hover:bg-green-400 transition-all text-slate-900 font-semibold text-[15px] rounded-full px-6 py-3 cursor-pointer">
                            Explore Collection
                        </Link>
                        <Link to="/about" className="text-slate-900 text-[15px] font-semibold underline max-sm:block whitespace-nowrap">Learn More About Us</Link> {/* Changed API Docs to About Us for a bookstore */}
                    </div>
                    <div className="mt-12 flex flex-wrap gap-x-8 gap-y-6">
                        {/* Placeholder logos for a bookstore context */}
                        <img src="https://readymadeui.com/images/brand-logo1.webp" class="w-24 shrink-0 opacity-70" alt="Publisher 1" />
                        <img src="https://readymadeui.com/images/brand-logo2.webp" class="w-24 shrink-0 opacity-70" alt="Publisher 2" />
                        <img src="https://readymadeui.com/images/brand-logo3.webp" class="w-24 shrink-0 opacity-70" alt="Publisher 3" />
                        <img src="https://readymadeui.com/images/brand-logo4.webp" class="w-24 shrink-0 opacity-70" alt="Publisher 4" />
                    </div>
                </div>

                <div className="aspect-[7/4]">
                    {/* Replaced dashboard image with a book-related image */}
                    <img src='https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' class="shrink-0 w-full h-full rounded-md object-cover" alt="Bookshelf" />
                </div>
            </div>
        </div>
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