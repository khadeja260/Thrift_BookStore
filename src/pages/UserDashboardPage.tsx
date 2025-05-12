import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Package, BookOpen, Settings } from 'lucide-react';
import Layout from '../components/layout/Layout';
import OrderItem from '../components/dashboard/OrderItem';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { books } from '../data/mockData';
import { Book } from '../types';

const UserDashboardPage: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { orders } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Profile form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  useEffect(() => {
    if (location.state?.checkoutSuccess) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  }, [location]);
  
  useEffect(() => {
    if (currentUser) {
      // Get user's books
      const filteredBooks = books.filter(book => 
        book.sellerId === currentUser.id
      );
      setUserBooks(filteredBooks);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Please login to view your dashboard</p>
        </div>
      </Layout>
    );
  }

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-medium">Order placed successfully!</p>
            <p>Your order has been received and is being processed.</p>
          </div>
        )}
        
        <h1 className="text-3xl font-serif font-bold text-amber-900 mb-6">My Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap -mb-px">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'profile' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User className="h-5 w-5 inline-block mr-2" />
                Profile
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'orders' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <Package className="h-5 w-5 inline-block mr-2" />
                My Orders
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'books' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('books')}
              >
                <BookOpen className="h-5 w-5 inline-block mr-2" />
                My Books
              </button>
              
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'settings' ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-5 w-5 inline-block mr-2" />
                Settings
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">Profile Information</h2>
                
                <form className="max-w-lg">
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
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">Order History</h2>
                
                {orders.length === 0 ? (
                  <p className="text-gray-500">You haven't placed any orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <OrderItem key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Books Tab */}
            {activeTab === 'books' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">My Books for Sale</h2>
                
                {userBooks.length === 0 ? (
                  <p className="text-gray-500">You haven't listed any books for sale yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Condition
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userBooks.map(book => (
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
                              <div className="text-sm text-gray-900">৳{book.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{book.condition}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(book.status ?? 'pending')}`}>
                                {book.status?.charAt(0).toUpperCase() + (book.status?.slice(1) ?? '')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-medium text-amber-900 mb-6">Account Settings</h2>
                
                <div className="space-y-6 max-w-lg">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Change Password</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          id="current-password"
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          id="new-password"
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirm-new-password"
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      
                      <button
                        type="button"
                        className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-gray-700">Email notifications for order updates</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-gray-700">Email notifications for special offers</span>
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;