// Internal backend types that frontend doesn't need to know about

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface HuggingFaceResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}