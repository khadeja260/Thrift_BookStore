import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  const getConditionBadge = () => {
    if (!book.condition || book.condition === 'New') return null;
    
    const colors: Record<string, string> = {
      'Like New': 'bg-green-500',
      'Good': 'bg-yellow-500',
      'Acceptable': 'bg-orange-500'
    };
    
    return (
      <span className={`absolute top-2 right-2 ${colors[book.condition]} text-white text-xs px-2 py-1 rounded-full`}>
        {book.condition}
      </span>
    );
  };

  return (
    <Link to={`/books/${book.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 h-full flex flex-col">
        {/* Book Image */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={book.imageUrl} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {getConditionBadge()}
        </div>
        
        {/* Book Details */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-serif font-semibold text-amber-900 mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4" />
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-amber-800">৳{book.price.toFixed(2)}</span>
              <button
                onClick={handleAddToCart}
                className="bg-amber-700 text-white p-2 rounded-full hover:bg-amber-800 transition-colors duration-300"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;