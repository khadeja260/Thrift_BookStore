import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BookCard from '../components/books/BookCard';
import BookFilter from '../components/books/BookFilter';
import { Book } from '../types';
import { books } from '../data/mockData';

const BookListPage: React.FC = () => {
  const location = useLocation();
  const isUsedBooksPage = location.pathname === '/books/used';

  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Get unique categories
    const uniqueCategories = Array.from(new Set(books.map(book => book.category)));
    setCategories(uniqueCategories);
    
    // Initial filtering based on page type
    if (isUsedBooksPage) {
      setFilteredBooks(books.filter(book => 
        book.condition !== 'New' && book.status === 'approved'
      ));
    } else {
      setFilteredBooks(books);
    }
  }, [isUsedBooksPage]);

  const handleFilter = (filters: any) => {
    let result = isUsedBooksPage 
      ? books.filter(book => book.condition !== 'New' && book.status === 'approved')
      : [...books];
    
    // Apply condition filter if not empty
    if (filters.condition.length > 0) {
      result = result.filter(book => 
        filters.condition.includes(book.condition ?? 'New')
      );
    }
    
    // Apply category filter if not empty
    if (filters.category.length > 0) {
      result = result.filter(book => 
        filters.category.includes(book.category)
      );
    }
    
    // Apply price filter
    result = result.filter(book => 
      book.price >= filters.minPrice && book.price <= filters.maxPrice
    );
    
    setFilteredBooks(result);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">
            {isUsedBooksPage ? 'Used Books' : 'All Books'}
          </h1>
          <p className="text-gray-600">
            {isUsedBooksPage 
              ? 'Browse our collection of pre-loved books in various conditions, all carefully inspected for quality.' 
              : 'Explore our extensive collection of new and used books across various genres.'}
          </p>
        </div>
        
        {/* Filter */}
        <BookFilter 
          categories={categories}
          onFilter={handleFilter}
          showCondition={!isUsedBooksPage}
        />
        
        {/* Results */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">No books found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookListPage;