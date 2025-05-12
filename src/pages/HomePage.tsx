import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookText, ShoppingBag, BookMarked } from 'lucide-react';
import Layout from '../components/layout/Layout';
import BookCard from '../components/books/BookCard';
import { books } from '../data/mockData';

const HomePage: React.FC = () => {
  // Get featured books (first 4)
  const featuredBooks = books.slice(0, 4);
  
  // Get used books
  const usedBooks = books.filter(book => book.condition !== 'New' && book.status === 'approved').slice(0, 4);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-amber-800/90 to-amber-700/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Welcome to Arcadia Reads
            </h1>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              New and used books curated for the true book lover. Browse our extensive collection and find your next favorite read.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/books" 
                className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-300 font-medium"
              >
                Browse All Books
              </Link>
              <Link 
                to="/books/used" 
                className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-colors duration-300 font-medium"
              >
                Shop Used Books
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-amber-900 text-center mb-12">Why Shop at Arcadia Reads</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-7 w-7 text-amber-800" />
              </div>
              <h3 className="text-xl font-medium text-amber-800 mb-2">Extensive Collection</h3>
              <p className="text-gray-600">Browse thousands of titles across multiple genres to find your perfect read.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookText className="h-7 w-7 text-amber-800" />
              </div>
              <h3 className="text-xl font-medium text-amber-800 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All used books undergo a quality inspection before being listed.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-7 w-7 text-amber-800" />
              </div>
              <h3 className="text-xl font-medium text-amber-800 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Get your books quickly with our efficient shipping and handling process.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
              <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookMarked className="h-7 w-7 text-amber-800" />
              </div>
              <h3 className="text-xl font-medium text-amber-800 mb-2">Sell Your Books</h3>
              <p className="text-gray-600">Turn your read books into cash by selling them through our marketplace.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Books Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Featured Books</h2>
            <Link to="/books" className="text-amber-700 hover:text-amber-900 font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Used Books Section */}
      <section className="py-12 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Used Books</h2>
            <Link to="/books/used" className="text-amber-700 hover:text-amber-900 font-medium">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Have books you've already read?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Turn your old books into cash or store credit. Our used book marketplace makes it easy to sell your books.
          </p>
          <Link 
            to="/sell" 
            className="px-6 py-3 bg-white text-amber-900 rounded-md hover:bg-amber-100 transition-colors duration-300 font-medium"
          >
            Sell Your Books
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;