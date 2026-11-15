import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

router.post("/", createOrder);
router.get("/user", getUserOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

export default router;
