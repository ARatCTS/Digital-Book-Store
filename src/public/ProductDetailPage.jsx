import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import { addItemToCart } from '../store/cartSlice';
import { fetchReviewsByBookId, addReview } from '../store/reviewSlice';

export default function ProductDetailPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch();

  const { items: books, status: bookStatus } = useSelector(state => state.books);
  const { items: reviews, status: reviewStatus } = useSelector(state => state.reviews);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const book = books.find(b => b.id.toString() === bookId);

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
    dispatch(fetchReviewsByBookId(bookId));
  }, [bookId, books.length, dispatch]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(addReview({ bookId, comment, rating }));
    setComment('');
    setRating(5);
  };

  if (bookStatus === 'loading' || !book) {
    return <div className="text-center p-10">Loading book details...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="md:w-full">
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Book Cover Image</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-xl text-gray-500 mt-2">by {book.authorName}</p>
          <p className="text-3xl font-bold text-indigo-600 my-6">${book.price.toFixed(2)}</p>
          <p className="text-gray-700 leading-relaxed mb-8">
            This is a placeholder for the book's description. It would detail the plot, characters, and unique selling points of the book to engage potential readers.
          </p>
          <div>
            <button
              onClick={() => dispatch(addItemToCart(book))}
              className="w-full px-10 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {reviewStatus === 'loading' && <p>Loading reviews...</p>}
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map(review => (
          <div key={review.id} className="mb-4 border-b pb-2">
            <p className="text-sm text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-500">Rating: {review.rating} ★ by {review.userName}</p>
          </div>
        ))}

        {/* Add Review Form */}
        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="p-2 border rounded"
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} ★</option>
              ))}
            </select>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
