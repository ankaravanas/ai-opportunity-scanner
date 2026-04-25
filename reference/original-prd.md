# PRD: AI Opportunity Scanner

## Product Overview

Web app που αναλύει το website μιας εταιρείας και επιστρέφει personalized AI opportunities, impact estimations, και Opportunity Matrix. Χρησιμοποιείται ως interactive takeaway στο Endeavor webinar και ως lead generation tool μετά.

## Problem

Οι C-level executives φεύγουν από webinars με generic PDFs και checklists που δεν ανοίγουν ποτέ. Χρειάζονται κάτι personalized, κάτι που αναφέρεται στη ΔΙΚΗ ΤΟΥΣ εταιρεία.

## Solution

Ένα web app στο scan.liberators.ai (ή αντίστοιχο subdomain) όπου ο χρήστης βάζει το URL της εταιρείας του και παίρνει:
- 3 AI opportunities ranked by impact
- Estimated time savings ανά opportunity
- AI Opportunity Matrix (2x2 grid)
- Option να στείλει αναλυτικό report στο email του

## Existing Backend

Το backend ΥΠΑΡΧΕΙ ΗΔΗ ως MCP tool (AI Opportunities server):

**Endpoint:** https://web-voice-automation.up.railway.app/mcp

**Tool 1: voice_agent_website_analysis**
- Input: URL (string)
- Process: Firecrawl scrape → GPT-4o analysis → HTML report generation → ClickUp lead capture
- Output: Text summary με 3 opportunities + impact percentages

**Tool 2: send_report_to_email**
- Input: email (string)
- Process: Στέλνει cached HTML report στο email
- Output: Confirmation

Αυτά τα δύο endpoints πρέπει να γίνουν REST API calls από το frontend.

## User Flow

```
1. Landing page: URL input field + "Ανάλυση" button
2. Loading state: Progress bar + steps animation (5 steps, ~15-30 sec)
   - "Αναλύουμε το website σας..."
   - "Εντοπίζουμε departments και υπηρεσίες..."
   - "Αξιολογούμε ευκαιρίες AI..."
   - "Υπολογίζουμε εκτιμήσεις..."
   - "Ετοιμάζουμε τα αποτελέσματα..."
3. Results page:
   a. Company name badge (extracted from URL/analysis)
   b. 3 Opportunity cards (title, department tag, description, metrics)
   c. AI Opportunity Matrix (2x2 grid with opportunities plotted)
   d. Email input + "Αποστολή αναλυτικού report" button
   e. Footer CTA: "Θέλετε να εμβαθύνουμε; Κλείστε ένα δωρεάν 30-λεπτο call"
4. Email sent confirmation
```

## Technical Architecture

```
Frontend (React/Next.js)
    │
    ├── POST /api/analyze  ←  Calls MCP tool: voice_agent_website_analysis
    │     Input: { url: string }
    │     Output: { company, industry, opportunities[], raw_summary }
    │
    └── POST /api/send-report  ←  Calls MCP tool: send_report_to_email
          Input: { email: string }
          Output: { success: boolean }
```

## Frontend Components

### 1. URL Input Section
- Single text input + CTA button
- Validation: basic URL format check
- Placeholder: "π.χ. example.com"

### 2. Loading State
- Progress bar (0-100%)
- Step text animation (5 steps)
- Estimated time: 15-30 seconds
- Abort button (optional)

### 3. Results Section

#### 3a. Opportunity Cards (x3)
Κάθε card:
- Title (string, π.χ. "Αυτοματοποίηση lead follow-up")
- Department badge (Sales / Operations / HR / CS / Finance / Marketing)
- Description (2-3 sentences)
- Metrics row:
  - Εκτ. εξοικονόμηση (ώρες/εβδομάδα)
  - Effort level (Χαμηλό / Μεσαίο / Υψηλό)
  - Timeline (εβδομάδες)

#### 3b. AI Opportunity Matrix
- 2x2 grid: Impact (Y) vs Effort (X)
- Opportunities plotted ως dots/labels
- Quick Wins quadrant highlighted
- Color-coded by department

#### 3c. Email Capture
- Email input + "Αποστολή report" button
- Confirmation message on success
- Note: "Δωρεάν. Χωρίς δεσμεύσεις."

#### 3d. CTA Section
- "Θέλετε να εμβαθύνουμε;"
- Calendly link ή contact form
- Liberators AI branding

## Data Parsing

Το MCP tool επιστρέφει plain text summary. Πρέπει να γίνει parse σε structured data.

**Τρέχον output format (example):**
```
I've completed a comprehensive analysis of [Company Name]'s website.
They're in the [industry] industry.
I identified 3 key automation opportunities:
1. [Title] - [Description with percentages]
2. [Title] - [Description with percentages]
3. [Title] - [Description with percentages]
```

**Options:**
- Option A: Parse text output με regex/LLM post-processing στο backend
- Option B (Recommended): Modify MCP tool endpoint να επιστρέφει JSON structured output:

```json
{
  "company": "Liberators AI",
  "industry": "Technology",
  "opportunities": [
    {
      "title": "Automated Lead Follow-up",
      "department": "Sales",
      "description": "...",
      "time_savings_hours_week": 15,
      "effort": "medium",
      "timeline_weeks": 3,
      "impact_score": 9
    }
  ]
}
```

## Design Specs

- **Branding:** Liberators AI colors/fonts
- **Layout:** Single page, scrollable, mobile-responsive
- **Style:** Clean, premium, no gradients. Flat cards with subtle borders.
- **Typography:** Sans-serif, 16px body, 24px headings
- **Colors per department:**
  - Sales: Blue (#E6F1FB / #0C447C)
  - Operations: Purple (#EEEDFE / #3C3489)
  - HR: Teal (#E1F5EE / #085041)
  - Customer Service: Green (#EAF3DE / #27500A)
  - Finance: Amber (#FAEEDA / #633806)
  - Marketing: Coral (#FAECE7 / #712B13)

## Lead Capture (Backend, ήδη υπάρχει)

Κάθε analysis αυτόματα:
1. Κάνει capture lead στο ClickUp CRM
2. Στέλνει HTML report στο email (αν δοθεί)
3. Logs analysis για follow-up

## Deployment

- **Frontend:** Vercel (Next.js) ή static React
- **Domain:** scan.liberators.ai (ή tools.liberators.ai/scan)
- **Backend:** Ήδη deployed στο Railway (AI Opportunities MCP)
- **SSL:** Auto via Vercel

## MVP Scope (για το webinar)

**Must have:**
- URL input → loading → 3 opportunity cards
- Email capture → send report
- Mobile responsive
- Liberators AI branding

**Nice to have:**
- Opportunity Matrix visual
- Department color coding
- Animated transitions
- Share results link
- Comparison with industry benchmarks
- History of scans

**Out of scope (v1):**
- User accounts / login
- Saved scans history
- Custom report generation
- Multi-language
- White-label for clients

## Success Metrics

- Scans completed per webinar
- Email capture rate (target: 40%+)
- Conversion to call booking (target: 10%+)
- Time on results page (target: 2+ min)

## Timeline

- Backend API modification (JSON output): 1 day
- Frontend build (MVP): 2-3 days
- Testing + deploy: 1 day
- Total: 4-5 days

## Notes

- Η ανάλυση βασίζεται σε PUBLIC πληροφορίες (website). Δεν χρειάζεται access σε internal data.
- Τα opportunities είναι indicative, όχι definitive. Γι' αυτό η CTA είναι "θέλετε να εμβαθύνουμε;"
- Μπορεί να γίνει reusable tool και εκτός webinar (content marketing, LinkedIn posts, outbound sales)
