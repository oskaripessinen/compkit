import express from "express";
import { config } from "./config/env";
import { corsMiddleware } from "./middleware/cors";
import healthRoutes from "./routes/health.routes";
import componentsRoutes from "./routes/components.routes";
import librariesRoutes from "./routes/libraries.routes";

const app = express();

// Middleware - CORS
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/api", componentsRoutes);
app.use("/api", librariesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Frontend URL: ${config.frontendUrl}`);
});
