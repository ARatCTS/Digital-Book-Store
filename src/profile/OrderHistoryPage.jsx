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



    if(status === 'loading') return <p>Loading your orders...</p>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">My Order History</h1>
            <div className="space-y-4">
                {userOrders.map(order => (
                    <div key={order.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-between mt-2">
                             <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                             <p><strong>Status:</strong> {order.status}</p>
                        </div>
                    </div>
                ))}
                {userOrders.length === 0 && <p>You have not placed any orders yet.</p>}
            </div>
        </div>
    );
}
