# main.py (project root) — AI Agent Backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.rag_agent.langgraph_agent import agent as rag_agent
from agents.sql_agent.langgraph_agent import agent as sql_agent
from agents.rag_agent.shared import AgentState as RagAgentState
from agents.sql_agent.shared import AgentState as SQLAgentState
from langchain_core.messages import HumanMessage

app = FastAPI(title="LangGraph Agent Hub")

# ─── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request Schema ──────────────────────────────────────────
class QueryInput(BaseModel):
    question: str
    agent_type: str  # "rag" or "sql"


# ─── Agent Execution ─────────────────────────────────────────
@app.post("/agent/execute")
def run_agent(query: QueryInput):
    user_message = HumanMessage(content=query.question)

    if query.agent_type == "rag":
        initial_state: RagAgentState = {
            "messages": user_message,
            "route": "rag",
            "rag": "",
            "web": "",
            "Rag_Citation": None,
            "Web_Citation": None,
        }  # type: ignore
        final_state = rag_agent.invoke(initial_state)
        return {"response": [msg.content for msg in final_state["messages"]]}

    elif query.agent_type == "sql":
        initial_state: SQLAgentState = {
            "question": query.question,
            "attempts": 0,
            "curr_question": "",
            "sql_query": "",
            "query_result": "",
            "relevance": False,
            "sql_error": [],
        }
        final_state = sql_agent.invoke(initial_state)

        # Return structured response for the BillDeck proxy
        result = final_state.get("query_result", "")
        sql_query = final_state.get("sql_query", "")

        return {
            "response": {
                "answer": str(result) if result else "No results found.",
                "sql_query": sql_query,
                "insight": str(result),
            }
        }

    else:
        return {"error": "Invalid agent_type. Use 'rag' or 'sql'."}


# ─── Health & Root ────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "LangGraph Agent API is running."}


@app.get("/health")
def health():
    return {"status": "ok"}
