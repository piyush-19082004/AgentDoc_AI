"""
Download endpoint to serve generated DOCX files safely.
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from app.config import OUTPUT_DIR

router = APIRouter()


@router.get("/download/{filename}")
def download_file(filename: str):
    """Return the requested DOCX file as an attachment.

    Only serves files from the configured `OUTPUT_DIR` (or its fallbacks).
    """
    safe_name = Path(filename).name
    file_path = OUTPUT_DIR / safe_name
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=str(file_path),
        media_type=(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ),
        filename=safe_name,
    )
