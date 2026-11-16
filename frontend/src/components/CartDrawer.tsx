import React, { useState } from "react";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const CartDrawer: React.FC = () => {
  const {
    items,
    restaurantInfo,
    isOpen,
    setIsOpen,
    updateQuantity,
    clearCart,
    totalAmount,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "Flat 402, Sunshine Apartments, 12th Main",
    city: "Bengaluru",
    state: "KA",
    zip: "560034",
    phone: "9876543210",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "cash_on_delivery" | "card" | "upi"
  >("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsOpen(false);
      navigate("/login");
      return;
    }

    if (!items.length || !restaurantInfo) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/orders", {
        restaurantId: restaurantInfo.id,
        restaurantName: restaurantInfo.name,
        items,
        totalAmount: totalAmount + 40, // subtotal + delivery fee
        deliveryAddress: address,
        paymentMethod,
      });

      if (res.data.success) {
        clearCart();
        setIsOpen(false);
        navigate("/orders");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = items.length > 0 ? 40 : 0;
  const grandTotal = totalAmount + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-4xl mb-4">
                🛒
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Your cart is empty</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">
                Looks like you haven't added any tasty treats to your cart yet.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition shadow-sm"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {restaurantInfo && (
                  <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider">
                        Ordering from
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {restaurantInfo.name}
                      </p>
                    </div>
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-600 hover:underline font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50"
                    >
                      <div className="flex-1 pr-3">
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-rose-600 font-bold mt-0.5">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm font-semibold text-gray-700 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          className="hover:text-rose-600 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          className="hover:text-rose-600 p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Delivery Address
                  </h4>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    placeholder="Street Address"
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-rose-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      placeholder="City"
                      className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      placeholder="Phone"
                      className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Payment Method
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                    {(["upi", "card", "cash_on_delivery"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2 rounded-lg border text-center capitalize transition ${
                          paymentMethod === method
                            ? "border-rose-600 bg-rose-50 text-rose-700 font-bold"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {method.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}
              </div>

              {/* Bill Details & Checkout */}
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-900">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {loading ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <span>{isAuthenticated ? "Place Order" : "Login to Checkout"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
