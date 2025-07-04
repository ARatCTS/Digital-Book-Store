import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, incrementQuantity, decrementQuantity, clearCart } from './../store/cartSlice'; // Make sure incrementQuantity and decrementQuantity actions are defined in your slice
import { Link } from 'react-router-dom';

export default function CartPage() {
    const dispatch = useDispatch();
    const { items: cartItems } = useSelector(state => state.cart);
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = 0; 
    const totalAmount = (subtotal - discount).toFixed(2); 

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <header className="text-center">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
                    </header>

                    <div className="mt-8">
                        {cartItems.length === 0 ? (
                            <p className="text-center text-gray-600">Your cart is empty.</p>
                        ) : (
                            <>
                                <ul className="space-y-4">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="flex items-center gap-4">
                                            <img
                                                src={item.image || 'https://placehold.co/64x64/b8b8b8/ffffff?text=No+Image'} // Added fallback for image src
                                                alt={item.title}
                                                className="size-16 rounded-sm object-cover"
                                                onError={(e) => { 
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://placehold.co/64x64/b8b8b8/ffffff?text=No+Image';
                                                }}
                                            />

                                            <div>
                                                <h3 className="text-sm text-gray-900">{item.title}</h3>

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
                                                    <div>
                                                        <dt className="inline">Price:</dt>
                                                        <dd className="inline ml-1">₹{item.price.toFixed(2)}</dd>
                                                    </div>
                                                </dl>
                                            </div>

                                            <div className="flex flex-1 items-center justify-end gap-2">
                                                <form className="flex items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => dispatch(decrementQuantity(item.id))}
                                                        className="h-8 w-8 rounded-sm border border-gray-200 bg-gray-50 text-center text-xs text-gray-600 hover:bg-gray-100"
                                                        disabled={item.quantity <= 1} 
                                                    >
                                                        -
                                                    </button>
                                                    <label htmlFor={`qty-${item.id}`} className="sr-only"> Quantity </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        readOnly 
                                                        id={`qty-${item.id}`}
                                                        className="h-8 w-12 rounded-sm border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-hidden [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none mx-1"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => dispatch(incrementQuantity(item.id))}
                                                        className="h-8 w-8 rounded-sm border border-gray-200 bg-gray-50 text-center text-xs text-gray-600 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </form>

                                                <button
                                                    onClick={() => dispatch(removeItemFromCart(item.id))}
                                                    className="text-gray-600 transition hover:text-red-600"
                                                >
                                                    <span className="sr-only">Remove item</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                                    <div className="w-screen max-w-lg space-y-4">
                                        <dl className="space-y-0.5 text-sm text-gray-700">
                                            <div className="flex justify-between">
                                                <dt>Subtotal</dt>
                                                <dd>₹{subtotal.toFixed(2)}</dd>
                                            </div>

                                            {discount > 0 && (
                                                <div className="flex justify-between">
                                                    <dt>Discount</dt>
                                                    <dd>-₹{discount.toFixed(2)}</dd>
                                                </div>
                                            )}

                                            <div className="flex justify-between !text-base font-medium">
                                                <dt>Total</dt>
                                                <dd>₹{totalAmount}</dd>
                                            </div>
                                        </dl>

                                        {discount > 0 && (
                                            <div className="flex justify-end">
                                                <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="-ms-1 me-1.5 size-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                                                        />
                                                    </svg>
                                                    <p className="text-xs whitespace-nowrap">
                                                        Discounts Applied
                                                    </p>
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => dispatch(clearCart())}
                                                className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600 mr-4"
                                            >
                                                Clear Cart
                                            </button>
                                            <Link
                                                to="/checkout"
                                                className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                                            >
                                                Checkout
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
