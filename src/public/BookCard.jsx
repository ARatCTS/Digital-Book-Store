import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from './../store/cartSlice';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const dispatch = useDispatch();
  const [bookAvailable, setAvailable] = useState(true);

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
        {/* Black Placeholder with Book Title */}
        <div className="flex h-64 w-full items-center justify-center bg-black text-center transition duration-500 group-hover:scale-105 sm:h-72">
          {/* <h2 className="px-4 text-lg font-bold text-white">{book.title}</h2> */}
          <img src={book.image} class="w-full h-full object-cover" alt="Testing a book" />
        </div>

        {/* Product Details */}
        <div className="relative flex flex-1 flex-col p-6">
          <div className="flex-1">
            <span className="whitespace-nowrap bg-yellow-400 px-3 py-1.5 text-xs font-medium">
              New
            </span>

            <h3 className="mt-4 text-lg font-medium text-gray-900">{book.title}</h3>
            <p className="mt-0.5 text-sm text-gray-500">by {book.authorName}</p>
            <p className="mt-1.5 text-lg font-semibold text-gray-800">₹{book.price.toFixed(2)}</p>

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