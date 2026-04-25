# Product Context

> Full PRD for AI Opportunity Scanner

---

## Problem

Οι C-level executives φεύγουν από webinars με generic PDFs και checklists που δεν ανοίγουν ποτέ. Χρειάζονται κάτι personalized, κάτι που αναφέρεται στη ΔΙΚΗ ΤΟΥΣ εταιρεία.

---

## Solution

Web app στο **scan.liberators.ai** όπου ο χρήστης βάζει το URL της εταιρείας του και παίρνει:
- 3 AI opportunities ranked by impact
- Estimated time savings ανά opportunity
- AI Opportunity Matrix (2x2 grid)
- Option να στείλει αναλυτικό report στο email του

---

## User Flow (Detailed)

### Step 1: Landing Page
- URL input field
- "Ανάλυση" button
- Validation: basic URL format check
- Placeholder: "π.χ. example.com"

### Step 2: Loading State (15-30 seconds)
Progress bar (0-100%) + step text animation:
1. "Αναλύουμε το website σας..."
2. "Εντοπίζουμε departments και υπηρεσίες..."
3. "Αξιολογούμε ευκαιρίες AI..."
4. "Υπολογίζουμε εκτιμήσεις..."
5. "Ετοιμάζουμε τα αποτελέσματα..."

Optional: Abort button

### Step 3: Results Page

**3a. Company Badge**
- Company name (extracted from analysis)
- Industry badge

**3b. Opportunity Cards (x3)**
Each card contains:
- Title (string, π.χ. "Αυτοματοποίηση lead follow-up")
- Department badge (Sales / Operations / HR / CS / Finance / Marketing)
- Description (2-3 sentences)
- Metrics row:
  - Εκτ. εξοικονόμηση (ώρες/εβδομάδα)
  - Effort level (Χαμηλό / Μεσαίο / Υψηλό)
  - Timeline (εβδομάδες)

**3c. AI Opportunity Matrix**
- 2x2 grid: Impact (Y) vs Effort (X)
- Opportunities plotted as dots/labels
- Quick Wins quadrant highlighted
- Color-coded by department

**3d. Email Capture**
- Email input + "Αποστολή report" button
- Confirmation message on success
- Note: "Δωρεάν. Χωρίς δεσμεύσεις."

**3e. CTA Section**
- "Θέλετε να εμβαθύνουμε;"
- Calendly link ή contact form
- Liberators AI branding

### Step 4: Email Sent Confirmation
- Success message
- Option to share results

---

## Data Parsing

Το backend επιστρέφει plain text. Χρειάζεται parsing σε structured JSON:

**Current output format:**
```
I've completed a comprehensive analysis of [Company Name]'s website.
They're in the [industry] industry.
I identified 3 key automation opportunities:
1. [Title] - [Description with percentages]
2. [Title] - [Description with percentages]
3. [Title] - [Description with percentages]
```

**Target JSON structure:**
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

**Options:**
- Option A: Parse text with regex/LLM post-processing in frontend
- Option B (Recommended): Modify MCP endpoint to return JSON

---

## Lead Capture (Backend - Already Exists)

Κάθε analysis αυτόματα:
1. Capture lead στο ClickUp CRM
2. Στέλνει HTML report στο email (αν δοθεί)
3. Logs analysis για follow-up

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Scans completed per webinar | - |
| Email capture rate | 40%+ |
| Conversion to call booking | 10%+ |
| Time on results page | 2+ min |

---

## Notes

- Η ανάλυση βασίζεται σε PUBLIC πληροφορίες (website)
- Τα opportunities είναι indicative, όχι definitive
- CTA: "θέλετε να εμβαθύνουμε;"
- Reusable εκτός webinar (content marketing, LinkedIn, outbound)
