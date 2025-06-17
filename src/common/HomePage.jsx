import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center">
    <div className="text-blue-500 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center bg-white p-12 rounded-xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to Your Digital Bookstore
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Discover your next favorite book from our vast collection of titles across all genres.
        </p>
        <Link 
          to="/books" 
          className="inline-block px-8 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse All Books
        </Link>
      </div>

      {/* Features Section */}
      <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="Vast Collection" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>}>
                Explore thousands of books from bestsellers to hidden gems.
            </FeatureCard>
            <FeatureCard title="Secure Payments" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}>
                Your transactions are safe with our encrypted payment gateway.
            </FeatureCard>
            <FeatureCard title="Fast Delivery" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8z" /></svg>}>
                Get your books delivered to your doorstep in no time.
            </FeatureCard>
          </div>
      </div>
    </div>
  );
}