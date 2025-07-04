import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import { fetchAllOrders } from '../store/orderSlice';
import { fetchAllReviews } from '../store/reviewSlice'; 

const DashboardStatCard = ({ title, value, linkTo }) => (
    <Link to={linkTo} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow block">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="text-2xl font-bold text-green-600 mt-2">{value}</p>
    </Link>
);

export default function AdminDashboard() {
    const dispatch = useDispatch();

    const books = useSelector(state => state.books.items);
    const orders = useSelector(state => state.orders.items);
    const allReviews = useSelector(state => state.reviews.allReviews); 
    const reviewStatus = useSelector(state => state.reviews.allReviewsStatus); 

    const pendingOrders = orders.filter(order => order.status && order.status.toLowerCase() === 'pending');
    const pendingReviews = allReviews.filter(review => !review.approved);

    useEffect(() => {
        dispatch(fetchBooks());
        dispatch(fetchAllOrders());
        if (reviewStatus === 'idle') {
            dispatch(fetchAllReviews());
        }
    }, [dispatch, reviewStatus]);

    return (
        <div className="space-y-2">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Admin!</h1>
                <p className="text-gray-600">Here's a quick overview of your bookstore's performance.</p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Added xl:grid-cols-4 */}
                <DashboardStatCard title="Total Books" value={books.length} linkTo="/admin/books" />
                <DashboardStatCard title="Total Orders" value={orders.length} linkTo="/admin/orders" />
                <DashboardStatCard title="Total Reviews" value={allReviews.length} linkTo="/admin/reviews" />
                <DashboardStatCard title="Pending Orders" value={pendingOrders.length} linkTo="/admin/orders" />
                <DashboardStatCard title="Pending Reviews" value={pendingReviews.length} linkTo="/admin/reviews" />
            </div>
        </div>
    );
}