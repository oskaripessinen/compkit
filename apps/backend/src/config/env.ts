import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  openRouter: {
    apiKey: process.env.OPEN_ROUTER_API,
    baseUrl: "https://openrouter.ai/api/v1",
    model: "qwen/qwen-2.5-coder-32b-instruct:free",
  },
} as const;

if (!config.openRouter.apiKey) {
  console.warn("OPEN_ROUTER_API not set - AI generation will not work");
}