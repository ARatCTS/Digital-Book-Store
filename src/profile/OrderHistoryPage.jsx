import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from './../store/orderSlice';

// Define items per page for orders
const ITEMS_PER_PAGE = 5; // You can adjust this value as needed

export default function OrderHistoryPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { userOrders, status, error } = useSelector(state => state.orders); // Destructure error

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // console.log("User object:", user); // This will show the correct structure
        if (user?.id) {
            dispatch(fetchUserOrders(user.id));
        }
        // Reset to page 1 if userOrders data changes
        setCurrentPage(1);
    }, [user, dispatch, userOrders.length]); // Add userOrders.length to dependencies

    // Helper function to get status styling
    const getStatusClass = (orderStatus) => { // Renamed parameter to avoid conflict
        switch ((orderStatus || '').toLowerCase()) { // Added fallback for undefined status
            case 'delivered':
                return 'bg-green-100 text-green-600';
            case 'pending':
                return 'bg-blue-100 text-blue-600';
            case 'cancelled':
                return 'bg-red-100 text-red-600';
            case 'shipped':
                return 'bg-yellow-100 text-yellow-600';
            case 'processing': // Added 'processing' status
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(userOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    // Get only the orders for the current page
    const currentOrders = userOrders.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Loading and Error States ---
    if (status === 'loading') {
        return <p className="text-center py-8">Loading your orders...</p>;
    }

    if (status === 'failed') {
        return <p className="text-center py-8 text-red-600">Error loading orders: {error?.message || 'Please try again later.'}</p>;
    }

    if (userOrders.length === 0 && status === 'succeeded') {
        return <p className="text-center py-8">You have not placed any orders yet.</p>;
    }

    return (
        <div className="p-4">
            <div className="max-w-screen-lg mx-auto">
                <div className="border-b border-gray-300 pb-4">
                    <div className="flex items-center flex-wrap gap-4">
                        <h3 className="text-2xl font-semibold text-slate-900">Order History</h3>
                    </div>
                </div>

                <div className="divide-y divide-gray-300 mt-6">
                    {currentOrders.map(order => ( // Map over 'currentOrders' for pagination
                        <div key={order.id} className="grid grid-cols-1 md:grid-cols-5 items-start justify-between gap-6 py-4">
                            {/* Order Details Column */}
                            <div className="md:col-span-2 flex flex-col items-start gap-2">
                                <h6 className="text-[15px] font-semibold text-slate-900">Order Details</h6>
                                <p className="text-[15px] text-slate-500 font-medium">Order ID: <span className="ml-1 text-slate-900">#{String(order.id || '').substring(0, 8)}</span></p>

                                {/* List of Ordered Books */}
                                <div className="mt-2 space-y-1">
                                    {order.orderItems && order.orderItems.length > 0 ? (
                                        <>
                                            <p className="text-[13px] text-slate-500 font-medium">Ordered Books ({order.orderItems.length} items):</p>
                                            {order.orderItems.map((item, index) => (
                                                <div key={item.bookId || index} className="text-[13px] text-slate-700">
                                                    <p className="font-semibold">{item.bookTitle} <span className="font-normal">x {item.quantity}</span></p>
                                                    {item.authorName && <p className="text-gray-500">by {item.authorName}</p>}
                                                    {item.categoryName && <p className="text-gray-500">Category: {item.categoryName}</p>}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <p className="text-[13px] text-red-500">No book details available for this order.</p>
                                    )}
                                </div>
                            </div>

                            {/* Date Column */}
                            <div>
                                <h6 className="text-[15px] font-medium text-slate-500">Order Date</h6>
                                <p className="text-[15px] text-slate-900 font-medium mt-2">
                                    {(order.orderDate && new Date(order.orderDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })) || 'N/A'}
                                </p>
                            </div>

                            {/* Status Column */}
                            <div>
                                <h6 className="text-[15px] font-medium text-slate-500">Status</h6>
                                <p className={`text-[13px] font-medium mt-2 inline-block rounded-md py-1.5 px-3 ${getStatusClass(order.status)}`}>
                                    {order.status || 'Unknown'}
                                </p>
                            </div>

                            {/* Price Column */}
                            <div className="md:ml-auto">
                                <h6 className="text-[15px] font-medium text-slate-500">Total Price</h6>
                                <p className="text-[15px] text-slate-900 font-medium mt-2">
                                    ₹{(order.totalAmount ? order.totalAmount.toFixed(2) : '0.00')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {userOrders.length > ITEMS_PER_PAGE && ( // Only show pagination if more than ITEMS_PER_PAGE orders
                    <div className="flex justify-center mt-8 space-x-2">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToPage(index + 1)}
                                className={`px-4 py-2 border rounded-md ${
                                    currentPage === index + 1 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
