"""
Planner service for generating task plans from user requests.
"""
from typing import Dict, Any
from app.services.llm import get_llm
from app.schemas import ExecutionPlan, TaskDefinition
from app.utils import setup_logger, LLMError

logger = setup_logger(__name__)


class Planner:
    """Plans tasks based on user requests."""
    
    def __init__(self):
        """Initialize planner with LLM instance."""
        self.llm = get_llm()
    
    def create_plan(self, request: str) -> ExecutionPlan:
        """
        Create an execution plan for the given request.
        
        Args:
            request: User's request
            
        Returns:
            ExecutionPlan with tasks and assumptions
            
        Raises:
            LLMError: If planning fails
        """
        logger.info(f"Creating plan for request: {request[:100]}")
        
        prompt = self._build_planning_prompt(request)
        
        try:
            plan_data = self.llm.generate_json(prompt, temperature=0.3)

            if plan_data is None:
                raise ValueError("LLM returned no JSON")

            if not isinstance(plan_data, dict):
                raise ValueError(f"Expected dict from generate_json(), got {type(plan_data).__name__}")
            plan = self._validate_plan(plan_data)
            logger.info(f"Plan created with {len(plan.tasks)} tasks")
            
            return plan
        
        except Exception as e:
            logger.error(f"Planning failed: {e}")
            raise LLMError(f"Failed to create execution plan: {str(e)}") from e
    
    def _build_planning_prompt(self, request: str) -> str:
        """Build the prompt for planning."""
        return f"""
You are an expert project planner. Analyze the following request and create a detailed execution plan.

REQUEST: {request}

Respond with JSON (no markdown, raw JSON only) with this exact structure:
{{
  "goal": "Clear statement of what needs to be accomplished",
  "assumptions": [
    "Assumption 1",
    "Assumption 2"
  ],
  "tasks": [
    {{
      "id": 1,
      "title": "Task title",
      "description": "What should be done",
      "tool": "llm",
      "dependencies": []
    }}
  ]
}}

IMPORTANT:
1. Create 3-5 realistic, sequential tasks
2. Each task must be actionable and clear
3. Document assumptions about the request
4. Use "llm" as the tool for all tasks
5. Return ONLY valid JSON, no other text
"""
    
    def _validate_plan(self, plan_data: Dict[str, Any]) -> ExecutionPlan:
        """Validate and construct ExecutionPlan from LLM response."""
        try:
            if plan_data is None:
                raise ValueError("plan_data is None")

            if not isinstance(plan_data, dict):
                raise ValueError(f"plan_data must be dict, got {type(plan_data).__name__}")

            goal = plan_data.get("goal", "Execute requested task")
            assumptions = plan_data.get("assumptions", [])
            tasks_data = plan_data.get("tasks", [])
            
            if not tasks_data:
                raise ValueError("No tasks in plan")
            tasks = []
            for task_data in tasks_data:
                task = TaskDefinition(
                    id=task_data.get("id", len(tasks) + 1),
                    title=task_data.get("title", f"Task {len(tasks) + 1}"),
                    description=task_data.get("description"),
                    tool=task_data.get("tool", "llm"),
                    dependencies=task_data.get("dependencies", []),
                )
                tasks.append(task)
            
            return ExecutionPlan(
                goal=goal,
                assumptions=assumptions,
                tasks=tasks,
            )
        
        except Exception as e:
            logger.error(f"Plan validation failed: {e}")
            raise ValueError(f"Invalid plan structure: {str(e)}") from e


def get_planner() -> Planner:
    """Factory function to get Planner instance."""
    return Planner()
