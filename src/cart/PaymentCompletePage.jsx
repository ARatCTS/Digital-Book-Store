import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCompletePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/books');
        }, 3000); 

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                <div className="text-green-500 mb-6">
                    <svg
                        className="w-20 h-20 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
                <p className="text-lg text-gray-600 mb-6">Your order has been placed and confirmed.</p>
                <p className="text-sm text-gray-500">
                    You will be redirected to the books page shortly.
                </p>
                <button
                    onClick={() => navigate('/books')}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}