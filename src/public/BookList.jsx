import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from './../store/bookSlice';
import BookCard from './BookCard';

export default function BookList() {
  const dispatch = useDispatch();
  const { items: books, status, error } = useSelector((state) => state.books);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p className="text-center">Loading books...</p>;
  if (status === 'failed') return <p className="text-center text-red-500">Error fetching books.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}