import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Request logger
app.use((req, _res, next) => {
    console.log(`[Auth Service] ${req.method} ${req.url}`);
    next();
});
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "auth-service",
        timestamp: new Date().toISOString(),
    });
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/", authRoutes);
// Fallback 404
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.listen(port, () => {
    console.log(`[Auth Service] Running on http://localhost:${port}`);
    connectDB();
});
export default app;
