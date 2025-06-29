import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from './../store/bookSlice';
import BookCard from './BookCard';

export default function BookList() {
  const dispatch = useDispatch();
  const { items: books, status, error } = useSelector((state) => state.books);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  const resetFilters = () => {
    setSortBy('');
    setPriceRange({ from: '', to: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchTerm) {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange.from) {
      result = result.filter((book) => book.price >= parseFloat(priceRange.from));
    }

    if (priceRange.to) {
      result = result.filter((book) => book.price <= parseFloat(priceRange.to));
    }

    if (sortBy) {
      const [key, order] = sortBy.split(', ');
      result.sort((a, b) => {
        if (a[key] < b[key]) return order === 'ASC' ? -1 : 1;
        if (a[key] > b[key]) return order === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [books, searchTerm, priceRange, sortBy]);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(start, start + booksPerPage);
  }, [filteredBooks, currentPage]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  if (status === 'loading') return <p className="text-center">Loading books...</p>;
  if (status === 'failed') return <p className="text-center text-red-500">Error: {error.message || 'Could not fetch books'}</p>;

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Book Collection</h2>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 w-full max-w-md p-2 border rounded-md"
        />
      </header>

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Sort By</option>
          <option value="title, ASC">Title ASC</option>
          <option value="title, DESC">Title DESC</option>
          <option value="price, ASC">Price ASC</option>
          <option value="price, DESC">Price DESC</option>
        </select>

        <input
          type="number"
          placeholder="Price from"
          value={priceRange.from}
          onChange={(e) => setPriceRange((p) => ({ ...p, from: e.target.value }))}
          className="p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Price to"
          value={priceRange.to}
          onChange={(e) => setPriceRange((p) => ({ ...p, to: e.target.value }))}
          className="p-2 border rounded-md"
        />

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Reset Filters
        </button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </ul>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
