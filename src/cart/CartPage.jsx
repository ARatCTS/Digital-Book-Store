import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, clearCart } from './../store/cartSlice';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const dispatch = useDispatch();
    const { items: cartItems } = useSelector(state => state.cart);
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-semibold mr-4">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button onClick={() => dispatch(removeItemFromCart(item.id))} className="text-red-500 hover:text-red-700">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Total: ${totalAmount}</h2>
                        <div>
                            <button onClick={() => dispatch(clearCart())} className="text-gray-500 mr-4">Clear Cart</button>
                            <Link to="/checkout" className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">Proceed to Checkout</Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}