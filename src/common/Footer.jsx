import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white mt-16 border-t">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600">&copy; 2025 BookStore. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/about" className="text-gray-600 hover:text-blue-500">About Us</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link>
                        <Link to="/privacy" className="text-gray-600 hover:text-blue-500">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}