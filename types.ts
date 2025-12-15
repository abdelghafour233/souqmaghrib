export enum Category {
  ELECTRONICS = 'إلكترونيات',
  HOME = 'منزل',
  CARS = 'سيارات',
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  city: string;
  phone: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface PixelEvent {
  eventName: string;
  data?: Record<string, any>;
}