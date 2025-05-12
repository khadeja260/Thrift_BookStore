export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  password?: string; // Only used for mock data
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  condition?: 'New' | 'Like New' | 'Good' | 'Acceptable';
  description: string;
  year?: number;
  sellerId?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Card';
  shippingAddress: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}