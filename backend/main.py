import uuid

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot.graph import graph


app = FastAPI(
    title="Template Project REACT + Fastapi",
    description="Template Project REACT + Fastapi",
    version="1.0.0",
)

# Add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None


@app.get("/")
def read_root():
    return {"message": "This comes from the backend"}


@app.post("/chat")
def chat(request: ChatRequest):
    """Chat endpoint to start the graph with a user message."""
    # Get or create conversation ID (thread_id in LangGraph)
    thread_id = request.conversation_id
    if not thread_id:
        thread_id = str(uuid.uuid4())

    # Create the config with thread_id for LangGraph's checkpointer
    config = {"configurable": {"thread_id": thread_id}}

    # Create input state with the new user message
    input_state = {"messages": [{"role": "user", "content": request.message}]}

    # Run the graph with the config - LangGraph will handle memory automatically
    result = graph.invoke(input_state, config)

    # Extract the assistant's response
    assistant_message = result["messages"][-1]

    return {"response": assistant_message.content, "conversation_id": thread_id}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
