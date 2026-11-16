import React, { useState, useEffect } from "react";
import { Search, Sparkles, Utensils, RefreshCw } from "lucide-react";
import { RestaurantCard } from "../components/RestaurantCard";
import type { Restaurant } from "../types";
import api from "../services/api";

const CATEGORIES = [
  "All",
  "North Indian",
  "Pizza",
  "Biryani",
  "Asian",
  "Burgers",
  "Italian",
  "Sushi",
];

export const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [seeding, setSeeding] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      let url = "/restaurants";
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory !== "All") params.append("cuisine", selectedCategory);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      if (res.data.success) {
        setRestaurants(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await api.get("/restaurants/seed/demo");
      await fetchRestaurants();
    } catch (err) {
      console.error("Failed to seed restaurants:", err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fastest delivery in your neighborhood</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Cravings delivered to your door in minutes.
          </h1>
          <p className="mt-4 text-base sm:text-xl text-rose-100 max-w-2xl mx-auto font-normal">
            Order top-rated dishes from your favorite local kitchens and artisan chefs.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center pl-3 pr-2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for restaurants, dishes, or cuisines..."
              className="flex-1 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {selectedCategory === "All"
                ? "Popular Restaurants"
                : `${selectedCategory} Kitchens`}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Curated dining spots near you
            </p>
          </div>

          <button
            onClick={handleSeedData}
            disabled={seeding}
            title="Seed demo restaurants and food menu"
            className="flex items-center space-x-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
            <span>{seeding ? "Seeding..." : "Load Demo Data"}</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-64 border border-gray-100 animate-pulse p-4"
              >
                <div className="bg-gray-200 h-36 rounded-xl mb-4" />
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                <div className="bg-gray-200 h-3 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-md mx-auto my-12">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No restaurants found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Click the button below to initialize the database with demo restaurants and tasty menus.
            </p>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
            >
              {seeding ? "Populating..." : "Populate Demo Restaurants"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
