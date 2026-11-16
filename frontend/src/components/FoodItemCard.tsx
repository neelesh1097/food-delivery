import React from "react";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "../types";
import { useCart } from "../context/CartContext";

interface FoodItemCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  restaurantId,
  restaurantName,
}) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menuItemId === item._id);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex justify-between gap-4 transition hover:border-gray-200">
      {/* Food Details */}
      <div className="flex-1">
        {/* Veg / Non-Veg Indicator */}
        <div className="flex items-center space-x-2 mb-2">
          <span
            className={`inline-block w-4 h-4 rounded border p-0.5 flex items-center justify-center ${
              item.isVeg
                ? "border-emerald-600"
                : "border-red-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? "bg-emerald-600" : "bg-red-600"
              }`}
            />
          </span>
          <span className="text-xs font-medium text-gray-400 capitalize">
            {item.category}
          </span>
        </div>

        <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
        <p className="text-rose-600 font-extrabold text-base mt-1">₹{item.price}</p>
        {item.description && (
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Image & Add Button */}
      <div className="relative flex flex-col items-center">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="-mt-4 z-10">
          {cartItem ? (
            <div className="flex items-center space-x-2 bg-white border border-rose-600 rounded-lg shadow-md px-2 py-1 text-rose-600 font-bold text-sm">
              <button
                onClick={() => updateQuantity(item._id, -1)}
                className="hover:bg-rose-50 p-0.5 rounded transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-4 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, 1)}
                className="hover:bg-rose-50 p-0.5 rounded transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(item, restaurantId, restaurantName)}
              className="bg-white hover:bg-rose-50 text-rose-600 border border-gray-200 hover:border-rose-300 font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg shadow-sm transition active:scale-95 flex items-center space-x-1"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
