import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from './../store/orderSlice';
import { clearCart } from './../store/cartSlice'; 

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

        await new Promise(resolve => setTimeout(resolve, 1500));

        const orderResult = await dispatch(placeOrder({
            orderItems: cartItems.map(item => ({ bookId: item.id, quantity: item.quantity }))
        }));

        setIsLoading(false); 

        if (placeOrder.fulfilled.match(orderResult)) {
            dispatch(clearCart()); 
            navigate('/payment-complete'); 
        } else {
            const errorMsg = orderResult.payload?.message || 'Failed to place order. Please try again.';
            setError(errorMsg);
        }
    };

    if (cartItems.length === 0 && !isLoading) { 
        return <p className="text-center">Your cart is empty. Redirecting...</p>;
    }

    return (
        <section className="bg-white p-4">
            <div className="md:max-w-5xl max-w-xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                className="mt-8 w-full py-3 text-[15px] font-medium bg-gray-600 text-white rounded-md hover:bg-stone-900 tracking-wide cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing Payment...' : `Pay Now (₹${totalAmount.toFixed(2)})`}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-md">
                        <h2 className="text-2xl font-semibold text-slate-900">Order Summary</h2> 
                        <ul className="text-slate-500 font-medium mt-8 space-y-4">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex flex-col gap-1 text-sm pb-2 border-b border-gray-200 last:border-b-0">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-slate-900">{item.title} <span className="text-gray-600 font-normal">x {item.quantity}</span></p>
                                        <span className="ml-auto font-semibold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                                        {item.authorName && (
                                            <div>
                                                <dt className="inline">Author:</dt>
                                                <dd className="inline ml-1">{item.authorName}</dd>
                                            </div>
                                        )}
                                        {item.categoryName && (
                                            <div>
                                                <dt className="inline">Category:</dt>
                                                <dd className="inline ml-1">{item.categoryName}</dd>
                                            </div>
                                        )}
                                        {item.size && (
                                            <div>
                                                <dt className="inline">Size:</dt>
                                                <dd className="inline ml-1">{item.size}</dd>
                                            </div>
                                        )}
                                        {item.color && (
                                            <div>
                                                <dt className="inline">Color:</dt>
                                                <dd className="inline ml-1">{item.color}</dd>
                                            </div>
                                        )}
                                    </dl>
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
