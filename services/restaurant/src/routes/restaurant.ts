import { Router } from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  getMenuItems,
  addMenuItem,
  seedDemoData,
} from "../controllers/restaurant.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", getAllRestaurants);
router.get("/seed/demo", seedDemoData);
router.get("/:id", getRestaurantById);
router.get("/:id/menu", getMenuItems);

// Protected routes (owner / admin)
router.post("/", authenticateToken, createRestaurant);
router.post("/:id/menu", authenticateToken, addMenuItem);

export default router;
