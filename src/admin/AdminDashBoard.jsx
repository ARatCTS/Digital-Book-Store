import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from './../store/bookSlice';
import { fetchAllOrders } from './../store/orderSlice';

const StatCard = ({ title, value, linkTo }) => (
    <Link to={linkTo} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow block">
        <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </Link>
);

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const books = useSelector(state => state.books.items);
    const orders = useSelector(state => state.orders.items);
    
    useEffect(() => {
        dispatch(fetchBooks());
        dispatch(fetchAllOrders());
    }, [dispatch]);
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="grid md:grid-cols-3 gap-6">
                <StatCard title="Total Books" value={books.length} linkTo="/admin/books" />
                <StatCard title="Total Orders" value={orders.length} linkTo="/admin/orders" />
                <StatCard title="Pending Reviews" value="12" linkTo="/admin/reviews" />
            </div>
        </div>
    );
}