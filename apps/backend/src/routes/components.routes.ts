import { Router } from "express";
import { AIService } from "../services/ai.service";
import type { GenerateRequest, GenerateResponse, ErrorResponse } from "@compkit/types";
import { config } from "../config/env";

const router = Router();

router.post("/components/generate", async (req, res) => {
  const { prompt } = req.body as GenerateRequest;

  if (!prompt?.trim()) {
    return res.status(400).json({ 
      error: "Prompt is required" 
    } as ErrorResponse);
  }

  try {
    const code = await AIService.generateComponent(prompt);
    const components = AIService.parseComponents(code);

    res.json({
      success: true,
      code,
      components,
      model: config.openRouter.model,
    } as GenerateResponse);

  } catch (error: any) {
    console.error('AI generation error:', error.message);
    
    res.status(500).json({
      error: "Failed to generate component",
      details: error.message,
    } as ErrorResponse);
  }
});

export default router;