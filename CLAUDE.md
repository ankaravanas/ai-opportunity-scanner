# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

---

## What This Is

**AI Opportunity Scanner** — A web app that analyzes company websites and returns personalized AI opportunities, impact estimations, and an Opportunity Matrix.

**Purpose:** Lead generation tool for Liberators AI. Used as interactive takeaway for webinars (Endeavor) and ongoing lead capture.

**Domain:** scan.liberators.ai

---

## Quick Context

| Field | Value |
|-------|-------|
| **Project** | AI Opportunity Scanner |
| **Company** | Liberators AI |
| **Type** | Lead Gen Web App |
| **Stack** | Next.js + React + Tailwind |
| **Backend** | MCP Server on Railway (existing) |
| **Deploy** | Vercel |
| **Domain** | scan.liberators.ai |

---

## The Product

### User Flow

```
1. Landing: URL input + "Ανάλυση" button
2. Loading: Progress bar + 5-step animation (15-30 sec)
3. Results:
   - Company name badge
   - 3 Opportunity cards (title, department, metrics)
   - AI Opportunity Matrix (2x2 grid)
   - Email capture for full report
   - CTA: "Κλείστε δωρεάν 30-λεπτο call"
4. Email confirmation
```

### Backend (Already Exists)

**Endpoint:** `https://web-voice-automation.up.railway.app/mcp`

| Tool | Input | Output |
|------|-------|--------|
| `voice_agent_website_analysis` | URL (string) | Text summary + 3 opportunities |
| `send_report_to_email` | email (string) | Sends cached HTML report |

These need to be called as REST API from the frontend.

---

## Workspace Structure

```
ai-opportunity-scanner/
├── CLAUDE.md              # This file — core context
├── .claude/
│   └── commands/          # Slash commands
│       ├── prime.md       # /prime — session initialization
│       ├── create-plan.md # /create-plan — implementation plans
│       └── implement.md   # /implement — execute plans
├── context/               # Project context
│   ├── product.md         # Full PRD & user flows
│   ├── backend.md         # MCP endpoint details
│   └── design.md          # Design specs & colors
├── tasks/                 # Task tracking
│   └── lessons.md         # Accumulated learnings
├── plans/                 # Implementation plans
├── outputs/               # Work products
├── reference/             # Templates, patterns
├── scripts/               # Utility scripts
└── src/                   # Application source (to be created)
```

---

## Commands

### /prime

**Purpose:** Initialize session with full context.

Run at session start. Claude will:
1. Read CLAUDE.md and context files
2. Summarize understanding
3. Confirm readiness

### /create-plan [request]

**Purpose:** Create implementation plan before changes.

### /implement [plan-path]

**Purpose:** Execute a plan from /create-plan.

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
│                                                             │
│  Landing → Loading → Results → Email Capture                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (/api)                        │
│                                                             │
│  POST /api/analyze     → voice_agent_website_analysis       │
│  POST /api/send-report → send_report_to_email               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MCP calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              MCP Server (Railway - existing)                │
│                                                             │
│  https://web-voice-automation.up.railway.app/mcp            │
│                                                             │
│  - Firecrawl scrape                                         │
│  - GPT-4o analysis                                          │
│  - HTML report generation                                   │
│  - ClickUp lead capture                                     │
│  - Email sending                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Design System

### Colors

| Department | Background | Text |
|------------|------------|------|
| Sales | #E6F1FB | #0C447C |
| Operations | #EEEDFE | #3C3489 |
| HR | #E1F5EE | #085041 |
| Customer Service | #EAF3DE | #27500A |
| Finance | #FAEEDA | #633806 |
| Marketing | #FAECE7 | #712B13 |

### Typography
- Sans-serif font
- Body: 16px
- Headings: 24px

### Style
- Clean, premium, no gradients
- Flat cards with subtle borders
- Mobile-responsive

---

## MVP Scope

### Must Have
- [ ] URL input → loading → 3 opportunity cards
- [ ] Email capture → send report
- [ ] Mobile responsive
- [ ] Liberators AI branding

### Nice to Have
- [ ] Opportunity Matrix visual (2x2 grid)
- [ ] Department color coding
- [ ] Animated transitions

### Out of Scope (v1)
- User accounts / login
- Saved scans history
- Multi-language

---

## Core Principles

- **Simplicity First**: Minimal code, maximum impact
- **No Laziness**: Find root causes, senior dev standards
- **Verify Before Done**: Never mark complete without testing
- **Learn From Mistakes**: Update tasks/lessons.md

---

## Session Workflow

1. **Start**: Run `/prime` to load context
2. **Work**: Use commands or direct tasks
3. **Plan changes**: Use `/create-plan` before significant work
4. **Execute**: Use `/implement` to run plans
5. **Maintain**: Update CLAUDE.md as project evolves

---

*Last updated: April 2026*
