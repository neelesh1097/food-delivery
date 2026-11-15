import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import restaurantRoutes from "./routes/restaurant.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req: Request, _res: Response, next) => {
  console.log(`[Restaurant Service] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "restaurant-service",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/", restaurantRoutes);

// Fallback 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(port, () => {
  console.log(`[Restaurant Service] Running on http://localhost:${port}`);
  connectDB();
});

export default app;
