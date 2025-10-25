import type { User } from "@supabase/supabase-js";
import type { AppUser } from "@compkit/types";

export function mapSupabaseUser(user: User | null): AppUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata.full_name ?? null,
    avatarUrl: user.user_metadata.avatar_url ?? null,
    provider: (user.app_metadata.provider as AppUser["provider"]) ?? null,
  };
}