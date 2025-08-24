import type {ThreadMessage, ChatModelRunResult} from "@assistant-ui/react";

const API_BASE_URL = "http://localhost:8008";
const ENDPOINTS = {
  START_HITL: `${API_BASE_URL}/start_hitl`,
  RESUME_HITL: `${API_BASE_URL}/resume_hitl`
};

export const ERROR_MESSAGES = {
  NO_RESPONSE: "No response received from the chat service",
  NETWORK_ERROR: "Failed to connect to chat service",
  API_ERROR: "Chat service error"
} as const;

export const getLatestUserMessage = (
  messages: readonly ThreadMessage[]
): string => {
  const lastMessage = messages.at(-1);
  const firstContent = lastMessage?.content?.[0];
  return firstContent?.type === "text" ? firstContent.text ?? "" : "";
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === "AbortError") return "Request was cancelled";
    if (error.message.includes("fetch")) return ERROR_MESSAGES.NETWORK_ERROR;
    return `${ERROR_MESSAGES.API_ERROR}: ${error.message}`;
  }
  return "An unexpected error occurred";
};

async function postJson<T>(
  url: string,
  body: unknown,
  signal: AbortSignal
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
    signal
  });

  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<T>;
}

export async function startHitl(
  userMessage: string,
  conversationIdRef: React.RefObject<string | null>,
  abortSignal: AbortSignal
): Promise<ChatModelRunResult> {
  const data = await postJson<any>(
    ENDPOINTS.START_HITL,
    {question: userMessage, conversation_id: conversationIdRef.current},
    abortSignal
  );

  if (data.conversation_id) conversationIdRef.current = data.conversation_id;

  return {
    content: [
      {
        type: "text",
        text: data.response.llm_output || ERROR_MESSAGES.NO_RESPONSE
      }
    ]
  };
}

export async function resumeHitl(
  userMessage: string,
  conversationIdRef: React.RefObject<string | null>,
  abortSignal: AbortSignal
): Promise<ChatModelRunResult> {
  const isCorrect = userMessage.includes("1");

  const data = await postJson<any>(
    ENDPOINTS.RESUME_HITL,
    {is_correct: isCorrect, conversation_id: conversationIdRef.current},
    abortSignal
  );

  if (data.conversation_id) conversationIdRef.current = data.conversation_id;

  return {
    content: [
      {
        type: "text",
        text: data.response.final_output || ERROR_MESSAGES.NO_RESPONSE
      }
    ]
  };
}
