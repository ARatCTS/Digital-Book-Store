import React, { useState, useEffect } from 'react'; // NEW: Imported useState and useEffect
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from './../store/orderSlice';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // NEW: Local state for loading and error feedback
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { items: cartItems } = useSelector(state => state.cart);
    const { user, isAuthenticated } = useSelector(state => state.auth); // NEW: Get isAuthenticated status

    // NEW: Redirect user if cart is empty or if they are not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not logged in
        } else if (cartItems.length === 0 && !isLoading) {
            // Don't redirect while an order is being placed (as cart gets cleared)
            navigate('/books'); // Redirect to shopping page if cart is empty
        }
    }, [cartItems, isAuthenticated, navigate, isLoading]);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);

        const orderData = {
            orderItems: cartItems.map(item => ({ bookId: item.id, quantity: item.quantity }))
        };

        const result = await dispatch(placeOrder(orderData));

        setIsLoading(false);

        if (placeOrder.fulfilled.match(result)) {
            // On success, the cart will be cleared by the thunk, triggering the useEffect to navigate away.
            // A dedicated confirmation page would be even better.
            navigate('/orders');
        } else {
            // NEW: Handle the error case
            const errorMsg = result.payload?.message || 'An unexpected error occurred. Please try again.';
            setError(errorMsg);
        }
    };
    
    // NEW: Don't render anything if the cart is empty (while waiting for redirect)
    if (cartItems.length === 0) {
        return <p className="text-center">Your cart is empty. Redirecting...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.title} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                        <p className="text-gray-600 mb-4">This is a simulated payment gateway. Clicking 'Pay Now' will place your order directly.</p>
                    </div>
                    <div>
                        {/* NEW: Display error message if one exists */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {/* NEW: Disable button and change text during loading */}
                        <button 
                            onClick={handlePlaceOrder} 
                            className="w-full px-6 py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Placing Order...' : `Pay Now & Place Order ($${totalAmount.toFixed(2)})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}