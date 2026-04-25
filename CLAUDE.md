# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

---

## What This Is

**AI Opportunity Scanner** — A web app that analyzes company websites and returns personalized AI opportunities, impact estimations, and an Opportunity Matrix.

**Purpose:** Lead generation tool for Liberators AI. Used as interactive takeaway for webinars (Endeavor) and ongoing lead capture.

**Domain:** scan.liberators.ai

**📋 For detailed project status, see:** [status.md](./status.md)

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
├── status.md              # Project status & documentation
├── src/
│   ├── app/               # Next.js app router
│   │   ├── page.tsx       # Main page
│   │   ├── globals.css    # Global styles
│   │   └── api/           # API routes
│   │       ├── analyze-stream/  # SSE analysis endpoint
│   │       └── send-report/     # Email sending endpoint
│   ├── components/        # React components
│   │   ├── LandingSection.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ResultsSection.tsx
│   │   ├── OpportunityCard.tsx
│   │   ├── OpportunityMatrix.tsx
│   │   └── EmailCapture.tsx
│   └── lib/               # Utilities & services
│       ├── types.ts       # TypeScript interfaces
│       ├── colors.ts      # Department colors
│       ├── api.ts         # Frontend API utils
│       └── services/      # Backend services
│           ├── firecrawl.ts   # Website scraping
│           ├── analysis.ts    # OpenAI analysis
│           ├── email.ts       # Email templates
│           ├── clickup.ts     # CRM integration
│           └── slack.ts       # Slack notifications
└── public/                # Static assets
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
│  Landing → Loading (SSE) → Results → Email Capture          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Routes
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    /api (Next.js API Routes)                │
│                                                             │
│  POST /api/analyze-stream → SSE streaming analysis          │
│  POST /api/send-report    → Gmail OAuth2 email              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   Firecrawl   │  │    OpenAI     │  │   ClickUp     │
│  (scraping)   │  │   (GPT-4o)    │  │    (CRM)      │
└───────────────┘  └───────────────┘  └───────────────┘
                            │
                            ▼
                   ┌───────────────┐
                   │     Slack     │
                   │ (notifications)│
                   └───────────────┘
```

---

## Design System

### Brand Colors
- **Primary:** #007BFF (Liberators blue)
- **Text:** #1A1915 (Dark charcoal)
- **Background:** #FAFAFA (Light gray)
- **Borders:** #E5E5E5

### Department Colors

| Department | Background | Text |
|------------|------------|------|
| Sales | #E6F2FF | #0055CC |
| Operations | #EEF0FF | #4040CC |
| HR | #E6F5F0 | #008060 |
| Customer Service | #E8F5E6 | #2D8020 |
| Finance | #FFF8E6 | #CC8800 |
| Marketing | #FFE6F0 | #CC2266 |

### Typography
- **Sans-serif:** Inter (body text)
- **Serif:** Georgia (headings, numbers)
- Editorial aesthetic

### Style
- Clean, premium, editorial look
- Serif headings with sans body
- White cards with subtle borders
- Mobile-responsive

---

## MVP Scope

### Completed ✅
- [x] URL input → loading → 3 opportunity cards
- [x] Email capture → send report
- [x] Mobile responsive
- [x] Liberators AI branding
- [x] Opportunity Matrix visual (2x2 grid)
- [x] Department color coding
- [x] Animated transitions
- [x] ClickUp CRM integration
- [x] Slack notifications for new leads
- [x] Editorial UI redesign

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
