import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, MenuItem } from "../types";

interface RestaurantInfo {
  id: string;
  name: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantInfo: RestaurantInfo | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (
    item: MenuItem,
    restaurantId: string,
    restaurantName: string
  ) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart_items");
    return saved ? JSON.parse(saved) : [];
  });

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(
    () => {
      const saved = localStorage.getItem("cart_restaurant");
      return saved ? JSON.parse(saved) : null;
    }
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
    localStorage.setItem("cart_restaurant", JSON.stringify(restaurantInfo));
  }, [items, restaurantInfo]);

  const addItem = (
    item: MenuItem,
    restaurantId: string,
    restaurantName: string
  ) => {
    // If cart has items from a different restaurant, reset cart
    if (restaurantInfo && restaurantInfo.id !== restaurantId) {
      if (
        !window.confirm(
          `Your cart contains items from "${restaurantInfo.name}". Clear cart and add item from "${restaurantName}"?`
        )
      ) {
        return;
      }
      setItems([
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          imageUrl: item.imageUrl,
          isVeg: item.isVeg,
        },
      ]);
      setRestaurantInfo({ id: restaurantId, name: restaurantName });
      return;
    }

    if (!restaurantInfo) {
      setRestaurantInfo({ id: restaurantId, name: restaurantName });
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item._id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          imageUrl: item.imageUrl,
          isVeg: item.isVeg,
        },
      ];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.menuItemId === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantInfo(null);
  };

  useEffect(() => {
    if (items.length === 0) {
      setRestaurantInfo(null);
    }
  }, [items]);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantInfo,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
