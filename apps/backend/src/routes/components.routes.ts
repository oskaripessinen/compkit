import { Router } from "express";
import { AIService } from "../services/ai.service";
import { ComponentLibraryService } from "../services/component-library.service";
import type { GenerateRequest, GenerateResponse, ErrorResponse } from "@compkit/types";
import { config } from "../config/env";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Generate component (with optional database save if user is authenticated)
router.post("/components/generate", optionalAuthMiddleware, async (req, res) => {
  const { prompt, libraryName } = req.body as GenerateRequest & { libraryName?: string };
  const userId = req.user?.id;

  if (!userId) {
      return res.status(400).json({ 
        error: "User ID is required for authenticated users" 
      } as ErrorResponse);
    }
  

  try {
    
    const result = await AIService.generateComponent(prompt, userId, libraryName);

    // Ensure components are always returned in the correct format
    const components = result.components && result.components.length > 0 
      ? result.components 
      : AIService.parseComponents(result.code);
    
    res.json({
      success: true,
      code: result.code,
      components,
      css: result.css,
      library: result.library, // Now includes LibraryWithComponents
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

// Modify existing component (with optional database update)
router.post("/components/modify", optionalAuthMiddleware, async (req, res) => {
  const { currentCode, modificationRequest, componentId } = req.body;
  const userId = req.user?.id;
  
  if (!currentCode || !modificationRequest?.trim()) {
    return res.status(400).json({ 
      error: "Current code and modification request are required" 
    } as ErrorResponse);
  }

  try {
    const result = await AIService.modifyComponent(
      currentCode, 
      modificationRequest,
      userId,
      componentId
    );

    res.json({
      success: true,
      code: result.code,
      components: result.components,
      css: result.css,
      model: config.openRouter.model,
    } as GenerateResponse);

  } catch (error: any) {
    console.error('AI modification error:', error.message);
    
    res.status(500).json({
      error: "Failed to modify component",
      details: error.message,
    } as ErrorResponse);
  }
});

// All routes below require authentication

// Get all user libraries with components
router.get("/libraries", authMiddleware, async (req, res) => {
  const userId = req.user!.id;

  try {
    const libraries = await ComponentLibraryService.getUserLibraries(userId);

    res.json({
      success: true,
      libraries,
    });
  } catch (error: any) {
    console.error('Error fetching libraries:', error);
    res.status(500).json({
      error: "Failed to fetch libraries",
      details: error.message,
    } as ErrorResponse);
  }
});

// Get library by ID with components
router.get("/libraries/:id", authMiddleware, async (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;

  try {
    const library = await ComponentLibraryService.getLibraryById(id, userId);

    res.json({
      success: true,
      library,
    });
  } catch (error: any) {
    console.error('Error fetching library:', error);
    res.status(404).json({
      error: "Library not found",
      details: error.message,
    } as ErrorResponse);
  }
});

// Add component to library
router.post("/libraries/:id/components", authMiddleware, async (req, res) => {
  const userId = req.user!.id;
  const { id: libraryId } = req.params;
  const { name, code, category } = req.body;

  if (!name || !code) {
    return res.status(400).json({
      error: "Name and code are required",
    } as ErrorResponse);
  }

  try {
    const component = await ComponentLibraryService.addComponentToLibrary(
      userId,
      libraryId,
      name,
      code,
      category
    );

    res.json({
      success: true,
      component,
    });
  } catch (error: any) {
    console.error('Error adding component:', error);
    res.status(500).json({
      error: "Failed to add component",
      details: error.message,
    } as ErrorResponse);
  }
});

// Delete library
router.delete("/libraries/:id", authMiddleware, async (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;

  try {
    await ComponentLibraryService.deleteLibrary(id, userId);

    res.json({
      success: true,
      message: "Library deleted successfully",
    });
  } catch (error: any) {
    console.error('Error deleting library:', error);
    res.status(500).json({
      error: "Failed to delete library",
      details: error.message,
    } as ErrorResponse);
  }
});

// Delete component
router.delete("/components/:id", authMiddleware, async (req, res) => {
  const userId = req.user!.id;
  const { id } = req.params;

  try {
    await ComponentLibraryService.deleteComponent(id, userId);

    res.json({
      success: true,
      message: "Component deleted successfully",
    });
  } catch (error: any) {
    console.error('Error deleting component:', error);
    res.status(500).json({
      error: "Failed to delete component",
      details: error.message,
    } as ErrorResponse);
  }
});

export default router;