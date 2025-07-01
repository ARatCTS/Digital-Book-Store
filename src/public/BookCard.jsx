// src/components/BookCard.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from './../store/cartSlice';
import { fetchReviewsByBookId } from './../store/reviewSlice'; // Ensure this path is correct
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const dispatch = useDispatch();
  const [bookAvailable, setAvailable] = useState(true); 
  const reviews = useSelector((state) => state.reviews.reviewsByBookId[book.id] || []);
  const reviewsStatus = useSelector((state) => state.reviews.statuses[book.id] || 'idle');
  const reviewsError = useSelector((state) => state.reviews.errors[book.id] || null);


  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {

    if (book.id && (reviewsStatus === 'idle' || reviewsStatus === 'failed')) {
      dispatch(fetchReviewsByBookId(book.id));
    }
  }, [dispatch, book.id, reviewsStatus]); 

  useEffect(() => {
    if (reviewsStatus === 'succeeded') {
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avg = totalRating / reviews.length;
        setAverageRating(avg.toFixed(1)); 
      } else {
        setAverageRating(null); 
      }
    }
  }, [reviews, reviewsStatus]); 

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    dispatch(addItemToCart(book));
  };


  return (
    <li className="flex flex-col">
      <Link
        to={`/book/${book.id}`}
        className="group relative flex h-full flex-col overflow-hidden border border-gray-100 bg-white"
      >
        {/* Black Placeholder with Book Image */}
        <div className="flex h-64 w-full items-center justify-center bg-black text-center transition duration-500 group-hover:scale-105 sm:h-72">
          {/* Ensure book.image exists and is a valid URL */}
          <img
            src={book.image}
            className="w-full h-full object-cover"
            alt={`Cover of ${book.title}`}
            onError={(e) => {
              // Optional: Provide a fallback image if the URL is broken
              e.target.onerror = null; // Prevent infinite loop if fallback also fails
              e.target.src = 'https://via.placeholder.com/200x280?text=No+Image'; // Fallback image
            }}
          />
        </div>

        {/* Product Details */}
        <div className="relative flex flex-1 flex-col p-6">
          <div className="flex-1">
            {/* New/Sale Badge - Can be dynamic based on book data */}
            <span className="whitespace-nowrap bg-yellow-400 px-3 py-1.5 text-xs font-medium">
              New
            </span>

            <h3 className="mt-4 text-lg font-medium text-gray-900">{book.title}</h3>
            <p className="mt-0.5 text-sm text-gray-500">by {book.authorName}</p>
            <p className="mt-1.5 text-lg font-semibold text-gray-800">₹{book.price.toFixed(2)}</p>

            {/* Display Average Rating */}
            <div className="mt-1">
              {reviewsStatus === 'loading' && (
                <p className="text-sm text-gray-600">Loading rating...</p>
              )}
              {reviewsStatus === 'failed' && reviewsError && (
                <p className="text-sm text-red-500">Error loading rating: {reviewsError.message || 'Unknown error'}</p>
              )}
              {reviewsStatus === 'succeeded' && (
                <p className="text-sm text-gray-700">
                  {averageRating !== null ? (
                    <>
                      Rating: <span className="font-semibold text-blue-600">{averageRating}</span> / 5 ({reviews.length} reviews)
                    </>
                  ) : (
                    'No reviews yet'
                  )}
                </p>
              )}
            </div>

            {book.description && (
              <p className="mt-2 line-clamp-3 text-sm text-gray-700">
                {book.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="block w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
            >
              Add to Cart
            </button>

          </div>
        </div>
      </Link>
    </li>
  );
}