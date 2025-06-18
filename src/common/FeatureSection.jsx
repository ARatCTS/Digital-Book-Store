import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from './../store/bookSlice'; // Correct import from bookSlice.js

const FeatureSection = () => {
    const dispatch = useDispatch();
    // Select books data, status, and error from the Redux store
    const { items: books, status, error } = useSelector(state => state.books);

    // Fetch books when the component mounts or status is idle
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBooks()); // Using the fetchBooks thunk
        }
    }, [status, dispatch]); // Dependencies: re-run if status or dispatch changes

    // --- Loading, Error, and Empty State Handling ---
    if (status === 'loading') {
        return (
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center">
                    <p className="text-gray-600">Loading featured books...</p>
                </div>
            </section>
        );
    }

    if (status === 'failed') {
        return (
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center">
                    <p className="text-red-600">Error loading books: {error ? error.message || JSON.stringify(error) : 'Unknown error'}</p>
                    <button
                        onClick={() => dispatch(fetchBooks())} // Retry with fetchBooks
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry Load
                    </button>
                </div>
            </section>
        );
    }

    // Filter to ensure we have at least 4 books to show, or show fewer if not enough.
    // If you always want exactly 4 or a "no items" message, adjust this logic.
    const featuredBooks = books.slice(0, 4); // <--- This line limits to the first 4 books

    if (!featuredBooks || featuredBooks.length === 0) {
        return (
            <section className="py-12 bg-white sm:py-16 lg:py-20">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center">
                    <p className="text-gray-600">No featured books available at the moment.</p>
                </div>
            </section>
        );
    }
    // --- End Loading, Error, and Empty State Handling ---

    return (
        <section className="py-12 bg-white sm:py-16 lg:py-20">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our Featured Books</h2>
                    <p className="mt-4 text-base font-normal leading-7 text-gray-600">
                        Discover a selection of our most popular titles.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-16 lg:gap-4 lg:grid-cols-4">
                    {/* Map over the 'featuredBooks' array to render each book dynamically */}
                    {featuredBooks.map((book) => (
                        <div key={book.id} className="relative group"> {/* book.id is crucial for React keys */}
                            <div className="overflow-hidden aspect-w-1 aspect-h-1">
                                <img
                                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-125"
                                    // Use book.coverImageUrl or appropriate field from your book object
                                    src={`https://picsum.photos/id/${book.id}/200/300`}
                                    alt={book.title}
                                />
                            </div>
                            {/* Example for a "New" tag, assuming 'isNew' property */}
                            {book.isNew && (
                                <div className="absolute left-3 top-3">
                                    <p className="sm:px-3 sm:py-1.5 px-1.5 py-1 text-[8px] sm:text-xs font-bold tracking-wide text-gray-900 uppercase bg-white rounded-full">New</p>
                                </div>
                            )}

                            <div className="flex items-start justify-between mt-4 space-x-4">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                        <a href={`/books/${book.id}`} title={book.title}>
                                            {book.title}
                                            <span className="absolute inset-0" aria-hidden="true"></span>
                                        </a>
                                    </h3>
                                    <p className="text-xs text-gray-600">by {book.authorName}</p>
                                    {/* Star ratings - assuming 'averageRating' or 'rating' field exists */}

                                </div>

                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                                        ${book.price ? book.price.toFixed(2) : 'N/A'}
                                    </p>
                                    {/* Example for sale price if book.originalPrice exists */}
                                    {book.originalPrice && book.originalPrice > book.price && (
                                        <del className="mt-0.5 text-xs sm:text-sm font-bold text-gray-500">
                                            ${book.originalPrice.toFixed(2)}
                                        </del>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
