import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import HomePage from './pages/HomePage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SellBookPage from './pages/SellBookPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/books/used" element={<BookListPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/sell" element={<SellBookPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;