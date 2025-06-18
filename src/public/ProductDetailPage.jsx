import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/bookSlice';
import { addItemToCart } from '../store/cartSlice';

export default function ProductDetailPage() {
    const { bookId } = useParams();
    const dispatch = useDispatch();
    const { items: books, status } = useSelector(state => state.books);
    const book = books.find(b => b.id.toString() === bookId);

    useEffect(() => {
        if (books.length === 0) {
            dispatch(fetchBooks());
        }
    }, [books.length, dispatch]);
    
    if (status === 'loading' || !book) {
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
        </div>
    );
}
