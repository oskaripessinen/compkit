// Shared auth provider information
export type AuthProvider = "google" | "github" | "otp" | null;

// Normalized user shape used everywhere in the app
export interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  provider: AuthProvider;
  createdAt?: string | null;
  tier?: string | null;
  credits?: number | null;
}

// A single UI component stored in Supabase
export interface Component {
  id: string;
  user_id: string;
  name: string;
  code: string;
  category: string | null;
  created_at: string;
}

// A saved library snapshot (database table)
export interface Library {
  id: string;
  name: string | null;
  user_id: string;
  created_at: string;
  description?: string | null;
}

// Relationship: which components belong to a library snapshot
export interface LibraryComponent {
  libraryId: string;
  componentId: string;
}

// Library with populated components (from API responses)
export interface LibraryWithComponents extends Library {
  components: Component[];
}

export interface GenerateRequest {
  prompt: string;
}

export interface GenerateResponse {
  success: boolean;
  code: string;
  components: Array<{
    name: string;
    code: string;
  }>;
  css?: string; // CSS generated/modified by AI
  library?: LibraryWithComponents; // Added optional library
  model: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface PublishLibraryRequest {
  components: string[];
  name: string;
  description?: string;
}

export interface PublishLibraryResponse {
  success: boolean;
  libraryId: string;
}
