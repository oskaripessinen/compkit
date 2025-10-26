import type { GenerateRequest, GenerateResponse, ErrorResponse } from "@compkit/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ApiError {
  message: string;
  statusCode: number;
  details?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
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

export async function generateComponent(prompt: string): Promise<GenerateResponse> {
  return fetchApi<GenerateResponse>("/components/generate", {
    method: "POST",
    body: JSON.stringify({ prompt } satisfies GenerateRequest),
  });
}

export async function publishLibrary(components: string[]) {
  return fetchApi("/libraries/publish", {
    method: "POST",
    body: JSON.stringify({ components }),
  });
}

export async function getLibraryById(id: string) {
  return fetchApi(`/libraries/${id}`, {
    method: "GET",
  });
}