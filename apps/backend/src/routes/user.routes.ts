import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { UserService } from "../services/user.service";
import type { ErrorResponse } from "@compkit/types";

const router = Router();

// Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user!.id;

  try {
    const user = await UserService.getUserById(userId);

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      error: "Failed to fetch user data",
      details: error.message,
    } as ErrorResponse);
  }
});

// Update user profile
router.patch("/me", authMiddleware, async (req, res) => {
  const userId = req.user!.id;
  const { full_name, avatar_url } = req.body;

  try {
    const user = await UserService.updateUserMetadata(userId, {
      full_name,
      avatar_url,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(400).json({
      error: "Failed to update user profile",
      details: error.message,
    } as ErrorResponse);
  }
});

export default router;