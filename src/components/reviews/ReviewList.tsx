import React from 'react';
import { Review } from '../../types';
import { Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewListProps {
  reviews: Review[];
  bookId: string;
  onAddReview: (rating: number, text: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, bookId, onAddReview }) => {
  const { currentUser } = useAuth();
  const [newReview, setNewReview] = React.useState({ rating: 5, text: '' });
  const [isAddingReview, setIsAddingReview] = React.useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(newReview.rating, newReview.text);
    setNewReview({ rating: 5, text: '' });
    setIsAddingReview(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const approvedReviews = reviews.filter(review => review.status === 'approved');

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif font-semibold text-amber-900">Customer Reviews</h2>
        {currentUser && !isAddingReview && (
          <button
            onClick={() => setIsAddingReview(true)}
            className="px-3 py-1 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors duration-300"
          >
            Write a Review
          </button>
        )}
      </div>
      
      {isAddingReview && (
        <form onSubmit={handleSubmitReview} className="mb-6 bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium text-amber-800 mb-3">Your Review</h3>
          
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${star <= newReview.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="review-text" className="block text-gray-700 mb-1">Your Review</label>
            <textarea
              id="review-text"
              rows={4}
              required
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="Share your thoughts about this book..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingReview(false)}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors duration-300"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
      
      {approvedReviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet. Be the first to review this book!</p>
      ) : (
        <div className="space-y-4">
          {approvedReviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <h4 className="font-medium text-amber-800">{review.userName}</h4>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="mt-2 text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;