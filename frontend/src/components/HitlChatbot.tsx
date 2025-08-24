import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ChatModelRunResult
} from "@assistant-ui/react";
import {Thread} from "@/components/assistant-ui/thread";
import {useRef} from "react";
import {
  getLatestUserMessage,
  handleApiError,
  startHitl,
  resumeHitl
} from "@/services/hitlApi";

function HitlChatbot() {
  const conversationIdRef = useRef<string | null>(null);

  const createChatModelAdapter = (): ChatModelAdapter => ({
    async run({messages, abortSignal}) {
      try {
        const userMessage = getLatestUserMessage(messages);

        // decide based on conversationId, not hitlResponse
        return conversationIdRef.current
          ? await resumeHitl(userMessage, conversationIdRef, abortSignal)
          : await startHitl(userMessage, conversationIdRef, abortSignal);
      } catch (error) {
        console.error("Chat API error:", error);
        return {
          content: [{type: "text", text: handleApiError(error)}]
        } as ChatModelRunResult;
      }
    }
  });

  const chatRuntime = useLocalRuntime(createChatModelAdapter());

  return (
    <div className="h-screen w-screen">
      <AssistantRuntimeProvider runtime={chatRuntime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}

export default HitlChatbot;
