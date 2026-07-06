"""
Utility functions for logging, JSON parsing, and error handling.
"""
import json
import logging
from typing import Any, Dict, Optional
from datetime import datetime

def setup_logger(name: str) -> logging.Logger:
    """Set up a logger with consistent formatting."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


logger = setup_logger(__name__)


def safe_json_parse(content: str, default: Optional[Dict] = None) -> Dict[str, Any]:
    """
    Safely parse JSON, handling malformed input gracefully.
    
    Args:
        content: JSON string to parse
        default: Default value if parsing fails
        
    Returns:
        Parsed dictionary or default
    """
    if default is None:
        default = {}
    
    try:
        if "```json" in content:
            start = content.find("```json") + 7
            end = content.find("```", start)
            if end > start:
                content = content[start:end].strip()
        elif "```" in content:
            start = content.find("```") + 3
            end = content.find("```", start)
            if end > start:
                content = content[start:end].strip()
        
        return json.loads(content)
    except json.JSONDecodeError as e:
        logger.warning(f"JSON decode error: {e}. Content preview: {content[:200]}")
        return default
    except Exception as e:
        logger.error(f"Unexpected error parsing JSON: {e}")
        return default


def format_timestamp() -> str:
    """Get current timestamp in ISO format."""
    return datetime.utcnow().isoformat() + "Z"


def sanitize_filename(filename: str) -> str:
    """Remove invalid characters from filename."""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, "_")
    return filename


class TimeoutError(Exception):
    """Custom timeout exception."""
    pass


class InvalidRequestError(Exception):
    """Custom invalid request exception."""
    pass


class LLMError(Exception):
    """Custom LLM error exception."""
    pass
