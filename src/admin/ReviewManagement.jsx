import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, moderateReview } from './../store/reviewSlice';

export default function ReviewManagement() {
    const dispatch = useDispatch();
    const { items: reviews, status } = useSelector(state => state.reviews);

    useEffect(() => {
        dispatch(fetchAllReviews());
    }, [dispatch]);

    const handleApprove = (reviewId, isApproved) => {
        dispatch(moderateReview({ reviewId, approved: isApproved }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Moderate Reviews</h1>
            <div className="space-y-4">
                {reviews.filter(r => !r.approved).map(review => (
                    <div key={review.id} className="border p-4 rounded-lg">
                        <p><strong>{review.userName}</strong> on <em>{review.bookTitle}</em></p>
                        <p className="mt-2">"{review.comment}"</p>
                        <p className="text-yellow-500">Rating: {review.rating}/5</p>
                        <div className="mt-4">
                            <button onClick={() => handleApprove(review.id, true)} className="px-3 py-1 bg-green-500 text-white rounded mr-2">Approve</button>
                            <button onClick={() => handleApprove(review.id, false)} className="px-3 py-1 bg-red-500 text-white rounded">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}