# Sample Requests and Responses

This document contains example requests and expected responses for testing the Autonomous AI Agent.

## Quick Start

### Start the server:
```bash
cd project
source venv/bin/activate
python -m app.main
```

Server will be available at `http://localhost:8000`

## Sample Request 1: Easy - Meeting Minutes

### Request
```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{
    "request": "Create meeting minutes for a product launch discussion."
  }'
```

### Expected Response Structure
```json
{
  "success": true,
  "execution_plan": {
    "goal": "Create comprehensive meeting minutes from a product launch discussion",
    "assumptions": [
      "This is a standard product launch meeting",
      "Key stakeholders were present",
      "Decisions were made during the meeting"
    ],
    "tasks": [
      {
        "id": 1,
        "title": "Analyze meeting context",
        "description": "Understand the meeting topic and purpose",
        "tool": "llm",
        "dependencies": []
      },
      {
        "id": 2,
        "title": "Extract key discussion points",
        "description": "Identify main topics discussed",
        "tool": "llm",
        "dependencies": [1]
      },
      {
        "id": 3,
        "title": "Identify action items",
        "description": "Extract action items with owners and deadlines",
        "tool": "llm",
        "dependencies": [2]
      },
      {
        "id": 4,
        "title": "Format professional minutes",
        "description": "Compile into professional meeting minutes",
        "tool": "llm",
        "dependencies": [3]
      }
    ]
  },
  "completed_tasks": [
    {
      "task_id": 1,
      "title": "Analyze meeting context",
      "status": "completed",
      "output": "This is a product launch meeting discussing go-to-market strategy...",
      "error": null,
      "timestamp": "2024-01-15T10:30:45.123456Z"
    },
    {
      "task_id": 2,
      "title": "Extract key discussion points",
      "status": "completed",
      "output": "Key points include: Product features, pricing strategy, market segmentation...",
      "error": null,
      "timestamp": "2024-01-15T10:30:48.456789Z"
    },
    {
      "task_id": 3,
      "title": "Identify action items",
      "status": "completed",
      "output": "Action items: Marketing team to prepare launch assets (John, due Jan 20)...",
      "error": null,
      "timestamp": "2024-01-15T10:30:51.789012Z"
    },
    {
      "task_id": 4,
      "title": "Format professional minutes",
      "status": "completed",
      "output": "Professional minutes formatted with all sections...",
      "error": null,
      "timestamp": "2024-01-15T10:30:54.012345Z"
    }
  ],
  "assumptions": [
    "This is a standard product launch meeting",
    "Key stakeholders were present",
    "Decisions were made during the meeting"
  ],
  "docx_file": "/Users/abcd/Desktop/Fluid/project/outputs/agent_report_20240115_103054.docx",
  "summary": "Successfully processed request: 'Create meeting minutes for a product launch discussion...'. Executed 4 tasks (4 completed). Generated professional document with findings and recommendations.",
  "error": null
}
```

### Expected Execution Time
- **Planning**: 2-3 seconds
- **Task 1-4 execution**: 2-3 seconds each = 8-12 seconds
- **Reflection**: 1-2 seconds
- **Document generation**: 1 second
- **Total**: ~15-20 seconds

### Generated Document
The DOCX file will contain:
- Title: "Agent Report: Create meeting minutes for a product launch discussion"
- Subtitle: "Autonomous AI Agent Generated Report"
- Document Information section with goal and assumptions
- Executive Summary
- Task Execution Details (all 4 tasks with outputs)
- Recommendations
- Timestamp footer

---

## Sample Request 2: Complex - Project Proposal

### Request
```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{
    "request": "I need a project proposal for an AI customer support chatbot for a healthcare company. Include assumptions, risks, milestones, budget estimates, implementation timeline, and executive summary."
  }'
```

### Expected Response Structure
```json
{
  "success": true,
  "execution_plan": {
    "goal": "Create a comprehensive project proposal for an AI customer support chatbot designed for healthcare industry",
    "assumptions": [
      "The healthcare company serves patients and/or healthcare providers",
      "Budget range is in the $50K-$500K range",
      "Implementation timeline is 3-6 months",
      "HIPAA compliance is required",
      "Integration with existing EHR systems needed"
    ],
    "tasks": [
      {
        "id": 1,
        "title": "Define project scope and objectives",
        "description": "Outline chatbot capabilities, target users, and success metrics",
        "tool": "llm",
        "dependencies": []
      },
      {
        "id": 2,
        "title": "Identify assumptions and constraints",
        "description": "Document key assumptions and technical constraints",
        "tool": "llm",
        "dependencies": [1]
      },
      {
        "id": 3,
        "title": "Analyze risks and mitigation strategies",
        "description": "Identify project risks and propose mitigation approaches",
        "tool": "llm",
        "dependencies": [2]
      },
      {
        "id": 4,
        "title": "Create implementation timeline",
        "description": "Develop project phases with milestones",
        "tool": "llm",
        "dependencies": [3]
      },
      {
        "id": 5,
        "title": "Estimate budget and resources",
        "description": "Calculate costs and identify required resources",
        "tool": "llm",
        "dependencies": [4]
      },
      {
        "id": 6,
        "title": "Write executive summary",
        "description": "Compile all information into executive summary",
        "tool": "llm",
        "dependencies": [5]
      }
    ]
  },
  "completed_tasks": [
    {
      "task_id": 1,
      "title": "Define project scope and objectives",
      "status": "completed",
      "output": "Project Scope: Build an AI-powered customer support chatbot for healthcare...",
      "error": null,
      "timestamp": "2024-01-15T11:00:05.123456Z"
    },
    {
      "task_id": 2,
      "title": "Identify assumptions and constraints",
      "status": "completed",
      "output": "Key Assumptions: HIPAA-compliant infrastructure required, Integration with Epic EHR...",
      "error": null,
      "timestamp": "2024-01-15T11:00:08.456789Z"
    },
    {
      "task_id": 3,
      "title": "Analyze risks and mitigation strategies",
      "status": "completed",
      "output": "Risk 1: Data Privacy - Mitigation: End-to-end encryption...",
      "error": null,
      "timestamp": "2024-01-15T11:00:11.789012Z"
    },
    {
      "task_id": 4,
      "title": "Create implementation timeline",
      "status": "completed",
      "output": "Phase 1 (Weeks 1-4): Requirements & Architecture, Phase 2 (Weeks 5-10): Development...",
      "error": null,
      "timestamp": "2024-01-15T11:00:14.012345Z"
    },
    {
      "task_id": 5,
      "title": "Estimate budget and resources",
      "status": "completed",
      "output": "Total Budget: $250,000, Team: 1 Project Manager, 2 ML Engineers, 1 Healthcare Consultant...",
      "error": null,
      "timestamp": "2024-01-15T11:00:17.345678Z"
    },
    {
      "task_id": 6,
      "title": "Write executive summary",
      "status": "completed",
      "output": "This proposal outlines a 6-month project to develop an HIPAA-compliant AI chatbot...",
      "error": null,
      "timestamp": "2024-01-15T11:00:20.678901Z"
    }
  ],
  "assumptions": [
    "The healthcare company serves patients and/or healthcare providers",
    "Budget range is in the $50K-$500K range",
    "Implementation timeline is 3-6 months",
    "HIPAA compliance is required",
    "Integration with existing EHR systems needed"
  ],
  "docx_file": "/Users/abcd/Desktop/Fluid/project/outputs/agent_report_20240115_110020.docx",
  "summary": "Successfully processed request: 'I need a project proposal for an AI customer support chatbot for a healthcare company...'. Executed 6 tasks (6 completed). Generated professional document with findings and recommendations.",
  "error": null
}
```

### Expected Execution Time
- **Planning**: 2-3 seconds
- **Task 1-6 execution**: 2-3 seconds each = 12-18 seconds
- **Reflection**: 2-3 seconds
- **Document generation**: 1 second
- **Total**: ~20-30 seconds

### Generated Document
The DOCX file will contain:
- Title: "Agent Report: I need a project proposal for an AI customer support chatbot..."
- Subtitle: "Autonomous AI Agent Generated Report"
- Document Information with goal and 5 assumptions
- Executive Summary
- Task Execution Details (all 6 tasks with full outputs)
- Comprehensive Recommendations for Healthcare Industry
- Professional formatting with tables if present
- Timestamp footer

---

## Error Handling Examples

### Example 1: Empty Request
```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{"request": ""}'
```

**Response:**
```json
{
  "detail": "Request cannot be empty"
}
```
HTTP Status: 400 Bad Request

### Example 2: Invalid JSON
```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{invalid json}'
```

**Response:**
```json
{
  "detail": "Invalid request body"
}
```
HTTP Status: 422 Unprocessable Entity

### Example 3: API Key Not Configured
```bash
# Without GEMINI_API_KEY in .env
```

**Response:**
```json
{
  "detail": "LLM service error: GEMINI_API_KEY not configured"
}
```
HTTP Status: 503 Service Unavailable

---

## Testing Workflow

### Step 1: Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Autonomous AI Agent",
  "version": "1.0.0"
}
```

### Step 2: Test Easy Scenario
```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{"request": "Create meeting minutes for a product launch discussion."}'
```

### Step 3: Verify Output
```bash
ls -lh outputs/
```

Check that a `.docx` file was created with timestamp naming.

### Step 4: Test Complex Scenario
```bash
curl -X POST http://localhost:8000/agent \
  -H "Content-Type: application/json" \
  -d '{"request": "I need a project proposal for an AI customer support chatbot for a healthcare company. Include assumptions, risks, milestones, budget estimates, implementation timeline, and executive summary."}'
```

### Step 5: Compare Results
- Easy scenario: 4 tasks, ~20 seconds
- Complex scenario: 6 tasks, ~30 seconds
- Both generate professional DOCX files

---

## Using with Python

```python
import requests
import json

BASE_URL = "http://localhost:8000"

def test_agent(request_text):
    """Test agent with a request."""
    response = requests.post(
        f"{BASE_URL}/agent",
        json={"request": request_text},
        timeout=60
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✓ Success")
        print(f"  Tasks completed: {len(result['completed_tasks'])}")
        print(f"  Document: {result['docx_file']}")
        print(f"  Summary: {result['summary']}")
    else:
        print(f"✗ Error: {response.status_code}")
        print(f"  Details: {response.json()}")

# Test easy scenario
print("Testing easy scenario...")
test_agent("Create meeting minutes for a product launch discussion.")

print("\nTesting complex scenario...")
test_agent("I need a project proposal for an AI customer support chatbot for a healthcare company. Include assumptions, risks, milestones, budget estimates, implementation timeline, and executive summary.")
```

---

## Performance Metrics

### Easy Scenario Metrics
```
Total Time: 15-20 seconds
Tasks: 4
LLM Calls: 5 (1 planning + 4 execution)
Token Usage: ~2000-3000 tokens
Document Size: ~15KB
```

### Complex Scenario Metrics
```
Total Time: 20-30 seconds
Tasks: 6
LLM Calls: 7 (1 planning + 6 execution)
Token Usage: ~5000-8000 tokens
Document Size: ~25KB
```

---

## Tips for Best Results

1. **Specific Requests**: More specific requests generate better tasks
2. **Context**: Include relevant context in the request
3. **Iteration**: Complex requests may need refinement
4. **Document Review**: Always review generated DOCX files
5. **API Rate Limiting**: Be aware of Gemini free tier rate limits

---

## Next Steps

After successful testing:
1. Review generated DOCX files for quality
2. Test with your own requests
3. Adjust prompt templates as needed
4. Deploy to production with proper monitoring
5. Add authentication and rate limiting
