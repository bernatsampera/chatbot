import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ChatModelRunResult,
  type ThreadMessage
} from "@assistant-ui/react";
import {Thread} from "@/components/assistant-ui/thread";
import {useRef, useState} from "react";

// API Configuration
const API_BASE_URL = "http://localhost:8008";
const START_HITL_ENDPOINT = `${API_BASE_URL}/start_hitl`;
const RESUME_HITL_ENDPOINT = `${API_BASE_URL}/resume_hitl`;
// Error messages
const ERROR_MESSAGES = {
  NO_RESPONSE: "No response received from the chat service",
  NETWORK_ERROR: "Failed to connect to chat service",
  API_ERROR: "Chat service error"
} as const;

/**
 * Extracts the latest user message from the messages array
 */
const getLatestUserMessage = (messages: readonly ThreadMessage[]): string => {
  const lastMessage = messages[messages.length - 1];
  const firstContent = lastMessage?.content?.[0];

  console.log("lastMessage", lastMessage);

  // Check if the content is a text message part
  if (firstContent && firstContent.type === "text") {
    return firstContent.text || "";
  }

  return "";
};

/**
 * Handles API errors and returns user-friendly error messages
 */
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return "Request was cancelled";
    }
    if (error.message.includes("fetch")) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return `${ERROR_MESSAGES.API_ERROR}: ${error.message}`;
  }
  return "An unexpected error occurred";
};

const startHitl = async (
  userMessage: string,
  conversationIdRef: React.RefObject<string | null>,
  abortSignal: AbortSignal,
  setHitlResponse: (response: string) => void
) => {
  const response = await fetch(START_HITL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: userMessage,
      conversation_id: conversationIdRef.current
    }),
    signal: abortSignal
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const responseText = data.response.llm_output || ERROR_MESSAGES.NO_RESPONSE;
  setHitlResponse(data.response.__interrupt__);
  console.log("data starthitl", data);
  // Store the conversation ID for future requests
  if (data.conversation_id) {
    conversationIdRef.current = data.conversation_id;
  }

  return {
    content: [
      {
        type: "text",
        text: responseText
      }
    ]
  };
};

const resumeHitl = async (
  userMessage: string,
  conversationIdRef: React.RefObject<string | null>,
  abortSignal: AbortSignal
) => {
  const isCorrect = userMessage.includes("1");
  console.log("isCorrect", isCorrect);
  console.log("userMessage", userMessage);
  const response = await fetch(RESUME_HITL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      is_correct: isCorrect,
      conversation_id: conversationIdRef.current
    }),
    signal: abortSignal
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const responseText = data.response.final_output || ERROR_MESSAGES.NO_RESPONSE;
  console.log("data resumehitl", data);
  // Store the conversation ID for future requests
  if (data.conversation_id) {
    conversationIdRef.current = data.conversation_id;
  }

  return {
    content: [
      {
        type: "text",
        text: responseText
      }
    ]
  };
};

/**
 * Creates a chat model adapter that communicates with the backend API
 */

/**
 * Main App component that provides the chat interface
 */
function HitlChatbot() {
  const conversationIdRef = useRef<string | null>(null);
  const [hitlResponse, setHitlResponse] = useState<string | null>(null);

  const createChatModelAdapter = (
    conversationIdRef: React.RefObject<string | null>
  ): ChatModelAdapter => ({
    async run({messages, abortSignal}) {
      try {
        console.log("messages", messages);
        const userMessage = getLatestUserMessage(messages);
        if (hitlResponse) {
          const response = await resumeHitl(
            userMessage,
            conversationIdRef,
            abortSignal
          );
          return response as ChatModelRunResult;
        }
        const response = await startHitl(
          userMessage,
          conversationIdRef,
          abortSignal,
          setHitlResponse
        );

        return response as ChatModelRunResult;
      } catch (error) {
        console.error("Chat API error:", error);

        return {
          content: [
            {
              type: "text",
              text: handleApiError(error)
            }
          ]
        };
      }
    }
  });

  const chatRuntime = useLocalRuntime(
    createChatModelAdapter(conversationIdRef)
  );

  return (
    <div className="h-screen w-screen">
      <AssistantRuntimeProvider runtime={chatRuntime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}

export default HitlChatbot;
