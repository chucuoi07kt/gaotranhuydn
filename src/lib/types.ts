import type { Category } from './constants';

export interface Product {
  id: string;
  name: string;
  category: Category | string;
  price: number;
  weight?: string;
  image?: string;
  description?: string;
  traits?: string;
  origin?: string;
  stock?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
  category?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  weight: string;
  quantity: number;
  category?: string;
}

export interface CheckoutPayload {
  customer: {
    fullName: string;
    phone: string;
    address: string;
    note?: string;
  };
  shipping: {
    id: string;
    label: string;
    price: number;
  };
  items: CartItem[];
  total: number;
  createdAt: string;
}
