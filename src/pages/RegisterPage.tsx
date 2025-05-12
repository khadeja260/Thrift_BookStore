import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Attempt registration
    const success = register(name, email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Email already in use');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <BookOpen className="h-12 w-12 text-amber-700 mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-amber-900 mt-4">Create an Account</h1>
          <p className="text-gray-600 mt-2">Join the Arcadia Reads community</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Enter your full name"
              />
            </div>
            
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
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Create a password"
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Confirm your password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
            >
              Create Account
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-700 hover:text-amber-900 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;