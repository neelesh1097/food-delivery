import type { Response } from "express";
import Order from "../models/Order.js";
import type { AuthRequest } from "../middleware/auth.js";

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const {
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    if (!restaurantId || !items || !items.length || !totalAmount || !deliveryAddress) {
      res.status(400).json({
        success: false,
        message: "Missing required order information",
      });
      return;
    }

    const order = new Order({
      userId: req.user.id,
      customerName: req.user.username,
      customerEmail: req.user.email,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "cash_on_delivery",
      paymentStatus: paymentMethod === "card" || paymentMethod === "upi" ? "completed" : "pending",
      status: "confirmed",
    });

    await order.save();
    res.status(201).json({ success: true, message: "Order placed successfully", data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    // Check if user owns order or is admin/owner
    if (
      req.user?.role !== "admin" &&
      req.user?.role !== "restaurant_owner" &&
      order.userId !== req.user?.id
    ) {
      res.status(403).json({ success: false, message: "Access forbidden" });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status value" });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
