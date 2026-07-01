"""
Executor service for running tasks sequentially.
"""
from typing import Dict, Any, List
from datetime import datetime
from app.services.llm import get_llm
from app.schemas import ExecutionPlan, TaskResult, TaskDefinition
from app.utils import setup_logger, LLMError

logger = setup_logger(__name__)


class ExecutionState:
    """Maintains execution state and task outputs."""
    
    def __init__(self):
        """Initialize execution state."""
        self.task_outputs: Dict[int, Any] = {}
        self.completed_tasks: List[TaskResult] = []
        self.failed: bool = False
        self.error: str = ""
    
    def store_output(self, task_id: int, output: Any) -> None:
        """Store output from a task."""
        self.task_outputs[task_id] = output
    
    def get_output(self, task_id: int) -> Any:
        """Retrieve output from a previous task."""
        return self.task_outputs.get(task_id)
    
    def get_all_outputs(self) -> Dict[int, Any]:
        """Get all stored outputs."""
        return self.task_outputs.copy()
    
    def add_completed_task(self, result: TaskResult) -> None:
        """Add a completed task to results."""
        self.completed_tasks.append(result)


class Executor:
    """Executes tasks sequentially."""
    
    def __init__(self):
        """Initialize executor with LLM instance."""
        self.llm = get_llm()
    
    def execute_plan(self, plan: ExecutionPlan) -> ExecutionState:
        """
        Execute all tasks in the plan sequentially.
        
        Args:
            plan: ExecutionPlan to execute
            
        Returns:
            ExecutionState with results
        """
        logger.info(f"Starting execution of plan with {len(plan.tasks)} tasks")
        state = ExecutionState()
        
        for task in plan.tasks:
            logger.info(f"Executing task {task.id}: {task.title}")
            result = self._execute_task(task, state, plan)
            state.add_completed_task(result)
            
            if result.status == "failed":
                logger.warning(f"Task {task.id} failed: {result.error}")
                state.failed = True
                state.error = result.error or "Task execution failed"
                # Continue execution instead of stopping
        
        logger.info(f"Execution complete. {len(state.completed_tasks)} tasks processed")
        return state
    
    def _execute_task(
        self,
        task: TaskDefinition,
        state: ExecutionState,
        plan: ExecutionPlan,
    ) -> TaskResult:
        """
        Execute a single task.
        
        Args:
            task: Task to execute
            state: Current execution state
            plan: Full plan (for context)
            
        Returns:
            TaskResult with output or error
        """
        try:
            if task.tool != "llm":
                return TaskResult(
                    task_id=task.id,
                    title=task.title,
                    status="failed",
                    output="",
                    error=f"Unknown tool: {task.tool}",
                )
            
            # Build context with previous outputs
            context = self._build_task_context(task, state, plan)
            
            # Execute LLM task
            output = self._execute_llm_task(task, context)
            
            # Store output for downstream tasks
            state.store_output(task.id, output)
            
            return TaskResult(
                task_id=task.id,
                title=task.title,
                status="completed",
                output=output,
            )
        
        except Exception as e:
            logger.error(f"Task {task.id} execution failed: {e}")
            return TaskResult(
                task_id=task.id,
                title=task.title,
                status="failed",
                output="",
                error=str(e),
            )
    
    def _build_task_context(
        self,
        task: TaskDefinition,
        state: ExecutionState,
        plan: ExecutionPlan,
    ) -> str:
        """Build context for task execution."""
        context = f"Overall Goal: {plan.goal}\n"
        context += f"Current Task: {task.title}\n"
        context += f"Task Description: {task.description or 'No description'}\n\n"
        
        # Include previous outputs
        if task.dependencies:
            context += "Previous Results:\n"
            for dep_id in task.dependencies:
                output = state.get_output(dep_id)
                if output:
                    output_str = str(output).replace("\n", " ")[:150]
                    context += f"- Task {dep_id}: {output_str}\n"
        
        return context
    
    def _execute_llm_task(self, task: TaskDefinition, context: str) -> str:
        """
        Execute a task using LLM.
        
        Args:
            task: Task definition
            context: Context for execution
            
        Returns:
            Task output
        """
        prompt = f"""{context}

Please complete this task. Provide a clear, concise response."""
        
        return self.llm.generate_text(
            prompt,
            temperature=0.4,
            max_tokens=1024,
        )


def get_executor() -> Executor:
    """Factory function to get Executor instance."""
    return Executor()
