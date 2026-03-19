"""
AI Agent proxy routes — forwards requests to the AI backend service.
Also includes the extract-products endpoint for bill image OCR.
"""
import os
import json
import httpx
from fastapi import APIRouter, UploadFile, File, Query, HTTPException

router = APIRouter()

AI_BACKEND_URL = os.environ.get("AI_BACKEND_URL", "http://localhost:8001")


# ─── SQL Agent Chat ──────────────────────────────────────────
@router.post("/ai/sql/")
async def sql_agent_chat(prompt: str = Query(...)):
    """Proxy the user's natural-language prompt to the SQL agent."""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{AI_BACKEND_URL}/agent/execute",
                json={"question": prompt, "agent_type": "sql"},
            )
            resp.raise_for_status()
            data = resp.json()

        # The AI backend returns {"response": ...}
        response = data.get("response", "")

        # If the response is a string, parse it for structured data
        if isinstance(response, str):
            return {"answer": response, "query": None, "columns": None, "data": None, "error": None}

        # If response is a dict with structured output
        if isinstance(response, dict):
            return {
                "answer": response.get("answer", response.get("insight", str(response))),
                "query": response.get("sql_query", None),
                "columns": response.get("columns", None),
                "data": response.get("data", None),
                "error": response.get("error", None),
            }

        return {"answer": str(response), "query": None, "columns": None, "data": None, "error": None}

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="AI backend is not available")
    except Exception as e:
        return {"answer": None, "query": None, "columns": None, "data": None, "error": str(e)}


# ─── RAG Agent Chat ──────────────────────────────────────────
@router.post("/ai/rag/")
async def rag_agent_chat(prompt: str = Query(...)):
    """Proxy the user's question to the RAG agent."""
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{AI_BACKEND_URL}/agent/execute",
                json={"question": prompt, "agent_type": "rag"},
            )
            resp.raise_for_status()
            data = resp.json()

        response = data.get("response", "")
        if isinstance(response, list):
            # RAG returns list of message contents
            return {"answer": response[-1] if response else "No response.", "all_messages": response}
        return {"answer": str(response)}

    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="AI backend is not available")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Extract Products from Bill Image ────────────────────────
@router.post("/extract-products")
async def extract_products(image: UploadFile = File(...)):
    """
    Use Gemini Vision to extract product names and quantities
    from a handwritten Indian bill/invoice image.
    """
    try:
        import google.generativeai as genai

        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not configured")

        genai.configure(api_key=api_key)

        image_bytes = await image.read()
        mime_type = image.content_type or "image/jpeg"

        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = """Analyze this bill/invoice image. Extract all products with their quantities.
Return ONLY a valid JSON object in this exact format:
{"products": [{"product_name": "Product Name", "quantity": 1}, ...]}

Rules:
- product_name should be capitalized properly
- quantity should be an integer
- If quantity is not visible, default to 1
- Return ONLY the JSON, no markdown, no explanation"""

        response = model.generate_content([
            prompt,
            {"mime_type": mime_type, "data": image_bytes},
        ])

        text = response.text.strip()
        # Clean up markdown code blocks if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

        result = json.loads(text)
        return result

    except json.JSONDecodeError:
        return {"products": [], "error": "Failed to parse AI response"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
