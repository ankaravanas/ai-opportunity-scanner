# AI Opportunity Scanner - Project Status

**Last Updated:** April 2026
**Domain:** scan.liberators.ai
**Status:** ✅ Production Ready

---

## Overview

AI Opportunity Scanner is a lead generation web app for Liberators AI. Users submit their company website URL and receive personalized AI automation opportunities with ROI estimates.

---

## Current Features

### 1. Website Analysis
- **Firecrawl Integration**: Scrapes website content, extracts emails and phone numbers
- **OpenAI GPT-4o Analysis**: Generates business-specific AI automation opportunities
- **Real-time Progress**: Server-Sent Events (SSE) for live loading updates

### 2. Results Display
- **Company Recognition**: Extracts actual brand name using GPT-4o-mini
- **3 AI Opportunities**: Each with title, department, description, metrics
- **Opportunity Matrix**: 2x2 grid (Impact vs Effort) with collision detection
- **Annual Savings Calculator**: Hours/week × 48 weeks × €25/hour

### 3. Lead Capture
- **ClickUp CRM Integration**: Automatic lead creation with custom fields
- **Email Report Sending**: Gmail OAuth2 for HTML report delivery
- **Slack Notifications**: Real-time alerts when new leads are captured

### 4. UI/UX Design
- **Editorial Aesthetic**: Serif typography (Georgia), clean layouts
- **Liberators AI Branding**: Primary blue (#007BFF), light backgrounds
- **Mobile Responsive**: Works on all device sizes
- **Greek Content**: UI in Greek with English tech terms

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | Inter (sans), Georgia (serif) |
| API | REST endpoints in /api |

---

## Integrations

### Firecrawl (Website Scraping)
- Endpoint: `https://api.firecrawl.dev/v1/scrape`
- Extracts: Markdown content, emails, phone numbers
- Validates: Email format, filters fake/placeholder emails

### OpenAI (Analysis)
- Model: GPT-4o for analysis, GPT-4o-mini for company name extraction
- Generates: Business-specific automation opportunities
- Returns: JSON structured data

### Gmail (Email Reports)
- OAuth2 Authentication
- Sends: HTML email reports with full analysis
- From: hello@liberators.ai

### ClickUp (CRM)
- Workspace: AI Labs
- List: Internal (CRM & Access) → CRM
- Custom Fields: Website, Email, Phone
- Auto-tags: Source = AI Opportunity Scanner

### Slack (Notifications)
- Channel: C0AV6PT92AJ
- Triggers: On every new lead submission
- Includes: Company name, URL, industry, opportunities, ClickUp link

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main page with state management
│   ├── globals.css           # Global styles & animations
│   ├── layout.tsx            # Root layout
│   └── api/
│       ├── analyze-stream/   # SSE endpoint for analysis
│       └── send-report/      # Email sending endpoint
├── components/
│   ├── LandingSection.tsx    # URL input form
│   ├── LoadingState.tsx      # Progress indicator
│   ├── ResultsSection.tsx    # Results container
│   ├── OpportunityCard.tsx   # Individual opportunity cards
│   ├── OpportunityMatrix.tsx # 2x2 impact/effort matrix
│   └── EmailCapture.tsx      # Email form for report
└── lib/
    ├── types.ts              # TypeScript interfaces
    ├── colors.ts             # Department color mappings
    ├── api.ts                # Frontend API utilities
    └── services/
        ├── firecrawl.ts      # Website scraping
        ├── analysis.ts       # OpenAI analysis
        ├── email.ts          # Email template & sending
        ├── clickup.ts        # CRM lead capture
        └── slack.ts          # Slack notifications
```

---

## Environment Variables

```bash
# Required
FIRECRAWL_API_KEY=...
OPENAI_API_KEY=...
GMAIL_USER=...
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
CLICKUP_API_KEY=...
CLICKUP_LIST_ID=...
SLACK_BOT_TOKEN=...
SLACK_CHANNEL_ID=...
```

---

## Recent Changes

### UI Redesign (April 2026)
- Switched from terracotta (#D97757) to Liberators blue (#007BFF)
- Added serif typography for editorial aesthetic
- Redesigned cards with numbered badges
- Impact score changed from dots to progress bar
- Added fade-in animations

### Data Quality Improvements
- Strict email validation (filters fake emails, image filenames)
- Company name extraction using GPT instead of string parsing
- Business-specific automation suggestions (not generic)

### Integrations Added
- Slack notifications for new leads
- ClickUp source attribution
- Rich lead descriptions with business summary

---

## Known Issues

None currently.

---

## Deployment

- **Platform:** Vercel
- **Domain:** scan.liberators.ai
- **Environment:** Production

---

## Maintenance

### To update analysis prompts:
Edit `src/lib/services/analysis.ts`

### To modify email template:
Edit `src/lib/services/email.ts`

### To change Slack notification format:
Edit `src/lib/services/slack.ts`

### To update ClickUp fields:
Edit `src/lib/services/clickup.ts` (CRM_FIELDS object)

---

*Maintained by Liberators AI*
