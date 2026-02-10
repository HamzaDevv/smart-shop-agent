# Smart Shop AI Assistant 🛒🤖

An AI-powered business assistant that helps shop owners manage documents and query databases using natural language. Upload invoices, bills, and receipts — then ask questions in plain English.

![RAG Agent Architecture](rag_agent_architecture.png)
![SQL Agent Architecture](sql_agent_architecture.png)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📄 Document Search (RAG Agent)** | Upload PDFs, DOCX, images — ask questions and get answers with citations |
| **📊 Database Query (SQL Agent)** | Ask business questions in English, AI generates & runs SQL queries |
| **🔀 Smart Routing** | Automatically detects whether to search documents or query the database |
| **🌐 Web Fallback** | Falls back to web search (via Tavily) if documents don't have the answer |
| **💬 Chat Interface** | Streamlit-based UI with file upload, agent selection, and real-time chat |

---

## 🏗️ Architecture

The system uses **two LangGraph agents** coordinated through a Streamlit frontend:

```
User Question
     │
     ├── RAG Agent ──→ Document chunks (pgvector) ──→ LLM ──→ Answer + Citations
     │                      └── Web Search fallback
     │
     └── SQL Agent ──→ Schema inspection ──→ SQL generation ──→ Execute ──→ Answer
```

---

## 📁 Project Structure

```
smart_shop_ai/
├── app.py                          # Streamlit web interface
├── main.py                         # FastAPI backend server
├── config.py                       # AI model & database settings
├── .env.example                    # Environment variable template
├── requirements.txt                # Python dependencies
├── pyproject.toml                  # Project metadata (uv/pip)
│
├── agents/
│   ├── rag_agent/                  # Document search agent
│   │   ├── langgraph_agent.py      # RAG workflow graph
│   │   ├── nodes.py                # Processing nodes (retrieve, grade, generate)
│   │   ├── tools.py                # Vector search & web search tools
│   │   └── shared.py               # Agent state definition
│   │
│   └── sql_agent/                  # Database query agent
│       ├── langgraph_agent.py      # SQL workflow graph
│       ├── nodes.py                # Query nodes (generate, execute, validate)
│       ├── tools.py                # Database connection tools
│       └── shared.py               # Agent state definition
│
├── utils/
│   ├── ingestor.py                 # Document text extraction (PDF, DOCX, images)
│   ├── chunker.py                  # Semantic text chunking
│   ├── db_store.py                 # PostgreSQL vector storage
│   └── main.py                     # Document processing pipeline
│
├── documents/                      # Place your business documents here
├── synthetic_Data/
│   └── data_filling.py             # Seed the database with sample data
│
├── rag_agent_architecture.png      # Architecture diagram
└── sql_agent_architecture.png      # Architecture diagram
```

---

## 🚀 Prerequisites

Before you begin, make sure you have:

- **Python 3.12+** installed ([download](https://www.python.org/downloads/))
- **PostgreSQL** running locally with the **pgvector** extension
- At least one AI API key (Google Gemini recommended)

### API Keys You'll Need

| Service | Purpose | Get it from |
|---------|---------|-------------|
| **Google Gemini** (required) | Primary LLM + embeddings | [Google AI Studio](https://aistudio.google.com/apikey) |
| **Tavily** (recommended) | Web search fallback | [tavily.com](https://tavily.com) |
| **Groq** (optional) | Fast inference alternative | [console.groq.com](https://console.groq.com/keys) |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/smart-shop-ai.git
cd smart-shop-ai
```

### 2. Create a Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up PostgreSQL

You need **two databases**: one for business data and one for document vectors.

```bash
# Connect to PostgreSQL
psql -U postgres

# Create databases
CREATE DATABASE smartinventory;
CREATE DATABASE vector_db;

# Enable pgvector extension in the vector database
\c vector_db
CREATE EXTENSION IF NOT EXISTS vector;

\q
```

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
GOOGLE_API_KEY="your-actual-google-api-key"
GROQ_API_KEY="your-actual-groq-api-key"          # optional
TAVILY_API_KEY="your-actual-tavily-api-key"
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/smartinventory"
V_DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/vector_db"
```

### 6. Seed the Database with Sample Data

```bash
python synthetic_Data/data_filling.py
```

This creates sample tables (customers, products, sales, vendors, etc.) with test data.

---

## ▶️ Running the App

### Option A: Streamlit UI (Recommended)

```bash
streamlit run app.py
```

Open **http://localhost:8501** in your browser.

### Option B: FastAPI Server

```bash
uvicorn main:app --reload
```

API available at **http://localhost:8000** — docs at `/docs`.

---

## 💬 Usage Examples

### Document Questions (RAG Agent)
Upload invoices/bills via the sidebar, then ask:
- *"What items are in the quotation from CM Lube India?"*
- *"How much did the laptop cost?"*
- *"Show me all vendor contact details from uploaded bills"*

### Database Questions (SQL Agent)
- *"What were our total sales last month?"*
- *"Which products are running low in stock?"*
- *"Show me all unpaid credit (udhar) sales"*
- *"Who are our top 5 customers by purchase amount?"*

---

## 🔧 Configuration

### Switching AI Models

Edit `config.py` to change the LLM:

```python
# Google Gemini (default)
GLOBAL_LLM = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)

# Groq (faster, requires GROQ_API_KEY)
# GLOBAL_LLM = ChatGroq(model="gemma2-9b-it", temperature=0, api_key=GROQ_API_KEY)

# Ollama (fully local, requires Ollama running)
# GLOBAL_LLM = ChatOllama(temperature=0, model="llama3.2", base_url=OLLAMA_URL)
```

---

## 🗄️ Database Schema

The SQL agent works with these tables:

| Table | Description |
|-------|-------------|
| `customers` | Customer names and phone numbers |
| `vendors` | Vendor/supplier information |
| `products` | Product catalog with buy/sell prices and stock |
| `sales_data` | Sales transactions |
| `purchase_data` | Purchase transactions from vendors |
| `sale_product` | Links sales to products (many-to-many) |
| `purchase_product` | Links purchases to products (many-to-many) |
| `profit_loss` | Profit/loss per sale |
| `udhar_sales` | Credit sales with payment due dates |
| `udhar_purchase` | Credit purchases with payment due dates |

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Make sure your venv is activated and run `pip install -r requirements.txt` |
| `psycopg2` install fails | Install `psycopg2-binary` instead, or install `libpq-dev` on Linux |
| Database connection error | Verify PostgreSQL is running and `.env` credentials are correct |
| pgvector extension error | Run `CREATE EXTENSION vector;` in the `vector_db` database |
| Slow responses | Switch to Groq model in `config.py` for faster inference |
| Document upload fails | Supported formats: PDF, DOCX, PPTX, JPG, PNG (max ~10 MB) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

**Made with ❤️ for small business owners who want to work smarter, not harder!**