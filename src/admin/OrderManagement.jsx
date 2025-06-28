import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from './../store/orderSlice';

export default function OrderManagement() {
    const dispatch = useDispatch();
    const { items: orders, status } = useSelector(state => state.orders);
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
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
    }, [status, dispatch]);

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatus({ orderId, newStatus }));
    };

    if (status === 'loading') return <p>Loading orders...</p>;
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
            <div className="overflow-x-auto">
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
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                                <td className="px-6 py-4">{order.userName}</td>
                                <td className="px-6 py-4">₹{order.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select onChange={(e) => handleStatusChange(order.id, e.target.value)} defaultValue={order.status} className="p-1 border rounded-md text-sm">
                                        <option value="PENDING" >Pending</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}