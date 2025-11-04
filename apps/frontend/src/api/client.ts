import type { GenerateRequest, GenerateResponse, ErrorResponse, LibraryWithComponents, AppUser } from "@compkit/types";
import { supabase } from "../lib/supabase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ApiError {
  message: string;
  statusCode: number;
  details?: string;
}

async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getAuthToken();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw {
        message: errorData.error || "Request failed",
        statusCode: response.status,
        details: errorData.details,
      } as ApiError;
    }

    return data as T;
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    throw {
      message: "Network error",
      statusCode: 0,
      details: (error as Error).message,
    } as ApiError;
  }
}

export async function generateComponent(
  prompt: string,
  libraryName?: string
): Promise<GenerateResponse> {
  return fetchApi<GenerateResponse>("/components/generate", {
    method: "POST",
    body: JSON.stringify({ prompt, libraryName } satisfies GenerateRequest & { libraryName?: string }),
  });
}

export async function modifyComponent(
  currentCode: string,
  modificationRequest: string,
  componentId?: string
): Promise<GenerateResponse> {
  return fetchApi<GenerateResponse>("/components/modify", {
    method: "POST",
    body: JSON.stringify({ currentCode, modificationRequest, componentId }),
  });
}

export async function getUserLibraries(): Promise<{ success: boolean; libraries: LibraryWithComponents[] }> {
  return fetchApi<{ success: boolean; libraries: LibraryWithComponents[] }>("/libraries", {
    method: "GET",
  });
}

export async function getLibraryById(id: string): Promise<{ success: boolean; library: LibraryWithComponents }> {
  return fetchApi<{ success: boolean; library: LibraryWithComponents }>(`/libraries/${id}`, {
    method: "GET",
  });
}

export async function addComponentToLibrary(
  libraryId: string,
  name: string,
  code: string,
  category?: string
) {
  return fetchApi(`/libraries/${libraryId}/components`, {
    method: "POST",
    body: JSON.stringify({ name, code, category }),
  });
}

export async function deleteLibrary(id: string) {
  return fetchApi(`/libraries/${id}`, {
    method: "DELETE",
  });
}

export async function deleteComponent(id: string) {
  return fetchApi(`/components/${id}`, {
    method: "DELETE",
  });
}

export async function publishLibrary(components: string[]) {
  return fetchApi("/libraries/publish", {
    method: "POST",
    body: JSON.stringify({ components }),
  });
}

export async function getUserProfile(): Promise<{ success: boolean; user: AppUser }> {
  return fetchApi<{ success: boolean; user: AppUser }>("/user/me", {
    method: "GET",
  });
}