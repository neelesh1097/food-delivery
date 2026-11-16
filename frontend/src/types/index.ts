export interface User {
  id: string;
  username: string;
  email: string;
  role: "customer" | "restaurant_owner" | "delivery_partner" | "admin";
}

export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cuisine: string[];
  rating: number;
  numRatings: number;
  imageUrl: string;
  isOpen: boolean;
  deliveryTimeMins: number;
  minOrderAmount: number;
  menu?: MenuItem[];
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  isVeg?: boolean;
}

export interface Order {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  paymentMethod: "card" | "cash_on_delivery" | "upi";
  createdAt: string;
}
