export type AuthProvider = "google" | "github" | "otp";

export interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  provider: AuthProvider | null;
}