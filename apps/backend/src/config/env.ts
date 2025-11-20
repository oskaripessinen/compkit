import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  openRouter: {
    apiKey: process.env.OPEN_ROUTER_API,
    baseUrl: "https://openrouter.ai/api/v1",
    model: "openai/gpt-5.1-codex-mini",
  },
  supabase: {
    url: process.env.SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_KEY || "",
  },
} as const;

if (!config.openRouter.apiKey) {
  console.warn("OPEN_ROUTER_API not set - AI generation will not work");
}

if (!config.supabase.url || !config.supabase.serviceKey) {
  console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set - Database operations will not work");
}