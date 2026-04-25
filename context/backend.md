# Backend Context

> MCP Server endpoint details for AI Opportunity Scanner

---

## Existing MCP Server

**Endpoint:** `https://web-voice-automation.up.railway.app/mcp`

**Status:** Already deployed and working on Railway

---

## Available Tools

### Tool 1: voice_agent_website_analysis

**Purpose:** Analyze a website and identify AI automation opportunities

**Input:**
```json
{
  "url": "string"
}
```

**Process:**
1. Firecrawl scrape of the website
2. GPT-4o analysis for opportunities
3. HTML report generation
4. ClickUp lead capture (automatic)

**Output:**
```
Text summary with:
- Company name
- Industry
- 3 opportunities with impact percentages
```

### Tool 2: send_report_to_email

**Purpose:** Send the cached HTML report to user's email

**Input:**
```json
{
  "email": "string"
}
```

**Output:**
```json
{
  "success": true/false
}
```

---

## Frontend API Routes

The frontend needs to call these MCP tools via REST API:

### POST /api/analyze

```javascript
// Request
{
  url: "https://example.com"
}

// Response
{
  company: "Example Corp",
  industry: "Manufacturing",
  opportunities: [
    {
      title: "...",
      department: "Sales",
      description: "...",
      time_savings_hours_week: 15,
      effort: "medium",
      timeline_weeks: 3,
      impact_score: 9
    }
  ],
  raw_summary: "..."
}
```

### POST /api/send-report

```javascript
// Request
{
  email: "user@example.com"
}

// Response
{
  success: true
}
```

---

## MCP Call Format

To call MCP tools from the API routes:

```javascript
const response = await fetch('https://web-voice-automation.up.railway.app/mcp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    method: 'tools/call',
    params: {
      name: 'voice_agent_website_analysis',
      arguments: {
        url: 'https://example.com'
      }
    }
  })
});
```

---

## Response Parsing

The MCP tool returns unstructured text. Frontend needs to parse:

**Option A: Regex parsing**
```javascript
const companyMatch = text.match(/analysis of (.+?)'s website/);
const industryMatch = text.match(/in the (.+?) industry/);
// etc.
```

**Option B: LLM post-processing**
Call a small model to structure the response into JSON.

**Option C (Recommended): Modify MCP server**
Update the MCP tool to return structured JSON directly.

---

## Environment Variables (for Vercel)

```
MCP_ENDPOINT=https://web-voice-automation.up.railway.app/mcp
```

---

## Error Handling

| Scenario | Response |
|----------|----------|
| Invalid URL | 400 Bad Request |
| Website unreachable | 422 Unprocessable |
| MCP timeout (>60s) | 504 Gateway Timeout |
| Email send failure | 500 Internal Error |
