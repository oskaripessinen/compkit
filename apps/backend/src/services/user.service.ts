import { supabase } from "../config/supabase";
import type { AppUser } from "@compkit/types";

export class UserService {
  /**
   * Get user profile by ID
   */
  static async getUserById(userId: string): Promise<AppUser> {
    try {
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);

      if (authError || !authUser) {
        throw new Error(authError?.message || "User not found");
      }

      const user = authUser.user;

      // Map to AppUser format
      const appUser: AppUser = {
        id: user.id,
        email: user.email || null,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
        provider: (user.app_metadata?.provider as AppUser['provider']),
        createdAt: user.created_at,
        tier: user.user_metadata?.tier || 'free',
        credits: user.user_metadata?.credits || 5,
      };

      return appUser;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw new Error(error.message || "Failed to fetch user");
    }
  }

  /**
   * Update user metadata
   */
  static async updateUserMetadata(
    userId: string,
    metadata: {
      full_name?: string;
      avatar_url?: string;
      tier?: string;
      credits?: number;
    }
  ): Promise<AppUser> {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: metadata,
      });

      if (error) {
        throw new Error(error.message);
      }

      return this.getUserById(userId);
    } catch (error: any) {
      console.error('Error updating user metadata:', error);
      throw new Error(error.message || "Failed to update user");
    }
  }

  /**
   * Decrement user credits
   */
  static async decrementCredits(userId: string, amount: number = 1): Promise<number> {
    try {
      const user = await this.getUserById(userId);
      const currentCredits = user.credits || 0;
      const newCredits = Math.max(0, currentCredits - amount);

      await this.updateUserMetadata(userId, {
        credits: newCredits,
      });

      return newCredits;
    } catch (error: any) {
      console.error('Error decrementing credits:', error);
      throw new Error(error.message || "Failed to decrement credits");
    }
  }

  /**
   * Add credits to user
   */
  static async addCredits(userId: string, amount: number): Promise<number> {
    try {
      const user = await this.getUserById(userId);
      const currentCredits = user.credits || 0;
      const newCredits = currentCredits + amount;

      await this.updateUserMetadata(userId, {
        credits: newCredits,
      });

      return newCredits;
    } catch (error: any) {
      console.error('Error adding credits:', error);
      throw new Error(error.message || "Failed to add credits");
    }
  }
}