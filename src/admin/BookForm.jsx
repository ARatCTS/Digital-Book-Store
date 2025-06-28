import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBook, updateBook} from './../store/bookSlice';

export default function BookForm({ book, closeModal }) {
  const [formData, setFormData] = useState({
    title: '', authorName: '', categoryName: '', price: '', stockQuantity: '', image: ''
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        authorName: book.authorName || '',
        categoryName: book.categoryName || '',
        price: book.price || '',
        stockQuantity: book.stockQuantity || '',
        image: book.image || '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (book) {
      dispatch(updateBook({ id: book.id, bookData: formData }));
    } else {
      dispatch(addBook(formData));
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"> {/* Added z-50 here */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{book ? 'Edit Book' : 'Add New Book'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded"/>
          <input name="authorName" placeholder="Author Name" value={formData.authorName} onChange={handleChange} className="w-full p-2 border rounded"/>
          <input name="categoryName" placeholder="Category Name" value={formData.categoryName} onChange={handleChange} className="w-full p-2 border rounded"/>
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded"/>
          <input name="stockQuantity" type="number" placeholder="Stock" value={formData.stockQuantity} onChange={handleChange} className="w-full p-2 border rounded"/>
          <input name="image" type="text" placeholder="image URL" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded"/>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}