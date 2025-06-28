import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from './../store/orderSlice';

export default function OrderHistoryPage() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { userOrders, status } = useSelector(state => state.orders);

    useEffect(() => {
        console.log("User object:", user); // This will show the correct structure
        if (user?.id) {
            dispatch(fetchUserOrders(user.id));
        }
    }, [user, dispatch]);

    // Helper function to get status styling
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-600';
            case 'pending':
                return 'bg-blue-100 text-blue-600';
            case 'cancelled':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    if (status === 'loading') {
        return <p className="text-center py-8">Loading your orders...</p>;
    }

    if (userOrders.length === 0 && status === 'succeeded') {
        return <p className="text-center py-8">You have not placed any orders yet.</p>;
    }

// src/components/OrderHistoryPage.jsx

// ... (other imports and code)
console.log(userOrders);
    return (
        <div className="p-4">
            <div className="max-w-screen-lg mx-auto">
                <div className="border-b border-gray-300 pb-4">
                    <div className="flex items-center flex-wrap gap-4">
                        <h3 className="text-2xl font-semibold text-slate-900">Order History</h3>
                    </div>
                </div>

                <div className="divide-y divide-gray-300 mt-6">
                    {userOrders.map(order => (
                        <div key={order.id} className="grid grid-cols-5 max-md:grid-cols-2 items-start justify-between gap-6 py-4">
                            <div className="md:col-span-2 flex items-start gap-4 max-sm:flex-col">
                                {/* <div className=" p-2 rounded-lg w-5 flex items-center justify-center h-5 shrink-0">
                                    <h1 className='text-xl font-bold'>{String(order.id).substring(0, 8)}</h1>
                                </div> */}
                                <div>
                                    <h6 className="text-[15px] font-semibold text-slate-900">
                                        Orderd Books
                                    </h6>
                                    <div className="mt-2">
                                        <p className="text-[15px] text-slate-500 font-medium">Order ID: <span className="ml-1 text-slate-900">#{String(order.id).substring(0, 8)}</span></p> {/* Changed this line */}
                                        {order.orderItems.length > 1 && (
                                            <p className="text-[13px] text-slate-500 font-medium">
                                                ({order.orderItems.length} items)
                                            </p>
                                        )}
                                        {order.orderItems.map((item, index) => {
                                            // Add this line to inspect the 'item' object
                                            console.log('Current order item:', item);
                                            return (
                                                <p key={item.bookId || index} className="text-[13px] font-semibold text-slate-700">
                                                    {item.bookTitle} <span>({item.quantity})</span>
                                                </p>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h6 className="text-[15px] font-medium text-slate-500">Date</h6>
                                <p className="text-[15px] text-slate-900 font-medium mt-2">
                                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <h6 className="text-[15px] font-medium text-slate-500">Status</h6>
                                <p className={`text-[13px] font-medium mt-2 inline-block rounded-md py-1.5 px-3 ${getStatusClass(order.status)}`}>
                                    {order.status}
                                </p>
                            </div>
                            <div className="md:ml-auto">
                                <h6 className="text-[15px] font-medium text-slate-500">Price</h6>
                                <p className="text-[15px] text-slate-900 font-medium mt-2">₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}