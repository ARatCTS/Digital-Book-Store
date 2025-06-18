import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from './../store/cartSlice'; // Adjust path if necessary

export default function BookCard({ book }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    // Prevent the default link behavior if the button is inside an <a> tag
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to the parent link
    dispatch(addItemToCart(book));
  };

  // Optional: A placeholder for a "Buy Now" button if you want to include it,
  // or remove it if not needed.
  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement buy now logic (e.g., direct checkout, navigate to product page)
    console.log(`Buying ${book.title} now!`);
  };

  return (
    <li className="group relative block overflow-hidden">
      {/* Wishlist Button (Optional - keep if you have wishlist functionality) */}


      {/* Product Image */}
      <img
        src={`https://picsum.photos/id/${book.id}/200/300`} // Use book.imageUrl or a fallback
        alt={book.title}
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
      />

      {/* Product Details Section */}
      <div className="relative border border-gray-100 bg-white p-6">
        {/* Price - You might only show the current price */}
        <p className="text-gray-700">
          ${book.price.toFixed(2)} {/* Format price to 2 decimal places */}
          {/* If you have an old price, uncomment and adapt */}
          {/* <span className="text-gray-400 line-through">${book.oldPrice.toFixed(2)}</span> */}
        </p>

        {/* Title and Author */}
        <h3 className="mt-1.5 text-lg font-medium text-gray-900 line-clamp-1">
          {book.title}
        </h3>
        <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
          by {book.authorName} {/* Use authorName here */}
        </p>

        {/* Description (Optional - use if your book object has a description) */}
        {book.description && (
          <p className="mt-1.5 line-clamp-3 text-gray-700 text-sm">
            {book.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleAddToCart}
            className="block w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105"
          >
            Add to Cart
          </button>

          {/* Optional: Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow} // Add onClick handler
            className="block w-full rounded-sm bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:scale-105"
          >
            Buy Now
          </button>
        </div>
      </div>
    </li>
  );
}