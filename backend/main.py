import uuid

from langgraph.types import Command
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot.hitl_graph import graph


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

    print("result['__interrupt__']", result["__interrupt__"])

    # Extract the assistant's response
    assistant_message = result["messages"][-1]

    return {"response": assistant_message.content, "conversation_id": thread_id}


class StartRequest(BaseModel):
    question: str
    conversation_id: str | None = None


class FeedbackRequest(BaseModel):
    is_correct: bool
    conversation_id: str


def _run_graph(input_data, thread_id: str):
    """Execute graph with conversation tracking."""
    config = {"configurable": {"thread_id": thread_id}}
    result = graph.invoke(input_data, config)
    return {"response": result, "conversation_id": thread_id}


@app.post("/start_hitl")
def start_hitl(request: StartRequest):
    thread_id = request.conversation_id or str(uuid.uuid4())
    return _run_graph({"question": request.question}, thread_id)


@app.post("/resume_hitl")
def resume_hitl(request: FeedbackRequest):
    if "conversation_id" not in request:
        raise HTTPException(status_code=400, detail="Conversation ID is required")
    return _run_graph(Command(resume=request.is_correct), request.conversation_id)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
