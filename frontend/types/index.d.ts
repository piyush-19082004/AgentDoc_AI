export interface TaskDefinition {
  id: number
  title: string
  description?: string
  tool: string
  dependencies: number[]
}

export interface ExecutionPlan {
  goal: string
  assumptions: string[]
  tasks: TaskDefinition[]
}

export interface TaskResult {
  task_id: number
  title: string
  status: string
  output?: string
  error?: string | null
  timestamp?: string
}

export interface AgentResponse {
  success: boolean
  execution_plan?: ExecutionPlan
  completed_tasks?: TaskResult[]
  assumptions?: string[]
  docx_file?: string
  download_url?: string
  summary?: string
  error?: string | null
}

export interface HistoryItem {
  id: string
  createdAt: string
  prompt: string
  result: AgentResponse
}
