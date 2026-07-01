"""
Reflector service for quality assurance and document improvement.
"""
from typing import Dict, Any, Optional
from app.services.llm import get_llm
from app.services.executor import ExecutionState
from app.schemas import ExecutionPlan
from app.utils import setup_logger, LLMError

logger = setup_logger(__name__)


class DocumentReview:
    """Represents a document review."""
    
    def __init__(self, is_complete: bool, improvements: Optional[list] = None):
        """
        Initialize review.
        
        Args:
            is_complete: Whether document is complete
            improvements: List of suggested improvements
        """
        self.is_complete = is_complete
        self.improvements = improvements or []


class Reflector:
    """Reviews and improves document completeness."""
    
    def __init__(self):
        """Initialize reflector with LLM."""
        self.llm = get_llm()
    
    def review_document(
        self,
        document_content: str,
        plan: ExecutionPlan,
        execution_state: ExecutionState,
    ) -> DocumentReview:
        """
        Review document for completeness and quality.
        
        Args:
            document_content: Current document content
            plan: Original execution plan
            execution_state: State from execution
            
        Returns:
            DocumentReview with assessment
        """
        logger.info("Starting document review")
        
        prompt = self._build_review_prompt(document_content, plan, execution_state)
        
        try:
            review_data = self.llm.generate_json(prompt, temperature=0.3)
            
            review = DocumentReview(
                is_complete=review_data.get("is_complete", False),
                improvements=review_data.get("improvements", []),
            )
            
            logger.info(
                f"Review complete. Complete: {review.is_complete}, "
                f"Improvements: {len(review.improvements)}"
            )
            return review
        
        except Exception as e:
            logger.warning(f"Review failed: {e}. Proceeding with document as-is.")
            return DocumentReview(is_complete=True, improvements=[])
    
    def _build_review_prompt(
        self,
        document_content: str,
        plan: ExecutionPlan,
        execution_state: ExecutionState,
    ) -> str:
        """Build review prompt."""
        return f"""
Review this document for completeness and quality:

GOAL: {plan.goal}

DOCUMENT:
{document_content[:1500]}

REVIEW CHECKLIST:
1. Does the document address the main goal?
2. Are all important points covered?
3. Is the structure logical and professional?
4. Are there any missing sections or recommendations?

Respond with JSON (raw JSON only, no markdown):
{{
  "is_complete": true/false,
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "summary": "Brief assessment"
}}

Return ONLY valid JSON."""
    
    def suggest_improvements(
        self,
        review: DocumentReview,
        document_content: str,
    ) -> Optional[str]:
        """
        Generate improved document content if needed.
        
        Args:
            review: Document review
            document_content: Original document content
            
        Returns:
            Improved content or None if no improvements needed
        """
        if review.is_complete or not review.improvements:
            logger.info("Document review: no improvements needed")
            return None
        
        logger.info(f"Generating improvements for {len(review.improvements)} items")
        
        improvements_text = "\n".join(f"- {imp}" for imp in review.improvements)
        
        prompt = f"""
Based on these improvement suggestions, enhance the document:

SUGGESTIONS:
{improvements_text}

ORIGINAL DOCUMENT:
{document_content}

Provide an IMPROVED VERSION of the document that addresses all suggestions.
Keep the same structure but enhance completeness and quality."""
        
        try:
            improved = self.llm.generate_text(prompt, temperature=0.5)
            logger.info("Improvements generated successfully")
            return improved
        
        except Exception as e:
            logger.error(f"Failed to generate improvements: {e}")
            return None


def get_reflector() -> Reflector:
    """Factory function to get Reflector instance."""
    return Reflector()
