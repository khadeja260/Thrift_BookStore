import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<'Cash on Delivery' | 'bKash' | 'Card'>('Cash on Delivery');
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [deliveryLocation, setDeliveryLocation] = React.useState<'inside' | 'outside'>('inside');
  const { checkout } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const shippingCost = deliveryLocation === 'inside' ? 80 : 130;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setIsCheckingOut(true);
  };

  const handleCompleteCheckout = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }
    checkout(paymentMethod, `${shippingAddress}\nPhone: ${phoneNumber}`);
    navigate('/dashboard', { state: { checkoutSuccess: true } });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif font-bold text-amber-900 mb-6">Your Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-600 mb-6">Your cart is empty</p>
            <Link 
              to="/books" 
              className="px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300 inline-flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-medium text-amber-900 mb-4">Items in Your Cart</h2>
                  
                  <div className="divide-y divide-gray-200">
                    {cart.map(item => (
                      <div key={item.book.id} className="py-4 flex">
                        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md">
                          <img 
                            src={item.book.imageUrl} 
                            alt={item.book.title} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        
                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.book.title}</h3>
                              <p className="ml-4">৳{(item.book.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">by {item.book.author}</p>
                            {item.book.condition && item.book.condition !== 'New' && (
                              <p className="mt-1 text-sm text-amber-600">Condition: {item.book.condition}</p>
                            )}
                          </div>
                          
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                                className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="w-8 text-center py-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                                className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.book.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Link 
                      to="/books" 
                      className="text-amber-700 hover:text-amber-900 flex items-center"
                    >
                      <ArrowLeft className="h-5 w-5 mr-1" />
                      Continue Shopping
                    </Link>
                    
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-medium text-amber-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="text-gray-900">৳{subtotal.toFixed(2)}</p>
                    </div>
                    
                    {isCheckingOut && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Delivery Location</p>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={deliveryLocation === 'inside'}
                              onChange={() => setDeliveryLocation('inside')}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">Inside Dhaka (৳80)</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={deliveryLocation === 'outside'}
                              onChange={() => setDeliveryLocation('outside')}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">Outside Dhaka (৳130)</span>
                          </label>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <p className="text-gray-600">Shipping</p>
                      <p className="text-gray-900">৳{shippingCost}</p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                      <p className="text-gray-900">Total</p>
                      <p className="text-amber-900">৳{total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {isCheckingOut ? (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-amber-900 mb-3">Shipping Information</h3>
                      
                      <div className="mb-4">
                        <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone-number"
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700 mb-1">
                          Shipping Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="shipping-address"
                          rows={3}
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="Enter your complete shipping address"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-amber-900 mb-3">Payment Method</h3>
                        
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={paymentMethod === 'Cash on Delivery'}
                              onChange={() => setPaymentMethod('Cash on Delivery')}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">Cash on Delivery</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={paymentMethod === 'bKash'}
                              onChange={() => setPaymentMethod('bKash')}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">bKash</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={paymentMethod === 'Card'}
                              onChange={() => setPaymentMethod('Card')}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">Credit/Debit Card</span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-between">
                        <button
                          onClick={() => setIsCheckingOut(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300"
                        >
                          Back
                        </button>
                        
                        <button
                          onClick={handleCompleteCheckout}
                          disabled={!shippingAddress || !phoneNumber}
                          className={`px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300 ${
                            !shippingAddress || !phoneNumber ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          Complete Order
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      className="mt-6 w-full px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors duration-300"
                    >
                      Proceed to Checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;