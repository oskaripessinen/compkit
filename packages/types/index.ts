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
  userId: string;
  name: string;
  category: string | null;
  code: string;
  createdAt: string;
}

// A saved library snapshot
export interface Library {
  id: string;
  userId: string;
  name: string | null;
  createdAt: string;
}

// Relationship: which components belong to a library snapshot
export interface LibraryComponent {
  libraryId: string;
  componentId: string;
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

export interface Library {
  id: string;
  name: string | null;
  description?: string | null;
  components: string[];
  createdAt: string;
  userId: string;
}
