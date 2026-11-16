import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowLeft, ShoppingBag } from "lucide-react";
import { FoodItemCard } from "../components/FoodItemCard";
import type { Restaurant } from "../types";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export const RestaurantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const { totalCount, totalAmount, setIsOpen } = useCart();

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/restaurants/${id}`);
        if (res.data.success) {
          setRestaurant(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-64 bg-gray-200 rounded-3xl animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant not found</h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center text-rose-600 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Restaurants
        </Link>
      </div>
    );
  }

  // Group menu by category
  const categories = Array.from(
    new Set(restaurant.menu?.map((item) => item.category) || [])
  );

  return (
    <div className="min-h-screen pb-28">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to all restaurants
        </Link>

        {/* Restaurant Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-xl">
          <div className="absolute inset-0">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover opacity-35 filter blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          </div>

          <div className="relative p-6 sm:p-10 z-10 flex flex-col justify-end min-h-[260px]">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow">
                <span>{restaurant.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-white" />
              </span>
              <span className="bg-white/20 backdrop-blur-md text-xs font-medium px-2.5 py-1 rounded-lg">
                {restaurant.numRatings}+ ratings
              </span>
              <span className="bg-white/20 backdrop-blur-md text-xs font-medium px-2.5 py-1 rounded-lg flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-rose-400" />
                {restaurant.deliveryTimeMins} mins delivery
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-1">
              {restaurant.name}
            </h1>
            <p className="text-rose-300 text-sm sm:text-base font-medium mt-1">
              {restaurant.cuisine.join(" • ")}
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mt-2 max-w-2xl line-clamp-2">
              {restaurant.description}
            </p>

            <div className="flex items-center text-xs text-gray-400 mt-4">
              <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500" />
              <span>
                {restaurant.address.street}, {restaurant.address.city}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="mt-12 space-y-10">
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500 text-sm">
                No menu items available for this restaurant yet.
              </p>
            </div>
          ) : (
            categories.map((cat) => {
              const categoryItems =
                restaurant.menu?.filter((item) => item.category === cat) || [];
              return (
                <div key={cat} className="space-y-4">
                  <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                      {cat}
                    </h3>
                    <span className="text-xs font-semibold text-gray-400">
                      {categoryItems.length} items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryItems.map((item) => (
                      <FoodItemCard
                        key={item._id}
                        item={item}
                        restaurantId={restaurant._id}
                        restaurantName={restaurant.name}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Cart Bar when items in cart */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-30 px-4 max-w-lg mx-auto">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between transition-all transform hover:-translate-y-0.5"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-rose-200 font-medium">
                  {totalCount} item{totalCount > 1 ? "s" : ""} in cart
                </p>
                <p className="text-lg font-black leading-none">₹{totalAmount}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 font-bold text-sm bg-white text-rose-600 px-4 py-2 rounded-xl shadow">
              <span>View Cart</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
