import { Router } from "express";
import { ComponentLibraryService } from "../services/component-library.service";
import { authMiddleware } from "../middleware/auth.middleware";
import type { ErrorResponse } from "@compkit/types";

const router = Router();

// Public install endpoints for npx-style installs
// GET /install/:libraryId                 -> downloads whole library as zip
// GET /install/:libraryId/:componentName -> downloads single component as zip

router.get(
  "/install/:libraryId/:componentName",
  async (req, res) => {
    const { libraryId, componentName } = req.params;
    try {
      await ComponentLibraryService.streamLibraryZip(
        res,
        libraryId,
        componentName
      );
    } catch (error: any) {
      console.error("Install (single) error:", error);
      res.status(500).json({ error: "Failed to prepare component" } as ErrorResponse);
    }
  }
);

router.get("/install/:libraryId", async (req, res) => {
  const { libraryId } = req.params;
  try {
    await ComponentLibraryService.streamLibraryZip(res, libraryId);
  } catch (error: any) {
    console.error("Install (library) error:", error);
    res.status(500).json({ error: "Failed to prepare library" } as ErrorResponse);
  }
});

// Publish library (placeholder)
router.post("/libraries/publish", (req, res) => {
  const { components } = req.body;
  const libraryId = `lib-${Math.random().toString(36).substr(2, 9)}`;
  
  // TODO: Save to database
  res.json({ success: true, libraryId });
});

// Get library (placeholder)
router.get("/libraries/:id", (req, res) => {
  const { id } = req.params;
  
  // TODO: Fetch from database
  res.json({ id, components: [] });
});

export default router;