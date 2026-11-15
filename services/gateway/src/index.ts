import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const RESTAURANT_SERVICE_URL =
  process.env.RESTAURANT_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Logging middleware
app.use((req: Request, _res: Response, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl} -> proxying`);
  next();
});

// Gateway health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "api-gateway",
    services: {
      auth: AUTH_SERVICE_URL,
      restaurant: RESTAURANT_SERVICE_URL,
      order: ORDER_SERVICE_URL,
    },
    timestamp: new Date().toISOString(),
  });
});

// Proxy routes
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/restaurants",
  createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
  })
);

// Fallback 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found on API Gateway",
  });
});

app.listen(port, () => {
  console.log(`[API Gateway] Listening on http://localhost:${port}`);
  console.log(`  -> Auth:        ${AUTH_SERVICE_URL}`);
  console.log(`  -> Restaurant:  ${RESTAURANT_SERVICE_URL}`);
  console.log(`  -> Order:       ${ORDER_SERVICE_URL}`);
});

export default app;
