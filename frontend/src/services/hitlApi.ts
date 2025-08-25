import type {ThreadMessage, ChatModelRunResult} from "@assistant-ui/react";

// API configuration
const API_BASE_URL = "http://localhost:8008";
const ENDPOINTS = {
  START_HITL: `${API_BASE_URL}/start_hitl`,
  RESUME_HITL: `${API_BASE_URL}/resume_hitl`
};

// Type definitions for API responses
interface HitlApiResponse {
  conversation_id: string;
  response: {
    llm_output?: string;
    final_output?: string;
  };
}

/**
 * Extracts the latest text message from a thread of messages
 */
export const getLatestUserMessage = (
  messages: readonly ThreadMessage[]
): string => {
  const lastMessage = messages.at(-1);
  const firstContent = lastMessage?.content?.[0];
  return firstContent?.type === "text" ? firstContent.text ?? "" : "";
};

/**
 * Makes a POST request to the HITL API with JSON payload
 * Handles common error cases and type safety
 */
async function makeApiRequest<T>(
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

  if (!response.ok) {
    throw new Error(
      `HITL API request failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

/**
 * Initiates a new HITL conversation or continues an existing one
 */
export async function startHitl(
  userMessage: string,
  conversationIdRef: React.RefObject<string | null>,
  abortSignal: AbortSignal
): Promise<ChatModelRunResult> {
  const data = await makeApiRequest<HitlApiResponse>(
    ENDPOINTS.START_HITL,
    {question: userMessage, conversation_id: conversationIdRef.current},
    abortSignal
  );

  if (data.conversation_id) conversationIdRef.current = data.conversation_id;

  return {
    content: [
      {
        type: "text",
        text:
          data.response.llm_output ||
          "No response received from the chat service"
      }
    ]
  };
}

/**
 * Resumes HITL conversation after user feedback (1 = correct, other = incorrect)
 */
export async function resumeHitl(
  userMessage: string,
  conversationIdRef: React.RefObject<string | null>,
  abortSignal: AbortSignal
): Promise<ChatModelRunResult> {
  const isCorrect = userMessage.includes("1");

  const data = await makeApiRequest<HitlApiResponse>(
    ENDPOINTS.RESUME_HITL,
    {is_correct: isCorrect, conversation_id: conversationIdRef.current},
    abortSignal
  );

  if (data.conversation_id) conversationIdRef.current = data.conversation_id;

  return {
    content: [
      {
        type: "text",
        text:
          data.response.final_output ||
          "No response received from the chat service"
      }
    ]
  };
}
