# Autonomous AI Agent

A production-quality autonomous AI agent built with FastAPI and Google Gemini, designed to understand requests, create execution plans, run tasks sequentially, and generate professional documentation.

## Architecture Overview

```
User Request
    ↓
┌─────────────────────────────────────┐
│ Planner (LLM)                       │
│ - Analyzes request                  │
│ - Creates task list                 │
│ - Identifies assumptions            │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Executor (Sequential)               │
│ - Runs tasks one by one             │
│ - Maintains execution state         │
│ - Passes outputs to next tasks      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Document Generator                  │
│ - Creates initial content           │
│ - Professional formatting           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Reflector (Quality Check)           │
│ - Reviews completeness              │
│ - Suggests improvements             │
│ - Updates document if needed        │
└─────────────────────────────────────┘
    ↓
Response with DOCX file
```

## Project Structure

```
project/
├── app/
│   ├── __init__.py                 # App initialization
│   ├── main.py                     # FastAPI application
│   ├── config.py                   # Configuration & env vars
│   ├── schemas.py                  # Pydantic models
│   ├── utils.py                    # Utilities & logging
│   ├── routes/
│   │   ├── __init__.py
│   │   └── agent.py                # POST /agent endpoint
│   └── services/
│       ├── __init__.py
│       ├── llm.py                  # Gemini API integration
│       ├── planner.py              # Task planning
│       ├── executor.py             # Task execution
│       ├── reflector.py            # Quality assurance
│       └── document_generator.py   # DOCX generation
├── outputs/                        # Generated DOCX files
├── requirements.txt                # Dependencies
├── .env.example                    # Environment template
└── README.md                       # This file
```

## Key Components

### 1. **Planner** (`services/planner.py`)
- Accepts user request
- Calls Gemini to create structured task plan
- Parses JSON response safely
- Returns `ExecutionPlan` with goal, assumptions, and tasks

**Example Plan Output:**
```json
{
  "goal": "Create meeting minutes",
  "assumptions": [
    "Meeting was a product launch discussion",
    "Standard business context"
  ],
  "tasks": [
    {
      "id": 1,
      "title": "Analyze meeting context",
      "description": "Understand the meeting topic",
      "tool": "llm",
      "dependencies": []
    }
  ]
}
```

### 2. **Executor** (`services/executor.py`)
- Runs tasks sequentially
- Maintains execution state (outputs, results)
- Passes previous task outputs to dependent tasks
- Continues even if a task fails
- Stores all outputs for reflection and documentation

### 3. **Reflector** (`services/reflector.py`)
- Reviews generated document for completeness
- Identifies missing sections or improvements
- Suggests enhancements
- Optionally regenerates document with improvements
- Ensures quality before export

### 4. **Document Generator** (`services/document_generator.py`)
- Creates professional DOCX files using `python-docx`
- Includes:
  - Formatted title and subtitle
  - Goal and assumptions
  - Executive summary
  - Task execution details
  - Recommendations
  - Proper styling and formatting
  - Footer with timestamp

### 5. **LLM Service** (`services/llm.py`)
- Wraps Google Gemini API
- Handles authentication
- Supports text and JSON generation
- Safe JSON parsing with fallback
- Error handling and logging

## Response Model

```json
{
  "success": true,
  "execution_plan": {
    "goal": "...",
    "assumptions": ["..."],
    "tasks": [...]
  },
  "completed_tasks": [
    {
      "task_id": 1,
      "title": "Task Name",
      "status": "completed",
      "output": "Task output content",
      "error": null,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "assumptions": ["..."],
  "docx_file": "/path/to/outputs/report.docx",
  "summary": "Successfully processed...",
  "error": null
}
```

## Setup & Installation

### Prerequisites
- Python 3.9+
- Google Gemini API key (free tier available)

### Installation

1. **Clone/Extract Project**
```bash
cd project
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

If your account requires a different model, replace `gemini-flash-latest` with one from
the Gemini model list for your API key.
```

### Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key or use existing
4. Copy key to `.env` file

## Running the Application

### Development Mode
```bash
python -m app.main
```

Server starts at `http://localhost:8000`

### Production Mode
```bash
ENVIRONMENT=production DEBUG=false uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### 1. Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "Autonomous AI Agent",
  "version": "1.0.0"
}
```

### 2. Agent Endpoint
```bash
POST /agent
Content-Type: application/json

{
  "request": "Your request here"
}
```

Returns: `AgentResponse` with execution plan, results, and DOCX file path

## Usage Examples

### Example 1: Simple Request

```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{
    "request": "Create meeting minutes for a product launch discussion."
  }'
```

**Response includes:**
- Execution plan with 3-4 tasks
- Task results
- Professional DOCX document
- Summary of execution

### Example 2: Complex Request

```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{
    "request": "I need a project proposal for an AI customer support chatbot for a healthcare company. Include assumptions, risks, milestones, budget estimates, implementation timeline, and executive summary."
  }'
```

**Response includes:**
- Comprehensive execution plan (5-6 tasks)
- Detailed task outputs
- Complete DOCX with all sections
- Professional recommendations

### Example Response Structure

```json
{
  "success": true,
  "execution_plan": {
    "goal": "Create a customer support chatbot proposal for healthcare",
    "assumptions": [
      "The chatbot will support patient inquiries and appointment scheduling",
      "Budget estimates are for a mid-sized healthcare provider"
    ],
    "tasks": [
      {"id": 1, "title": "Define proposal scope", "tool": "llm"}
    ]
  },
  "completed_tasks": [
    {
      "task_id": 1,
      "title": "Define proposal scope",
      "status": "completed",
      "output": "Drafted scope for AI customer support chatbot...",
      "error": null
    }
  ],
  "assumptions": ["The chatbot will support patient inquiries..."],
  "docx_file": "outputs/agent_report_20260630_121500.docx",
  "summary": "Successfully processed request..."
}
```

## How It Works: Step by Step

### 1. Planning Phase
```
POST /agent → {"request": "..."}
        ↓
   Gemini LLM creates plan
        ↓
   Returns ExecutionPlan JSON
```

### 2. Execution Phase
```
For each task in sequence:
  - Build context from previous outputs
  - Call Gemini to execute task
  - Store output in execution state
  - Proceed to next task
```

### 3. Reflection Phase
```
After all tasks complete:
  - Ask Gemini: "Is document complete?"
  - If improvements needed: regenerate content
  - Otherwise: proceed to export
```

### 4. Document Generation
```
Create DOCX with:
  - Title and metadata
  - Goal and assumptions
  - Executive summary
  - Task results
  - Recommendations
  - Professional formatting
```

### 5. Response
```
Return:
  - execution_plan (what was planned)
  - completed_tasks (what was done)
  - assumptions (what we assumed)
  - docx_file (path to output)
  - summary (execution summary)
```

## Error Handling

The application handles:
- **Invalid JSON**: Safe parsing with fallbacks
- **Empty requests**: Validation before processing
- **Gemini API failures**: Clear error messages
- **Document generation failures**: HTTP 500 with details
- **Network timeouts**: Configurable via `.env`

**Error Response Example:**
```json
{
  "detail": "LLM service error: API key is invalid"
}
```

## Configuration

### Environment Variables

```env
# Server
ENVIRONMENT=development           # development or production
DEBUG=true                        # Enable debug mode
API_HOST=0.0.0.0                 # Server host
API_PORT=8000                    # Server port

# LLM
GEMINI_API_KEY=...               # Your API key (REQUIRED)
GEMINI_MODEL=gemini-flash-latest  # Model to use (use a supported Gemini Free model)

# Timeouts
LLM_TIMEOUT=30                   # LLM call timeout (seconds)
MAX_EXECUTION_TIME=300           # Total execution timeout (seconds)

# Logging
LOG_LEVEL=INFO                   # DEBUG, INFO, WARNING, ERROR
```

## Testing

### Manual Testing

1. **Start the server:**
```bash
python -m app.main
```

2. **Test health endpoint:**
```bash
curl http://localhost:8000/health
```

3. **Test agent with simple request:**
```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{"request": "Create meeting minutes for a product launch discussion."}'
```

4. **Check generated DOCX:**
- Look in `outputs/` folder
- DOCX filename: `agent_report_YYYYMMDD_HHMMSS.docx`

### Integration Testing

```bash
# Easy scenario
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{"request": "Create meeting minutes for a product launch discussion."}'

# Complex scenario
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{"request": "I need a project proposal for an AI customer support chatbot for a healthcare company. Include assumptions, risks, milestones, budget estimates, implementation timeline, and executive summary."}'
```

## Performance Characteristics

- **Planning**: ~2-3 seconds (LLM call)
- **Per-task execution**: ~2-3 seconds
- **Reflection**: ~1-2 seconds
- **Document generation**: <1 second
- **Total execution**: Typically 15-30 seconds for 4-6 tasks

## Design Decisions

### Why This Architecture?

1. **Separation of Concerns**
   - Each service has a single responsibility
   - Easy to test and modify
   - Clean dependency injection

2. **Sequential Execution**
   - Predictable behavior
   - Simple state management
   - Easy to debug

3. **Reflection Step**
   - Ensures quality output
   - Self-improvement capability
   - Demonstrates advanced AI patterns

4. **Professional Documentation**
   - DOCX format is widely supported
   - Easy to share and modify
   - Professional appearance

### Trade-offs

- **Sequential vs Parallel**: Sequential is simpler for a 60-minute interview
- **Single LLM**: Gemini is fast and free tier available
- **In-memory state**: Good enough for this scale; would use database in production

## Production Deployment

For production deployment:

1. **Environment**
   - Set `ENVIRONMENT=production`
   - Set `DEBUG=false`

2. **Database**
   - Store execution history
   - Track DOCX files
   - Add audit logging

3. **Scaling**
   - Use async tasks for long executions
   - Add request queuing
   - Implement rate limiting

4. **Monitoring**
   - Add Prometheus metrics
   - Track API latency
   - Monitor LLM API usage

5. **Security**
   - Validate all inputs
   - Rate limit by IP
   - Add API authentication

## Demo Scenarios

### Scenario 1: Meeting Minutes (Easy)
```
Request: "Create meeting minutes for a product launch discussion."

Expected plan:
1. Analyze meeting context
2. Extract key discussion points
3. Identify action items
4. Format as professional minutes

Time: ~10-15 seconds
Result: Professional minutes DOCX
```

### Scenario 2: Project Proposal (Complex)
```
Request: "I need a project proposal for an AI customer support chatbot for a healthcare company. Include assumptions, risks, milestones, budget estimates, implementation timeline, and executive summary."

Expected plan:
1. Define project scope and objectives
2. Identify assumptions and constraints
3. Analyze risks and mitigation
4. Create implementation timeline
5. Estimate budget and resources
6. Write executive summary

Time: ~20-30 seconds
Result: Comprehensive proposal DOCX
```

## Troubleshooting

### Issue: "GEMINI_API_KEY not configured"
**Solution**: Ensure `.env` file has `GEMINI_API_KEY` set

### Issue: Empty response from Gemini
**Solution**: Check API key validity and rate limits

### Issue: "Failed to save document"
**Solution**: Ensure `outputs/` directory has write permissions

### Issue: Import errors
**Solution**: 
```bash
pip install -r requirements.txt
```

## Code Quality

- **Type Hints**: Full type annotations throughout
- **Docstrings**: All functions documented
- **Logging**: Comprehensive logging at all levels
- **Error Handling**: Try-catch with meaningful errors
- **Modularity**: Clean separation of concerns

## Future Enhancements

1. **Multi-LLM Support**
   - Add OpenAI, Claude, etc.
   - LLM provider selection

2. **Extended Tools**
   - Web search capability
   - Database queries
   - File I/O operations

3. **Persistent Storage**
   - Save execution history
   - Track metrics
   - Audit logging

4. **Async Execution**
   - Background job processing
   - WebSocket updates
   - Real-time progress tracking

5. **Advanced Reflection**
   - Multiple reflection rounds
   - Scoring and ranking
   - Human-in-the-loop review

## License

This project is provided as-is for interview demonstration purposes.

## Support

For issues or questions:
1. Check error messages in logs
2. Verify `.env` configuration
3. Ensure Gemini API key is valid
4. Check network connectivity
