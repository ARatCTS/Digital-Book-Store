import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from './../store/bookSlice';
import BookCard from './BookCard';

export default function BookList() {
  const dispatch = useDispatch();
  const { items: books, status, error } = useSelector((state) => state.books);

  const [sortBy, setSortBy] = useState('');
  const [availability, setAvailability] = useState([]);
  const [priceRange, setPriceRange] = useState({ from: '', to: '' });
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  const handleAvailabilityChange = (e) => {
    const { value, checked } = e.target;
    setAvailability(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleColorChange = (e) => {
    const { value, checked } = e.target;
    setSelectedColors(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const resetFilters = () => {
    setSortBy('');
    setAvailability([]);
    setPriceRange({ from: '', to: '' });
    setSelectedColors([]);
  };

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filtering logic
    if (availability.length > 0) {
      result = result.filter(book => availability.includes(book.availability));
    }
    if (priceRange.from) {
      result = result.filter(book => book.price >= priceRange.from);
    }
    if (priceRange.to) {
      result = result.filter(book => book.price <= priceRange.to);
    }
    if (selectedColors.length > 0) {
      result = result.filter(book => selectedColors.includes(book.color));
    }

    // Sorting logic
    if (sortBy) {
      const [key, order] = sortBy.split(', ');
      result.sort((a, b) => {
        if (a[key] < b[key]) return order === 'ASC' ? -1 : 1;
        if (a[key] > b[key]) return order === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [books, sortBy, availability, priceRange, selectedColors]);

  if (status === 'loading') return <p className="text-center">Loading books...</p>;
  if (status === 'failed') return <p className="text-center text-red-500">Error: {error.message || 'Could not fetch books'}</p>;

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Book Collection</h2>
          <p className="mt-4 max-w-md text-gray-500">
            Explore our curated collection of books. Use the filters to find exactly what you're looking for.
          </p>
        </header>

        <div className="mt-8 block lg:hidden">
          {/* Mobile filter button can be enhanced with a modal */}
          <button className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
            <span className="text-sm font-medium">Filters & Sorting</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 rtl:rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
          <div className="hidden space-y-4 lg:block">
            <div>
              <label htmlFor="SortBy" className="block text-xs font-medium text-gray-700">Sort By</label>
              <select id="SortBy" className="mt-1 w-full rounded-md border-gray-300 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {/* <option value="">------</option> */}
                <option value="title, ASC">Title, ASC</option>
                <option value="title, DESC">Title, DESC</option>
                <option value="price, ASC">Price, ASC</option>
                <option value="price, DESC">Price, DESC</option>
              </select>
            </div>

            <div>
              <p className="block text-xs font-medium text-gray-700">Filters</p>
              <div className="mt-1 space-y-2">


                <details className="overflow-hidden rounded-md border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                        <span className="text-sm font-medium">Price</span>
                        <span className="transition group-open:-rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                        </span>
                    </summary>
                    <div className="border-t border-gray-200 bg-white">
                        <header className="flex items-center justify-between p-4">
                        <span className="text-sm text-gray-700">The highest price is ₹{Math.max(...books.map(b => b.price), 600)}</span>
                        <button type="button" className="text-sm text-gray-900 underline underline-offset-4" onClick={() => setPriceRange({ from: '', to: '' })}>Reset</button>
                        </header>
                        <div className="border-t border-gray-200 p-4">
                        <div className="flex justify-between gap-4">
                            <label htmlFor="FilterPriceFrom" className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">₹</span>
                            <input type="number" id="FilterPriceFrom" placeholder="From" value={priceRange.from} onChange={e => setPriceRange(p => ({ ...p, from: e.target.value }))} className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm" />
                            </label>
                            <label htmlFor="FilterPriceTo" className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">₹</span>
                            <input type="number" id="FilterPriceTo" placeholder="To" value={priceRange.to} onChange={e => setPriceRange(p => ({ ...p, to: e.target.value }))} className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm" />
                            </label>
                        </div>
                        </div>
                    </div>
                </details>

                <button
                    type="button"
                    className="w-full mt-4 rounded-md bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                    onClick={resetFilters}
                >
                    Reset All Filters
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}