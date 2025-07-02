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
  const [selectedAuthor, setSelectedAuthor] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, priceRange, selectedAuthor, selectedCategory]); 


  const resetFilters = () => {
    setSortBy('');
    setPriceRange({ from: '', to: '' });
    setSearchTerm('');
    setSelectedAuthor(''); 
    setSelectedCategory(''); 
    
  };
  const uniqueAuthors = useMemo(() => {
    const authorsSet = new Set();
    books.forEach(book => {
      if (book.authorName) {
        authorsSet.add(book.authorName);
      }
    });
    return [...authorsSet].sort();
  }, [books]); 

  
  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set();
    books.forEach(book => {
    
      if (book.categoryName) {
        categoriesSet.add(book.categoryName);
      }
    });
    return [...categoriesSet].sort();
  }, [books]); 

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchTerm) {
      result = result.filter((book) =>
        (book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.authorName && book.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (priceRange.from !== '') {
      result = result.filter((book) => book.price >= parseFloat(priceRange.from));
    }

    if (priceRange.to !== '') {
      result = result.filter((book) => book.price <= parseFloat(priceRange.to));
    }

    
    if (selectedAuthor) {
      result = result.filter((book) => book.authorName && book.authorName === selectedAuthor);
    }

    
    if (selectedCategory) {
      result = result.filter((book) => book.categoryName && book.categoryName === selectedCategory);
    }

    if (sortBy) {
      const [key, order] = sortBy.split(',');
      const actualKey = key.trim();

      result.sort((a, b) => {
        const valA = a[actualKey];
        const valB = b[actualKey];

        const safeValA = valA === undefined || valA === null ? (order === 'ASC' ? '' : 'zzzzz') : valA;
        const safeValB = valB === undefined || valB === null ? (order === 'ASC' ? '' : 'zzzzz') : valB;

        if (typeof safeValA === 'string' && typeof safeValB === 'string') {
          return order === 'ASC' ? safeValA.localeCompare(safeValB) : safeValB.localeCompare(safeValA);
        }
        return order === 'ASC' ? safeValA - safeValB : safeValB - safeValA;
      });
    }

    return result;
  }, [books, searchTerm, priceRange, selectedAuthor, selectedCategory, sortBy]); 

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    return filteredBooks.slice(start, end);
  }, [filteredBooks, currentPage, booksPerPage]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  if (status === 'loading') return <p className="text-center">Loading books...</p>;
  if (status === 'failed') return <p className="text-center text-red-500">Error: {error?.message || 'Could not fetch books'}</p>;

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Book Collection</h2>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 w-full max-w-md p-2 border rounded-md"
        />
      </header>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Sort By</option>
          <option value="title,ASC">Title (A-Z)</option>
          <option value="title,DESC">Title (Z-A)</option>
          <option value="price,ASC">Price (Low to High)</option>
          <option value="price,DESC">Price (High to Low)</option>
        </select>

        {/* Price Range */}
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

        {/* Author Filter */}
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Authors</option>
          {uniqueAuthors.map((authorName) => (
            <option key={authorName} value={authorName}>
              {authorName}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((categoryName) => (
            <option key={categoryName} value={categoryName}>
              {categoryName}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Reset Filters
        </button>
      </div>

      {paginatedBooks.length === 0 && filteredBooks.length > 0 && (
          <p className="text-center text-gray-600">No books found on this page with current filters. Try adjusting page number.</p>
      )}
      {filteredBooks.length === 0 && (searchTerm || priceRange.from || priceRange.to || selectedAuthor || selectedCategory) && (
          <p className="text-center text-gray-600">No books match your current search or filters.</p>
      )}
      {status === 'succeeded' && books.length === 0 && !searchTerm && !priceRange.from && !priceRange.to && !selectedAuthor && !selectedCategory && (
        <p className="text-center text-gray-600">No books available in the collection.</p>
      )}


      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </ul>

      {totalPages > 1 && (
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
      )}
    </section>
  );
}
