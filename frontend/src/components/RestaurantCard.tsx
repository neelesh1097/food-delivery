import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import type { Restaurant } from "../types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
}) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image with overlay badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Delivery Time Badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span>{restaurant.deliveryTimeMins} mins</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
          <span>{restaurant.rating.toFixed(1)}</span>
          <Star className="w-3 h-3 fill-white" />
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-rose-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-gray-500 text-xs mt-1 line-clamp-1">
            {restaurant.cuisine.join(" • ")}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{restaurant.address.city}</span>
          <span className="font-medium text-gray-700">
            Min order: ₹{restaurant.minOrderAmount}
          </span>
        </div>
      </div>
    </Link>
  );
};
