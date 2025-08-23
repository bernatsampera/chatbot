from chatbot.graph import graph
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


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


@app.get("/")
def read_root():
    return {"message": "This comes from the backend"}


@app.post("/chat")
def chat(request: ChatRequest):
    """Chat endpoint to start the graph with a user message."""
    # Create initial state with user message
    initial_state = {"messages": [{"role": "user", "content": request.message}]}

    # Run the graph
    result = graph.invoke(initial_state)

    # Extract the assistant's response
    assistant_message = result["messages"][-1].content

    return {"response": assistant_message}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
