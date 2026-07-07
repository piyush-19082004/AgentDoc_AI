"""
Main FastAPI application entry point.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import DEBUG, LOG_LEVEL
from app.routes.agent import router as agent_router
from app.routes.download import router as download_router
from app.config import BASE_DIR
from fastapi.staticfiles import StaticFiles
from app.utils import setup_logger

logger = setup_logger(__name__)
logging.getLogger().setLevel(LOG_LEVEL)

app = FastAPI(
    title="Autonomous AI Agent",
    description="An autonomous AI agent that plans, executes, and documents tasks",
    version="1.0.0",
    debug=DEBUG,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router, tags=["Agent"])
app.include_router(download_router, tags=["Downloads"])

# Serve a minimal frontend from /static
static_dir = BASE_DIR / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Autonomous AI Agent",
        "version": "1.0.0",
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Autonomous AI Agent API",
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "agent": "POST /agent",
        },
    }


if __name__ == "__main__":
    import uvicorn
    from app.config import API_HOST, API_PORT
    
    logger.info(f"Starting server on {API_HOST}:{API_PORT}")
    uvicorn.run(
        "app.main:app",
        host=API_HOST,
        port=API_PORT,
        reload=DEBUG,
    )
