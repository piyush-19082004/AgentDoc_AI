"""
Agent endpoint for autonomous AI agent.
"""
from fastapi import APIRouter, HTTPException, status
import logging
import traceback
import time

from app.schemas import AgentRequest, AgentResponse, ExecutionPlan, TaskDefinition
from app.services.planner import get_planner
from app.services.executor import get_executor
from app.services.reflector import get_reflector
from app.services.document_generator import create_document_from_content
from app.config import MAX_EXECUTION_TIME
from app.utils import InvalidRequestError, LLMError

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/agent", response_model=AgentResponse)
async def agent_endpoint(request: AgentRequest) -> AgentResponse:
    """
    Autonomous AI agent endpoint.
    
    Accepts a request, plans tasks, executes them, and generates a document.
    
    Args:
        request: AgentRequest with user's request
        
    Returns:
        AgentResponse with execution results
        
    Raises:
        HTTPException: On validation or execution errors
    """
    try:
        if not request.request or not request.request.strip():
            raise InvalidRequestError("Request cannot be empty")
        
        logger.info(f"Processing agent request: {request.request[:100]}")
        start_time = time.time()
        planner = get_planner()
        execution_plan = planner.create_plan(request.request)
        logger.info(f"Plan created with {len(execution_plan.tasks)} tasks")
        executor = get_executor()
        execution_state = executor.execute_plan(execution_plan)
        logger.info(f"Execution completed with {len(execution_state.completed_tasks)} tasks")
        _ensure_within_timeout(start_time)
        document_content = _generate_document_content(
            request.request,
            execution_plan,
            execution_state,
        )
        reflector = get_reflector()
        review = reflector.review_document(document_content, execution_plan, execution_state)
        if not review.is_complete and review.improvements:
            improved = reflector.suggest_improvements(review, document_content)
            if improved:
                document_content = improved

            _ensure_within_timeout(start_time)
        title = f"Agent Report: {request.request[:50]}"
        filename = f"agent_report_{_generate_filename_timestamp()}"
        docx_path = create_document_from_content(
            title=title,
            subtitle="Autonomous AI Agent Generated Report",
            goal=execution_plan.goal,
            assumptions=execution_plan.assumptions,
            content=document_content,
            filename=filename,
        )
        completed_count = sum(
            1 for task in execution_state.completed_tasks
            if task.status == "completed"
        )
        total_count = len(execution_state.completed_tasks)

        response = AgentResponse(
            success=completed_count > 0,
            execution_plan=execution_plan,
            completed_tasks=execution_state.completed_tasks,
            assumptions=execution_plan.assumptions,
            docx_file=docx_path,
            summary=(
                _generate_summary(request.request, execution_plan, execution_state)
                + (
                    " Completed with warnings due to one or more failed tasks."
                    if completed_count < total_count
                    else ""
                )
            ),
        )
        
        logger.info("Agent request processed successfully")
        return response
    
    except InvalidRequestError as e:
        logger.error(f"Invalid request: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    
    except LLMError as e:
        logger.error(f"LLM error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"LLM service error: {str(e)}",
        )
    
    except Exception as e:
        logger.error(f"Unexpected error: {e}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}",
        )


def _ensure_within_timeout(start_time: float) -> None:
    """Raise if the request execution exceeds the configured maximum time."""
    elapsed = time.time() - start_time
    if elapsed > MAX_EXECUTION_TIME:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=(
                "Agent request exceeded the maximum execution time "
                f"of {MAX_EXECUTION_TIME} seconds."
            ),
        )


def _generate_document_content(
    request: str,
    execution_plan: ExecutionPlan,
    execution_state,
) -> str:
    """Generate document content from execution results."""
    content = f"""
EXECUTIVE SUMMARY
{request}

OBJECTIVE
{execution_plan.goal}

KEY ASSUMPTIONS
"""
    for assumption in execution_plan.assumptions:
        content += f"\n• {assumption}"
    
    content += "\n\nEXECUTION SUMMARY\n"
    for task in execution_state.completed_tasks:
        status = "✓ Completed" if task.status == "completed" else "✗ Failed"
        content += f"\n{status}: {task.title}\n"
        if task.output:
            output_preview = str(task.output)[:300]
            content += f"Output: {output_preview}\n"
    
    content += "\n\nRECOMMENDATIONS\n"
    content += "Based on the analysis conducted, the following are recommended next steps:\n"
    content += "• Review the findings from each executed task\n"
    content += "• Implement suggestions outlined in the task outputs\n"
    content += "• Monitor progress and adjust as needed\n"

    content += "\nCONCLUSION\n"
    content += "The generated document summarizes the agent's findings and provides a structured path for follow-up work. "
    content += "Use the task results and recommendations as a baseline for continuing the project.\n"
    
    return content


def _generate_summary(
    request: str,
    execution_plan: ExecutionPlan,
    execution_state,
) -> str:
    """Generate summary of execution."""
    completed = len([t for t in execution_state.completed_tasks if t.status == "completed"])
    total = len(execution_state.completed_tasks)
    
    return (
        f"Successfully processed request: '{request[:60]}...'. "
        f"Executed {total} tasks ({completed} completed). "
        f"Generated professional document with findings and recommendations."
    )


def _generate_filename_timestamp() -> str:
    """Generate timestamp for filename."""
    from datetime import datetime
    return datetime.now().strftime("%Y%m%d_%H%M%S")
