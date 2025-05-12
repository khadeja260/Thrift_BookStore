import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-amber-900 to-amber-800 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-amber-100" />
              <span className="ml-2 text-xl font-serif font-bold text-amber-100">Arcadia Reads</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-amber-100 hover:text-white transition duration-300">
              Home
            </Link>
            <Link to="/books" className="px-3 py-2 text-amber-100 hover:text-white transition duration-300">
              All Books
            </Link>
            <Link to="/books/used" className="px-3 py-2 text-amber-100 hover:text-white transition duration-300">
              Used Books
            </Link>
            
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center px-3 py-2 text-amber-100 hover:text-white transition duration-300">
                  <span className="mr-1">{currentUser.name}</span>
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">
                    My Dashboard
                  </Link>
                  <Link to="/sell" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-100">
                    Sell Books
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-3 py-2 text-amber-100 hover:text-white transition duration-300">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition duration-300">
                  Register
                </Link>
              </div>
            )}
            
            <Link to="/cart" className="relative px-3 py-2 text-amber-100 hover:text-white transition duration-300">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-4 text-amber-100 hover:text-white transition duration-300">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-amber-100 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/books" 
              className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Books
            </Link>
            <Link 
              to="/books/used" 
              className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Used Books
            </Link>
            
            {currentUser ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <Link 
                  to="/sell" 
                  className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sell Books
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-amber-100 hover:text-white transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 text-amber-100 hover:text-white transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;