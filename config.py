import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama

load_dotenv()

# ── API Keys ──────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

# ── Database URLs (set these in your .env file) ──────────────
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:password@localhost:5432/smartinventory"
)
V_DATABASE_URL = os.getenv(
    "V_DATABASE_URL", "postgresql://postgres:password@localhost:5432/vector_db"
)

# ── Shop Configuration ───────────────────────────────────────
SHOP_KEEPER_SHOP_TYPE = "Auto_Parts_Shop"
LANGUAGE_PREFER = "Hindi"

# ── AI Model Selection ───────────────────────────────────────
# Uncomment ONE of the following LLM options:

# Option 1: Google Gemini (default — requires GOOGLE_API_KEY)
GLOBAL_LLM = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)

# Option 2: Groq cloud (fast — requires GROQ_API_KEY)
# GLOBAL_LLM = ChatGroq(model="gemma2-9b-it", temperature=0, api_key=GROQ_API_KEY)

# Option 3: Ollama local (no API key needed, but requires Ollama running)
# GLOBAL_LLM = ChatOllama(temperature=0, model="llama3.2", base_url=OLLAMA_URL)

# ── Embedding Model ──────────────────────────────────────────
EMBEDDING_MODEL = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# ── Document Processing ──────────────────────────────────────
DOCUMENTS_DIR = "./documents"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
