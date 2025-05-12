import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Attempt login
    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <BookOpen className="h-12 w-12 text-amber-700 mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-amber-900 mt-4">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your Arcadia Reads account</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Enter your password"
              />
              <div className="mt-1 text-right">
                <a href="#" className="text-sm text-amber-700 hover:text-amber-900">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-700 hover:text-amber-900 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        {/* Demo accounts */}
        <div className="mt-8 bg-amber-50 rounded-lg p-4">
          <h3 className="font-medium text-amber-800 mb-2">Demo Accounts</h3>
          <p className="text-sm text-gray-600 mb-2">For testing purposes, you can use these accounts:</p>
          <div className="text-sm">
            <p>Customer: john@example.com / password123</p>
            <p>Admin: admin@arcadiareads.com / admin123</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;