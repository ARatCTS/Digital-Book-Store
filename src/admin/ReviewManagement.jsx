import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, moderateReview, deleteReview } from './../store/reviewSlice';

export default function ReviewManagement() {
    const dispatch = useDispatch();
    // Select 'allReviews' and its 'allReviewsStatus' and 'allReviewsError' from the state
    // This aligns with how fetchAllReviews populates the state in reviewSlice.js
    const { allReviews: reviews, allReviewsStatus: status, allReviewsError: error } = useSelector(state => state.reviews);

    useEffect(() => {
        // Fetch all reviews only if the status is 'idle', to avoid multiple fetches on mount
        if (status === 'idle') {
            dispatch(fetchAllReviews());
        }
    }, [status, dispatch]); // Depend on 'status' to re-dispatch if it changes (e.g., after an action completes)

    const handleApprove = (id) => {
        dispatch(moderateReview({ id, approved: true }));
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this review?");
        if (confirmDelete) {
            dispatch(deleteReview(id));
        }
    };

    // --- Loading and Error States ---
    if (status === 'loading') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p>Loading reviews...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center text-red-600">
                <p>Error loading reviews: {error?.message || 'Please try again later.'}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Moderate Reviews</h1>
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p>No reviews available for moderation.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-2 sm:mb-0 sm:mr-4 flex-grow"> {/* Added flex-grow for better layout */}
                                <p>
                                    <strong>{review.userName || 'Anonymous'}</strong> on 
                                    {/* Ensure review.bookTitle is available from your backend */}
                                    <em> {review.bookTitle ? review.bookTitle : 'N/A Book Title'}</em>
                                </p>
                                <p className="text-yellow-500 my-1">
                                    Rating: {'★'.repeat(review.rating || 0)} {/* Default to 0 if rating is undefined */}
                                </p>
                                <p className="text-gray-600 mt-2">"{review.comment}"</p>
                                <p className="text-sm mt-1 text-gray-500">
                                    Status: <span className={review.approved ? 'text-green-700 font-medium' : 'text-orange-700 font-medium'}>
                                        {review.approved ? 'Approved' : 'Pending'}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    Submitted on: {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                                {/* Only show Approve button if the review is not yet approved */}
                                {!review.approved && (
                                    <button
                                        onClick={() => handleApprove(review.id)}
                                        className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    >
                                        Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
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