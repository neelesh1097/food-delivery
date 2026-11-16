import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import type { Order } from "../types";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  confirmed: { label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  preparing: { label: "Preparing in Kitchen", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  out_for_delivery: { label: "Out for Delivery", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  delivered: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
};

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get("/orders/user");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Sign in to view orders</h2>
        <p className="text-gray-500 text-xs mt-1 mb-6">
          Please log in to track your food deliveries and order history.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track live and past orders placed from BiteDash
          </p>
        </div>
        <span className="text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl">
          {orders.length} Total Orders
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-44 border border-gray-100 animate-pulse p-6"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No orders placed yet</h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            Explore delicious menus from our top restaurants and make your first order!
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
          >
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusConfig[order.status] || {
              label: order.status,
              color: "text-gray-700",
              bg: "bg-gray-50 border-gray-200",
            };

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">
                      {order.restaurantName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Order #{order._id.slice(-6).toUpperCase()} •{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${status.color} ${status.bg}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                    {status.label}
                  </span>
                </div>

                {/* Items */}
                <div className="py-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-gray-700"
                    >
                      <span className="font-medium">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="font-bold text-gray-900">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer / Summary */}
                <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="text-gray-500">
                    <span className="font-medium">Delivery to: </span>
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Total Paid:</span>
                    <span className="text-base font-black text-rose-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
