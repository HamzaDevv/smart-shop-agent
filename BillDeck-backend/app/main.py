import os
from fastapi import FastAPI
from .database import Base, engine
from .routes import inventory, sales, purchase, udhaar, vendor, ai, customer, notification
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Dukaan Sahaayak API")

# CORS — allow frontend origins (local dev + Docker)
ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://frontend:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all DB tables on startup
Base.metadata.create_all(bind=engine)

# ─── Route Registration ──────────────────────────────────────
app.include_router(inventory.router, prefix="/api", tags=["Inventory"])
app.include_router(sales.router, prefix="/api", tags=["Sales"])
app.include_router(purchase.router, prefix="/api", tags=["Purchase"])
app.include_router(udhaar.router, prefix="/api", tags=["Udhaar"])
app.include_router(vendor.router, prefix="/api", tags=["Vendor"])
app.include_router(customer.router, prefix="/api", tags=["Customer"])
app.include_router(notification.router, prefix="/api", tags=["Notification"])
app.include_router(ai.router, prefix="/api", tags=["AI Agents"])


@app.get("/")
def root():
    return {"message": "Dukaan Sahaayak API is running."}


@app.get("/health")
def health():
    return {"status": "ok"}
