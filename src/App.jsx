import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './common/Navbar';
import Footer from './common/Footer';
import ProtectedRoute from './common/ProtectedRoute';
import HomePage from './common/HomePage';
import LoginPage from './common/LoginPage';
import RegisterPage from './common/RegisterPage';
import BookList from './public/BookList';
import ProductDetailPage from './public/ProductDetailPage';
import CartPage from './cart/CartPage';
import CheckoutPage from './cart/CheckOutPage';
import ProfilePage from './profile/ProfilePage';
import OrderHistoryPage from './profile/OrderHistoryPage';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashBoard';
import BookManagement from './admin/BookManagement';
import OrderManagement from './admin/OrderManagement';
import ReviewManagement from './admin/ReviewManagement';
import PaymentCompletePage from './cart/PaymentCompletePage';
import ErrorPage from './common/ErrorPage';
import About from './common/About';
import ContactUs from './common/ContactUs';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <NavBar />
        <main className="flex-grow container mx-auto p-6">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/book/:bookId" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contactUs" element={<ContactUs/>}/>
            <Route path="/about" element={<About/>}/>

            {/* --- Customer Protected Routes --- */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage/></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>} />
            <Route path="/payment-complete" element={<ProtectedRoute><PaymentCompletePage /></ProtectedRoute>} />
            
            {/* --- Admin Protected Routes --- */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="books" element={<BookManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="reviews" element={<ReviewManagement />} />
            </Route>

            
            <Route path="*" element={<ErrorPage/>} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;