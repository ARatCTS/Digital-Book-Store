import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import { addItemToCart } from '../store/cartSlice';
import { fetchReviewsByBookId, addReview } from '../store/reviewSlice';

// A small component to render star ratings
const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);
  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${index < filledStars ? 'text-slate-800' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 14 13"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
      ))}
    </div>
  );
};


export default function ProductDetailPage() {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: books, status: bookStatus } = useSelector(state => state.books);
  const { items: reviews, status: reviewStatus } = useSelector(state => state.reviews);
  const { isAuthenticated } = useSelector(state => state.auth);

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
    if (!comment.trim()) return; // Prevent empty reviews
    dispatch(addReview({ bookId, comment, rating }));
    setComment('');
    setRating(5);
  };

  const handleBuyNow = () => {
    dispatch(addItemToCart(book));
    navigate('/checkout');
  };
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  if (bookStatus === 'loading' || !book) {
    return <div className="text-center p-10 font-semibold text-lg">Loading book details...</div>;
  }

  return (
    <div className="font-sans">
      <div className="grid items-start grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Placeholder for Image Gallery */}
        <div className="col-span-2 lg:sticky top-0">
           <div className="bg-gray-100 rounded-lg h-[550px] flex items-center justify-center">
            {book.image ?(
              <img src={book.image} alt={book.title} className='object-contain max-h-full max-w-full'/>
            ):(
             <span className="text-gray-400 text-xl">Book Cover Placeholder</span>
            )}
           </div>
        </div>

        {/* Product Details */}
        <div className="py-6 px-4 sm:px-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{book.title}</h2>
            <p className="text-lg text-slate-500 mt-2">by {book.authorName}</p>
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
              {/* You can add a compare_at_price to your book data to show a discount */}
              {/* <p className="text-slate-400 text-xl mt-1"><strike>$42.00</strike></p> */}
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
            {/* You can add more structured details here if they exist in your book data */}
            {/* <ul className="space-y-3 list-disc mt-4 pl-4 text-sm text-slate-600">
               <li>Detail point one about the book.</li>
               <li>Information about the book's edition or format.</li>
            </ul> */}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="mt-16 pt-8 border-t">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
        {reviewStatus === 'loading' && <p>Loading reviews...</p>}

        {/* Add Review Form */}
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
              <select
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
        
        {/* Display Reviews */}
        <div className="space-y-6">
          {reviews.length === 0 && reviewStatus !== 'loading' && <p>Be the first to review this book!</p>}
          {reviews.map(review => (
            <div key={review.id} className="border-b pb-4">
              <StarRating rating={review.rating} />
              <p className="text-md text-gray-800 my-2">{review.comment}</p>
              <p className="text-xs text-gray-500">by {review.userName} on {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}