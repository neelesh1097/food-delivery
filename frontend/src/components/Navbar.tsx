import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  LogOut,
  MapPin,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalCount, setIsOpen } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Location */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-3xl filter transition-transform group-hover:scale-110 duration-200">
                🍔
              </span>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                BiteDash
              </span>
            </Link>

            <div className="hidden md:flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer">
              <MapPin className="w-4 h-4 text-rose-500 mr-1" />
              <span>Bengaluru, India</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 transition"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden sm:inline">My Orders</span>
                </Link>

                <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.username?.charAt(0) || "U"}
                  </div>
                  <span className="font-semibold text-gray-800 hidden sm:inline">
                    {user?.username}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    title="Sign Out"
                    className="text-gray-400 hover:text-red-500 transition p-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-rose-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition shadow-rose-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center space-x-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl shadow-md transition duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-semibold text-sm hidden sm:inline">Cart</span>
              {totalCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
