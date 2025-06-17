import React from 'react';

export default function BookCard({ book }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{book.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{book.authorName}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-800">${book.price}</span>
          <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}