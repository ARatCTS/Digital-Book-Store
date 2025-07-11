import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from './../store/cartSlice';
import { fetchReviewsByBookId } from './../store/reviewSlice'; 
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function BookCard({ book }) {
  const dispatch = useDispatch();
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
        <div className="flex h-full w-full items-center justify-center bg-white text-center transition duration-500 group-hover:scale-105 sm:h-72">
         <img
            src={book.image}
            className="w-50 h-70 object-fill"
            alt={`Cover of ${book.title}`}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://placehold.co/300x400/e0b8a4/4a4e4d?text=${book.title}`; 
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
            <p className="mt-1.5 text-lg font-semibold text-gray-800">₹{book.price.toFixed(2)}</p>

            <div className="mt-1">
              {reviewsStatus === 'loading' && (
                <p className="text-sm text-gray-600">Loading rating...</p>
              )}
              {reviewsStatus === 'failed' && reviewsError && (
                <p className="text-sm text-red-500">Error loading rating: {reviewsError.message || 'Unknown error'}</p>
              )}
              {reviewsStatus === 'succeeded' && (
                <div className="text-sm text-gray-700">
                  {averageRating !== null ? (
                    <>
                      <StarRating rating={averageRating}/>
                    </>
                  ) : (
                    'No reviews yet'
                  )}
                </div>
              )}
            </div>

            {book.description && (
              <p className="mt-2 line-clamp-3 text-sm text-gray-700">
                {book.description}
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            {book.stockQuantity > 0 ? (
              <button
                onClick={handleAddToCart}
                className="block w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
              >
                Add to Cart
              </button>
            ) : (
              <button
                disabled 
                className="block w-full cursor-not-allowed rounded-sm bg-red-100 px-4 py-3 text-sm font-medium text-red-700 opacity-75"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}