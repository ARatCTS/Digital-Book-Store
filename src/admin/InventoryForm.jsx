import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStock } from './../store/inventorySlice';

export default function InventoryForm({ item, closeModal }) {
  const [quantityChange, setQuantityChange] = useState(0);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantityChange !== 0) {
      dispatch(updateStock({ bookId: item.bookId, quantityChange }));
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2">Update Stock</h2>
        <p className="text-gray-600 mb-4"><strong>Book:</strong> {item.title}</p>
        <p className="text-gray-600 mb-4"><strong>Current Stock:</strong> {item.quantity}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantityChange" className="text-sm font-medium">Quantity to Add/Remove</label>
            <input
              id="quantityChange"
              type="number"
              value={quantityChange}
              onChange={(e) => setQuantityChange(parseInt(e.target.value, 10) || 0)}
              className="w-full p-2 border rounded mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Use a negative number to decrease stock.</p>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}