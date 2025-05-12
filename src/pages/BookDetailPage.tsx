import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ReviewList from '../components/reviews/ReviewList';
import { Book, Review } from '../types';
import { books, reviews } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [bookReviews, setBookReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    const foundBook = books.find(b => b.id === id);
    if (foundBook) {
      setBook(foundBook);
      
      // Get book reviews
      const foundReviews = reviews.filter(r => r.bookId === id);
      setBookReviews(foundReviews);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book, quantity);
    }
  };

  const handleAddReview = (rating: number, text: string) => {
    if (!currentUser || !book) return;
    
    const newReview: Review = {
      id: (reviews.length + 1).toString(),
      userId: currentUser.id,
      bookId: book.id,
      userName: currentUser.name,
      rating,
      text,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    // Add to mock data
    reviews.push(newReview);
    setBookReviews([...bookReviews, newReview]);
  };

  if (!book) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Book not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex text-sm text-gray-500">
            <li className="flex items-center">
              <Link to="/" className="hover:text-amber-700">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/books" className="hover:text-amber-700">Books</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-amber-700 font-medium truncate">{book.title}</li>
          </ol>
        </nav>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Book Image */}
            <div className="md:w-1/3 p-6">
              <div className="relative h-80 md:h-full w-full overflow-hidden rounded-md shadow-md">
                <img 
                  src={book.imageUrl} 
                  alt={book.title} 
                  className="h-full w-full object-cover"
                />
                {book.condition && book.condition !== 'New' && (
                  <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                    {book.condition}
                  </span>
                )}
              </div>
            </div>
            
            {/* Book Details */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-serif font-bold text-amber-900 mb-2">{book.title}</h1>
              <p className="text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5" />
                </div>
                <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                <span className="text-sm text-gray-500 ml-2">
                  {bookReviews.filter(r => r.status === 'approved').length} reviews
                </span>
              </div>
              
              <div className="mb-6">
                <span className="text-2xl font-bold text-amber-800">৳{book.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              <p className="text-gray-700 mb-6">{book.description}</p>
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-amber-100 rounded-md">
                    Category: {book.category}
                  </span>
                  {book.year && (
                    <span className="px-2 py-1 bg-amber-100 rounded-md">
                      Year: {book.year}
                    </span>
                  )}
                  {book.condition && (
                    <span className="px-2 py-1 bg-amber-100 rounded-md">
                      Condition: {book.condition}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {book.stock > 0 ? (
                  <>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={book.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(book.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-12 text-center py-1 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                        className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      className="px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300 flex items-center"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <span className="px-6 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed">
                    Out of Stock
                  </span>
                )}
                
                <button className="px-4 py-2 border border-amber-700 text-amber-700 rounded-md hover:bg-amber-50 transition-colors duration-300 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist
                </button>
                
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300 flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewList 
            reviews={bookReviews}
            bookId={book.id}
            onAddReview={handleAddReview}
          />
        </div>
        
        {/* Related Books Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-semibold text-amber-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books
              .filter(b => b.id !== book.id && b.category === book.category)
              .slice(0, 4)
              .map(relatedBook => (
                <Link to={`/books/${relatedBook.id}`} key={relatedBook.id} className="group">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedBook.imageUrl} 
                        alt={relatedBook.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-amber-900 line-clamp-1">{relatedBook.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-1">by {relatedBook.author}</p>
                      <p className="mt-2 font-bold text-amber-800">৳{relatedBook.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetailPage;