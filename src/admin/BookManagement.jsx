import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, deleteBook } from './../store/bookSlice';
import BookForm from './BookForm';

// Define items per page
const ITEMS_PER_PAGE = 10; // You can adjust this value as needed

export default function BookManagement() {
    const dispatch = useDispatch();
    const { items: books, status, error } = useSelector((state) => state.books); // Destructure error
    
    // UI state for modal and editing
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Fetch books only if the status is 'idle' to prevent multiple fetches
        if (status === 'idle') {
            dispatch(fetchBooks());
        }
        // Reset to page 1 if the books data changes (e.g., after add/edit/delete)
        setCurrentPage(1);
    }, [dispatch, status, books.length]); // Add books.length to dependencies

    const handleEdit = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingBook(null); // Clear any previous editing state
        setIsModalOpen(true);
    };

    const handleDelete = (bookId) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this book?");
        if (confirmDelete) {
            dispatch(deleteBook(bookId));
        }
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBooks = books.slice(startIndex, endIndex); // Books for the current page

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Loading and Error States ---
    if (status === 'loading') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p>Loading books...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center text-red-600">
                <p>Error loading books: {error?.message || 'Please try again later.'}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Book Management</h1>
                <button onClick={handleAddNew} className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">Add New Book</button>
            </div>
            
            {isModalOpen && <BookForm book={editingBook} closeModal={() => setIsModalOpen(false)} />}
            
            <div className="overflow-x-auto">
                {currentBooks.length === 0 && status === 'succeeded' ? (
                    <p className="text-center py-4">No books to display.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentBooks.map((book) => ( // Map over 'currentBooks'
                                <tr key={book.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.title || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{book.authorName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleEdit(book)} 
                                            className="text-blue-600 hover:text-blue-900 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(book.id)} 
                                            className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            {books.length > ITEMS_PER_PAGE && ( // Only show pagination if more than ITEMS_PER_PAGE books
                <div className="flex justify-center mt-8 space-x-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index + 1)}
                            className={`px-4 py-2 border rounded-md ${
                                currentPage === index + 1 ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded-md text-gray-700 bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}