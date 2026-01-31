export interface Product {
  id: string;
  name: string;
  category: string;
  weight: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  estimatedDelivery: Date;
  deliveryId?: string; // Chot delivery ID
  trackingUrl?: string; // Chot tracking URL
}

export interface DeliveryInfo {
  deliveryId: string;
  partnerId: string;
  partnerName: string;
  partnerPhone: string;
  partnerRating: number;
  vehicleType: string;
  status: 'assigned' | 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  pickupTime?: string;
  deliveryTime?: string;
  trackingUrl: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  estimatedArrival?: number; // in minutes
}

export interface FormData {
  phone: string;
  password: string;
  name: string;
  email: string;
  pin?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
}
