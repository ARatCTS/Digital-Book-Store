import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import { addItemToCart } from '../store/cartSlice';
import { fetchReviewsByBookId, addReview } from '../store/reviewSlice';
import StarRating from './StarRating';


export default function ProductDetailPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allBooks = useSelector(state => state.books.items);
  const bookStatus = useSelector(state => state.books.status);

  const reviews = useSelector(state => state.reviews.reviewsByBookId[bookId] || []);
  const reviewStatus = useSelector(state => state.reviews.statuses[bookId] || 'idle');
  const reviewError = useSelector(state => state.reviews.errors[bookId] || null);

  const { isAuthenticated } = useSelector(state => state.auth);

  const book = allBooks.find(b => b.id.toString() === bookId);

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5); 

  useEffect(() => {
    if (bookStatus === 'idle' && allBooks.length === 0) {
      dispatch(fetchBooks());
    }

    if (bookId && (reviewStatus === 'idle' || reviewStatus === 'failed')) {
        dispatch(fetchReviewsByBookId(bookId));
    }
  }, [bookId, allBooks.length, bookStatus, reviewStatus, dispatch]);


  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !bookId) { 
        alert("Please enter a comment for your review.");
        return;
    }

    const resultAction = await dispatch(addReview({ bookId, comment, rating }));

    if (addReview.fulfilled.match(resultAction)) {
        setComment('');
        setRating(5);

    } else {
        alert(`Failed to add review: ${resultAction.payload?.message || 'Unknown error'}`);
    }
  };

  const handleBuyNow = () => {
    if (book) {
      dispatch(addItemToCart(book));
      navigate('/checkout');
    } else {
      console.warn("Attempted to buy now, but book data is not available.");
      alert("Book data not available. Please try again.");
    }
  };
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0; 

  if (bookStatus === 'loading' && !book) {
    return <div className="text-center p-10 font-semibold text-lg">Loading book details...</div>;
  }

  if (bookStatus === 'succeeded' && !book) {
    return <div className="text-center p-10 font-semibold text-lg text-red-600">Book not found.</div>;
  }

  if (bookStatus === 'failed') {
      return <div className="text-center p-10 font-semibold text-lg text-red-600">Error loading book details. Please try again.</div>;
  }

  if (!book) {
    return <div className="text-center p-10 font-semibold text-lg">Book details not available.</div>;
  }


  return (
    <div className="font-sans container mx-auto px-4 py-8"> 
      <div className="grid items-start grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="col-span-1 lg:col-span-2 lg:sticky top-0"> 
           <div className="bg-gray-100 rounded-lg h-[550px] flex items-center justify-center overflow-hidden"> {/* Added overflow-hidden */}
           {book.image ? (
             <img src={book.image} alt={book.title} className='object-contain max-h-full max-w-full'
               onError={(e) => {
                 e.target.onerror = null;
                 e.target.src = 'https://via.placeholder.com/400x550?text=No+Image'; 
               }}
             />
           ) : (
             <span className="text-gray-400 text-xl">Book Cover Placeholder</span>
           )}
           </div>
        </div>

        <div className="py-6 px-4 sm:px-8 col-span-1">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{book.title}</h2>
            <p className="text-lg text-slate-500 mt-2">by {book.authorName}</p>
            {book.categoryName && (
                <p className="mt-0.5 text-base text-slate-500">Category: {book.categoryName}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <StarRating rating={averageRating} />
            <a href="#reviews" className="px-2.5 py-1.5 bg-slate-100 text-xs text-slate-900 rounded-md cursor-pointer">
              {reviews.length} Reviews
            </a>
          </div>

          <div className="mt-8">
            <div className="flex items-center flex-wrap gap-4">
              <p className="text-slate-900 text-4xl font-semibold">₹{book.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => dispatch(addItemToCart(book))}
              type="button"
              className="w-full px-4 py-3 cursor-pointer border border-slate-800 bg-transparent hover:bg-slate-50 text-slate-900 font-semibold rounded-md transition-colors"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              type="button"
              className="w-full px-4 py-3 cursor-pointer border border-slate-800 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-md transition-colors"
            >
              Buy now
            </button>
          </div>

          <div className="mt-10">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Description</h3>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {book.description || 'A full description of this amazing book is coming soon. It will detail the plot, characters, and unique selling points to engage potential readers.'}
              </p>
            </div>

          </div>
        </div>
      </div>

      <div id="reviews" className="mt-16 pt-8 border-t">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
        
        {reviewStatus === 'loading' && <p>Loading reviews...</p>}
        {reviewStatus === 'failed' && reviewError && (
            <p className="text-red-500">Error loading reviews: {reviewError.message || 'Unknown error'}</p>
        )}

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-slate-50 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold">Write a Review</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts on this book..."
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-slate-400"
              rows="4"
              required
            />
            <div className="flex items-center gap-4">
              <label htmlFor="rating-select" className="sr-only">Select Rating</label>
              <select
                id="rating-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="p-2 border rounded-md"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} ★</option>
                ))}
              </select>
              <button type="submit" className="px-6 py-2 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-900">
                Submit Review
              </button>
            </div>
          </form>
        )}
        
        <div className="space-y-6">
          {reviewStatus === 'succeeded' && reviews.length === 0 && <p>Be the first to review this book!</p>}
          {reviews.map(review => (
            <div key={review.id} className="border-b pb-4">
              <StarRating rating={review.rating} />
              <p className="text-md text-gray-800 my-2">{review.comment}</p>
              <p className="text-xs text-gray-500">
                by {review.userName || 'Anonymous'} on {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
