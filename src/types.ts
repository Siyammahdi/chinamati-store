export type Category = 'gadgets' | 'kitchen' | 'home';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number; // Mock rating (e.g. 4.7)
  reviewsCount: number; // Mock review count (e.g. 142)
  specs: string[]; // Specs lists
  category: Category;
  stock: number;
  subImages?: string[]; // Optional sub-image gallery URLs (up to 4)
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  address: string;
  hasSetPassword: boolean;
  password?: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userDistrict: string;
  userAddress: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: 'cod' | 'sslcommerz';
  paymentStatus: 'Pending' | 'Paid';
  status: 'Pending' | 'Shipping' | 'Delivered' | 'Cancelled';
  createdAt: string;
  invoiceId: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  issueDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDistrict: string;
  customerAddress: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: 'cod' | 'sslcommerz';
  paymentStatus: 'Pending' | 'Paid';
}

export interface ProductReview {
  id: string;
  productId: string;
  reviewer: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  imageUrls: string[];
  createdAt: string;
}

