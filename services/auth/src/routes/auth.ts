import { Router } from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  verifyToken,
} from "../controllers/auth.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getProfile);
router.get("/verify", authenticateToken, verifyToken);

export default router;
