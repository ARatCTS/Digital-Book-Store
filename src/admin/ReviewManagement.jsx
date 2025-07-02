import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, moderateReview, deleteReview } from './../store/reviewSlice';

const ITEMS_PER_PAGE = 10; 
export default function ReviewManagement() {
    const dispatch = useDispatch();
    const { allReviews: reviews, allReviewsStatus: status, allReviewsError: error } = useSelector(state => state.reviews);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllReviews());
        }

        setCurrentPage(1); 
    }, [status, dispatch, reviews.length]); 

    const handleApprove = (id) => {
        dispatch(moderateReview({ id, approved: true }));
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this review?");
        if (confirmDelete) {
            dispatch(deleteReview(id));
        }
    };

    const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentReviews = reviews.slice(startIndex, endIndex);

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
                {currentReviews.length === 0 && status === 'succeeded' ? ( 
                    <p>No reviews available for moderation.</p>
                ) : (
                    currentReviews.map(review => ( 
                        <div key={review.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-2 sm:mb-0 sm:mr-4 flex-grow">
                                <p>
                                    <strong>{review.userName || 'Anonymous'}</strong> on 
                                    <em> {review.bookTitle ? review.bookTitle : 'N/A Book Title'}</em>
                                </p>
                                <p className="text-yellow-500 my-1">
                                    Rating: {'★'.repeat(review.rating || 0)}
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

            {reviews.length > ITEMS_PER_PAGE && ( 
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