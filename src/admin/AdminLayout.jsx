import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const AdminSidebarLink = ({ to, children }) => {
    // Determine if the current route matches the link's 'to' prop
    // This is a more robust way to handle active states for nested routes
    const location = useLocation();
    const isActive = location.pathname.startsWith(to) && (to === '/admin' || location.pathname.length > to.length);

    return (
        <NavLink to={to}
            className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors
                       ${isActive ? 'bg-gray-100 text-green-600 font-semibold' : 'text-gray-700'}`}>
            {children}
        </NavLink>
    );
};

export default function AdminLayout() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const location = useLocation(); // To get current path for active section logic

    // Effect to close sidebar on route change for mobile
    useEffect(() => {
        setOpenSidebar(false);
    }, [location.pathname]);

    // Helper to get window width for responsive sidebar behavior
    const isLargeScreen = window.innerWidth >= 768;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-white shadow-lg transition-all duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-50
                               ${openSidebar ? 'w-64' : 'w-20'} ${!openSidebar && !isLargeScreen ? 'hidden' : ''} md:w-64`}>
                <div className="p-4 flex items-center justify-between border-b">
                    <h1 className={`text-xl font-bold text-green-600 transition-opacity duration-300
                                   ${openSidebar || isLargeScreen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        Admin Panel
                    </h1>
                    <button onClick={() => setOpenSidebar(!openSidebar)} className="md:hidden p-2 rounded-full hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
                <nav className="py-4">
                    <ul className="space-y-2">
                        <li>
                            <AdminSidebarLink to="/admin/dashboard">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0l-2-2m2 2V4a1 1 0 00-1-1h-3a1 1 0 00-1 1z" />
                                </svg>
                                <span className={`${openSidebar || isLargeScreen ? 'block opacity-100' : 'hidden opacity-0'} text-gray-700 transition-opacity duration-300`}>Dashboard</span>
                            </AdminSidebarLink>
                        </li>
                        <li>
                            <AdminSidebarLink to="/admin/books">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13.5m0-13.5C10.832 5.477 9.246 5.25 7.5 5.25A2.25 2.25 0 005.25 7.5v.637C5.25 9.01 5.925 9.75 6.75 9.75H9.75v10.5h2.25V6.253zm0 0c1.172-.53 2.155-.918 3.071-1.137M12 6.253C13.678 5.477 15.264 5.25 17 5.25a2.25 2.25 0 012.25 2.25v.637c0 .874-.675 1.55-1.5 1.5H14.25v10.5h2.25V6.253z" />
                                </svg>
                                <span className={`${openSidebar || isLargeScreen ? 'block opacity-100' : 'hidden opacity-0'} text-gray-700 transition-opacity duration-300`}>Books</span>
                            </AdminSidebarLink>
                        </li>
                        <li>
                            <AdminSidebarLink to="/admin/orders">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span className={`${openSidebar || isLargeScreen ? 'block opacity-100' : 'hidden opacity-0'} text-gray-700 transition-opacity duration-300`}>Orders</span>
                            </AdminSidebarLink>
                        </li>
                        <li>
                            <AdminSidebarLink to="/admin/reviews">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className={`${openSidebar || isLargeScreen ? 'block opacity-100' : 'hidden opacity-0'} text-gray-700 transition-opacity duration-300`}>Reviews</span>
                            </AdminSidebarLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1  md:p-6 overflow-y-auto">
                {/* Mobile Menu Toggle (only visible on small screens when sidebar is closed) */}
                <div className={`md:hidden flex justify-between items-center mb-4 ${openSidebar ? 'hidden' : 'block'}`}>
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    <button onClick={() => setOpenSidebar(!openSidebar)} class="p-2 rounded-full hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
                <Outlet /> {/* This is where your AdminDashboard, BookManagement etc. will render */}
            </main>
        </div>
    );
}