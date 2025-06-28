import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from './../store/orderSlice';
import { clearCart } from './../store/cartSlice'; // Make sure clearCart is imported

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // No need for selectedPaymentMethod state as we're removing card options

    const { items: cartItems } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (cartItems.length === 0 && !isLoading) {
            navigate('/books');
        }
    }, [cartItems, isAuthenticated, navigate, isLoading]);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);

        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockSuccess = true; // Always simulate success for this flow

        setIsLoading(false);

        if (mockSuccess) {
            // Dispatch the actual order placement
            const orderResult = await dispatch(placeOrder({
                orderItems: cartItems.map(item => ({ bookId: item.id, quantity: item.quantity }))
            }));

            if (placeOrder.fulfilled.match(orderResult)) {
                dispatch(clearCart()); // Clear cart after successful order
                navigate('/payment-complete'); // Redirect to the new celebration page
            } else {
                const errorMsg = orderResult.payload?.message || 'Failed to place order. Please try again.';
                setError(errorMsg);
            }
        } else {
            // This part might not be hit if mockSuccess is always true, but good for robust error handling
            setError('Payment failed. Please try again.');
        }
    };

    if (cartItems.length === 0) {
        return <p className="text-center">Your cart is empty. Redirecting...</p>;
    }

    return (
        <section className="bg-white p-4">
            <div className="md:max-w-5xl max-w-xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Left Section: Payment Action */}
                    <div className="lg:col-span-2 max-md:order-1">
                        <h2 className="text-3xl font-semibold text-slate-900">Make a payment</h2>
                        <p className="text-slate-500 text-sm mt-4">Complete your transaction swiftly and securely with our easy-to-use payment process.</p>
                        <div className="mt-8 max-w-lg">
                            <h3 className="text-lg font-semibold text-slate-900">Confirm & Pay</h3>
                            <p className="text-slate-700 mt-6 mb-6">By clicking "Pay Now", you confirm your order and agree to complete the payment for ₹{totalAmount.toFixed(2)}.</p>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                    <strong className="font-bold">Error: </strong>
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                className="mt-8 w-full py-3 text-[15px] font-medium bg-purple-500 text-white rounded-md hover:bg-purple-600 tracking-wide cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing Payment...' : `Pay Now (₹${totalAmount.toFixed(2)})`}
                            </button>
                        </div>
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="bg-gray-100 p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-slate-900">₹{totalAmount.toFixed(2)}</h2>
                        <ul className="text-slate-500 font-medium mt-8 space-y-4">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex flex-wrap gap-4 text-sm">
                                    {item.title} x {item.quantity} <span className="ml-auto font-semibold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                            <li className="flex flex-wrap gap-4 text-[15px] font-semibold text-slate-900 border-t border-gray-300 pt-4">
                                Total <span className="ml-auto">₹{totalAmount.toFixed(2)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}