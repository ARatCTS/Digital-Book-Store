// src/components/BookCard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { addItemToCart } from './../store/cartSlice';
import { fetchReviewsByBookId } from './../store/reviewSlice';
import { Link } from 'react-router-dom';

// Memoized selector factory: This function creates a memoized selector
// for a specific book ID. It lives outside the component to avoid re-creation.
const makeSelectReviewsForBook = () => createSelector(
  (state, bookId) => state.reviews.reviewsByBookId[bookId], // Input selector: get the reviews array (or undefined)
  (reviews) => reviews || [] // Output selector: if reviews is undefined, return an empty array (memoized reference)
);

export default function BookCard({ book }) {
  const dispatch = useDispatch();
  const [bookAvailable, setAvailable] = useState(true); // Still unused but kept for context

  // Create a memoized instance of the selector for *this specific book.id*.
  // `useMemo` ensures that `getReviewsForCurrentBook` (the selector function)
  // is only re-created if `book.id` changes.
  const getReviewsForCurrentBook = useMemo(() => makeSelectReviewsForBook(), []); // No dependencies for the factory itself

  // Now, use the memoized selector instance with useSelector.
  // The second argument `book.id` is passed as an argument to the input selectors.
  const reviews = useSelector((state) => getReviewsForCurrentBook(state, book.id));

  // These selectors are fine as they don't create new array/object references on every call
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

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Buying ${book.title} now!`);
  };

  return (
    <li className="flex flex-col">
      <Link
        to={`/book/${book.id}`}
        className="group relative flex h-full flex-col overflow-hidden border border-gray-100 bg-white"
      >
        <div className="flex h-64 w-full items-center justify-center bg-black text-center transition duration-500 group-hover:scale-105 sm:h-72">
          <img
            src={book.image || 'https://placehold.co/300x400/b8b8b8/ffffff?text=No+Image'}
            className="w-full h-full object-cover"
            alt={`Cover of ${book.title}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/300x400/b8b8b8/ffffff?text=No+Image';
            }}
          />
        </div>

        <div className="relative flex flex-1 flex-col p-6">
          <div className="flex-1">
            <span className="whitespace-nowrap bg-yellow-400 px-3 py-1.5 text-xs font-medium">
              New
            </span>

            <h3 className="mt-4 text-lg font-medium text-gray-900">{book.title}</h3>
            <p className="mt-0.5 text-sm text-gray-500">by {book.authorName}</p>
            {/* New: Display Category Name */}
            {book.categoryName && (
              <p className="mt-0.5 text-xs text-gray-400">Category: {book.categoryName}</p>
            )}
            <p className="mt-1.5 text-lg font-semibold text-gray-800">₹{book.price.toFixed(2)}</p>

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
