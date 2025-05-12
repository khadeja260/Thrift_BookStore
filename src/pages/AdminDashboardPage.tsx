import React, { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Users, Star } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { books, reviews, orders, users } from '../data/mockData';
import { Book, Review, Order } from '../types';

const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [pendingBooks, setPendingBooks] = useState<Book[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // Filter books that need approval
    const filteredBooks = books.filter(book => book.status === 'pending');
    setPendingBooks(filteredBooks);
    
    // Filter reviews that need approval
    const filteredReviews = reviews.filter(review => review.status === 'pending');
    setPendingReviews(filteredReviews);
    
    // Get all orders
    setAllOrders([...orders].sort((a, b) => {
      // Sort by date, most recent first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }));
  }, []);

  const handleApproveBook = (id: string) => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      books[bookIndex].status = 'approved';
      setPendingBooks(pendingBooks.filter(book => book.id !== id));
    }
  };

  const handleRejectBook = (id: string) => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
      books[bookIndex].status = 'rejected';
      setPendingBooks(pendingBooks.filter(book => book.id !== id));
    }
  };

  const handleApproveReview = (id: string) => {
    const reviewIndex = reviews.findIndex(review => review.id === id);
    if (reviewIndex !== -1) {
      reviews[reviewIndex].status = 'approved';
      setPendingReviews(pendingReviews.filter(review => review.id !== id));
    }
  };

  const handleRejectReview = (id: string) => {
    const reviewIndex = reviews.findIndex(review => review.id === id);
    if (reviewIndex !== -1) {
      reviews[reviewIndex].status = 'rejected';
      setPendingReviews(pendingReviews.filter(review => review.id !== id));
    }
  };

  const handleUpdateOrderStatus = (id: string, status: string) => {
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status as any;
      
      // Update the state
      setAllOrders([...orders].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }));
    }
  };

  if (!currentUser || !isAdmin) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">You don't have access to this page</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif font-bold text-amber-900 mb-6">Admin Dashboard</h1>
        
        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-amber-700">
            <div className="flex items-center">
              <BookOpen className="h-10 w-10 text-amber-700" />
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Books</p>
                <p className="text-2xl font-semibold text-gray-800">{books.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <ShoppingBag className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-800">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-semibold text-gray-800">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center">
              <Star className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Reviews</p>
                <p className="text-2xl font-semibold text-gray-800">{reviews.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'books' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('books')}
              >
                <BookOpen className="h-5 w-5 inline-block mr-2" />
                Pending Books
                {pendingBooks.length > 0 && (
                  <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    {pendingBooks.length}
                  </span>
                )}
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'reviews' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                <Star className="h-5 w-5 inline-block mr-2" />
                Pending Reviews
                {pendingReviews.length > 0 && (
                  <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    {pendingReviews.length}
                  </span>
                )}
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'orders' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag className="h-5 w-5 inline-block mr-2" />
                Manage Orders
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'users' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <Users className="h-5 w-5 inline-block mr-2" />
                Users
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Pending Books Tab */}
            {activeTab === 'books' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">Pending Book Approvals</h2>
                
                {pendingBooks.length === 0 ? (
                  <p className="text-gray-500">No pending books to approve.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seller
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingBooks.map(book => {
                          const seller = users.find(user => user.id === book.sellerId);
                          
                          return (
                            <tr key={book.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 mr-3">
                                    <img 
                                      src={book.imageUrl} 
                                      alt={book.title} 
                                      className="h-10 w-10 rounded-md object-cover" 
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                    <div className="text-sm text-gray-500">{book.author}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{seller?.name}</div>
                                <div className="text-sm text-gray-500">{seller?.email}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">${book.price.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">Condition: {book.condition}</div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">{book.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleApproveBook(book.id)}
                                    className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-300"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectBook(book.id)}
                                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-300"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Pending Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">Pending Review Approvals</h2>
                
                {pendingReviews.length === 0 ? (
                  <p className="text-gray-500">No pending reviews to approve.</p>
                ) : (
                  <div className="space-y-4">
                    {pendingReviews.map(review => {
                      const book = books.find(b => b.id === review.bookId);
                      const reviewer = users.find(u => u.id === review.userId);
                      
                      return (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center mb-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <p className="font-medium text-gray-900">
                                Review for <span className="text-amber-700">{book?.title}</span> by {reviewer?.name}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveReview(review.id)}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-300"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectReview(review.id)}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-300"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                          
                          <p className="mt-2 text-gray-700">{review.text}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">Manage Orders</h2>
                
                {allOrders.length === 0 ? (
                  <p className="text-gray-500">No orders available.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allOrders.map(order => {
                          const customer = users.find(u => u.id === order.userId);
                          
                          return (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer?.name}</div>
                                <div className="text-sm text-gray-500">{customer?.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.date}</div>
                                <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${order.totalAmount.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">{order.items.length} items</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">Manage Users</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Books Sold
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => {
                        const userBooks = books.filter(b => b.sellerId === user.id && b.status === 'approved');
                        const userOrders = orders.filter(o => o.userId === user.id);
                        
                        return (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{userBooks.length} books</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{userOrders.length} orders</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;