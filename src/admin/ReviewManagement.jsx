import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, moderateReview, deleteReview } from './../store/reviewSlice';

export default function ReviewManagement() {
    const dispatch = useDispatch();
    const { items: reviews, status } = useSelector(state => state.reviews);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllReviews());
        }
    }, [status, dispatch]);

    const handleApprove = (id) => {
        dispatch(moderateReview({ id, approved: true }));
    };



    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this review?");
        if (confirmDelete) {
            dispatch(deleteReview(id));
        }
    };

    if (status === 'loading') return <p>Loading reviews...</p>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Moderate Reviews</h1>
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p>No reviews available.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="border p-4 rounded-lg flex justify-between items-start">
                            <div>
                                <p><strong>{review.userName}</strong> on <em>{review.bookTitle}</em></p>
                                <p className="text-yellow-500 my-1">Rating: {'★'.repeat(review.rating)}</p>
                                <p className="text-gray-600 mt-2">"{review.comment}"</p>
                                <p className="text-sm mt-1 text-gray-500">Status: {review.approved ? 'Approved' : 'Pending'}</p>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0 ml-4">
                                {!review.approved && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
