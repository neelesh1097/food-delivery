import React from "react";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍔</span>
              <span className="text-xl font-bold text-white tracking-tight">
                BiteDash
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fast, reliable food delivery from the finest restaurants straight to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Top Restaurants</a></li>
              <li><a href="#" className="hover:text-white transition">Cuisines Near You</a></li>
              <li><a href="#" className="hover:text-white transition">Offers & Deals</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Partner with us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Help
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BiteDash Inc. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};
