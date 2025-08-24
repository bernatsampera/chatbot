from typing import Annotated, Literal, TypedDict

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.types import Command, interrupt

load_dotenv()


class State(TypedDict):
    question: str
    llm_output: str
    final_output: str


# Initialize the LLM
llm = init_chat_model("google_genai:gemini-2.5-flash-lite")


# Define the chatbot node
def chatbot(state: State) -> Command[Literal["human_review"]]:
    print("chatbot node triggered")
    response = llm.invoke(state["question"])

    # return {"llm_output": response.content}
    return Command(
        goto="human_review",
        update={"llm_output": response.content},
    )


def human_review(state: State) -> Command[Literal["__end__"]]:
    print("human_review node triggered")
    is_correct = int(interrupt("Is the response correct? (1 for yes, 0 for no): "))

    if is_correct == 1:
        return Command(
            goto=END,
            update={"final_output": f"The response is correct. {state['llm_output']}"},
        )
    else:
        return Command(
            goto=END,
            update={
                "final_output": f"The response is incorrect. {state['llm_output']}"
            },
        )


# Build the graph with memory checkpointer
graph_builder = StateGraph(State)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("human_review", human_review)
graph_builder.add_edge(START, "chatbot")

# Use LangGraph's built-in memory checkpointer
memory = MemorySaver()
graph = graph_builder.compile(checkpointer=memory)
