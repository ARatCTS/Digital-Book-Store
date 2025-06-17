import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './common/Navbar';
import Footer from './common/Footer';
import ProtectedRoute from './common/ProtectedRoute';
import HomePage from './common/HomePage';
import LoginPage from './common/LoginPage';
import RegisterPage from './common/RegisterPage';
import BookList from './public/BookList';
import BookManagement from './admin/BookManagement';
import AdminDashboard from './admin/AdminDashBoard';
import OrderManagement from './admin/OrderManagement';
import ReviewManagement from './admin/ReviewManagement';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/books"
              element={
                <ProtectedRoute adminOnly={true}>
                  <BookManagement />
                </ProtectedRoute>
              }
            />
            
            {/* Customer Protected Routes would be added here */}
            <Route 
            path='/admin/dashboard'
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard/>
              </ProtectedRoute>
            }
            />
            <Route 
            path='/admin/orders'
            element={
              <ProtectedRoute adminOnly={true}>
                <OrderManagement/>
              </ProtectedRoute>
            }
            />
            <Route 
            path='/admin/reviews'
            element={
              <ProtectedRoute adminOnly={true}>
                <ReviewManagement/>
              </ProtectedRoute>
            }
            />
          </Routes>
          
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
