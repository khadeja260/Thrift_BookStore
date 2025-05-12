import React, { useState } from 'react';
import { Order } from '../../types';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-amber-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Package className="h-5 w-5 text-amber-700 mr-3" />
          <div>
            <p className="font-medium text-amber-900">Order #{order.id}</p>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-1 rounded-full mr-3 ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <span className="font-medium text-amber-900 mr-3">
            ৳{order.totalAmount.toFixed(2)}
          </span>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="mt-3">
            <h4 className="font-medium text-amber-800 mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-12 w-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden mr-3">
                      <img 
                        src={item.book.imageUrl} 
                        alt={item.book.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{item.book.title}</p>
                      <p className="text-sm text-gray-500">by {item.book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800">৳{item.book.price.toFixed(2)} × {item.quantity}</p>
                    <p className="font-medium">৳{(item.book.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Shipping Address</h4>
              <p className="text-gray-700">{order.shippingAddress}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Payment Details</h4>
              <p className="text-gray-700">Method: {order.paymentMethod}</p>
              <p className="mt-2 font-medium text-gray-800">Total: ৳{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;