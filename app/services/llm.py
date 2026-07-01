"""
LLM service for interacting with Groq API.
"""
import time
from typing import Any, Dict, Optional

from groq import Groq

from app.config import GROQ_API_KEY, GROQ_MODEL
from app.utils import setup_logger, safe_json_parse, LLMError

logger = setup_logger(__name__)


class GeminiLLM:
    """Interface to Groq API."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        """
        Initialize Groq client.

        Args:
            api_key: Groq API key (uses config if not provided)
            model: Model name (uses config if not provided)
        """
        self.api_key = api_key or GROQ_API_KEY
        self.model_name = model or GROQ_MODEL
        self.timeout = 60  # Default timeout, can be adjusted if needed

        if not self.api_key:
            raise LLMError("GROQ_API_KEY not configured")

        self.client = Groq(api_key=self.api_key)
        logger.info(f"Initialized Groq LLM: {self.model_name}")

    def generate_text(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Generate text using Groq.

        Args:
            prompt: Input prompt
            temperature: Creativity level (0-1)
            max_tokens: Maximum output tokens

        Returns:
            Generated text

        Raises:
            LLMError: If API call fails
        """
        logger.debug(f"Generating text with prompt length: {len(prompt)}")

        try:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature,
                max_completion_tokens=max_tokens,
            )
            if (
                not completion.choices
                or not hasattr(completion.choices[0], "message")
                or not getattr(completion.choices[0].message, "content", None)
            ):
                raise LLMError("Groq returned no content in completion choices")

            response_text = completion.choices[0].message.content
            logger.debug("LLM response generated")
            return response_text

        except Exception as e:
            error_msg = f"Groq API error: {str(e)}"
            logger.error(error_msg)
            raise LLMError(error_msg) from e

    def generate_json(
        self,
        prompt: str,
        temperature: float = 0.3,
        max_tokens: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Generate JSON response from Groq.

        Args:
            prompt: Input prompt
            temperature: Creativity level (lower for JSON)
            max_tokens: Maximum output tokens

        Returns:
            Parsed JSON dictionary

        Raises:
            LLMError: If JSON generation fails
        """
        try:
            json_prompt = (
                f"{prompt}\n\n"
                "Return ONLY valid JSON. No markdown, no code blocks, just raw JSON."
            )

            response_text = self.generate_text(
                json_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )

            if response_text is None:
                raise LLMError("Groq returned None while generating JSON")

            logger.info("Raw Groq response:")
            logger.info((response_text or "")[:1000])

            result = safe_json_parse(response_text or "")

            if result is None:
                raise LLMError(
                    f"Failed to parse JSON from response:\n{response_text[:500]}"
                )

            if not isinstance(result, dict):
                raise LLMError(
                    f"Expected JSON object, got {type(result).__name__}"
                )

            return result

        except Exception as e:
            error_msg = f"JSON generation error: {str(e)}"
            logger.error(error_msg)
            raise LLMError(error_msg) from e


def get_llm() -> GeminiLLM:
    """Factory function to get LLM instance."""
    return GeminiLLM()
