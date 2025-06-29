import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from './../store/orderSlice';

// Define items per page
const ITEMS_PER_PAGE = 10; // You can adjust this value as needed

export default function OrderManagement() {
    const dispatch = useDispatch();
    const { items: orders, status, error } = useSelector(state => state.orders); // Destructure error from state

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    const getStatusClass = (orderStatus) => { // Renamed parameter to avoid conflict
        switch (orderStatus.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-600';
            case 'pending':
                return 'bg-blue-100 text-blue-600';
            case 'cancelled':
                return 'bg-red-100 text-red-600';
            case 'shipped':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllOrders());
        }
        // Reset to page 1 if orders data changes (e.g., after an update or re-fetch)
        setCurrentPage(1); 
    }, [status, dispatch, orders.length]); // Add orders.length to dependency array

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatus({ orderId, newStatus }));
    };

    // Calculate pagination values
    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentOrders = orders.slice(startIndex, endIndex);

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
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p>Loading orders...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center text-red-600">
                <p>Error loading orders: {error?.message || 'Please try again later.'}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
            <div className="overflow-x-auto">
                {currentOrders.length === 0 && status === 'succeeded' ? (
                    <p className="text-center py-4">No orders to display.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.map(order => ( // Map over 'currentOrders'
                                <tr key={order.id}>
                                    <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                                    <td className="px-6 py-4">{order.userName || 'N/A'}</td> {/* Added fallback */}
                                    <td className="px-6 py-4">₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td> {/* Added fallback */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status || 'unknown')}`}> {/* Added fallback */}
                                            {order.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)} 
                                            defaultValue={order.status} 
                                            className="p-1 border rounded-md text-sm"
                                            // Optionally disable if order is already delivered or cancelled
                                            // disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'} 
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            {orders.length > ITEMS_PER_PAGE && ( // Only show pagination if more than 10 orders
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
    );
}