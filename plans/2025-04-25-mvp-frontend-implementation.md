# Plan: MVP Frontend Implementation - AI Opportunity Scanner

**Created:** 2025-04-25
**Status:** Implemented
**Request:** Build the complete UI for AI Opportunity Scanner with Next.js + Tailwind, including landing page, loading state, results page with 3 opportunity cards, email capture, and deployment setup for Vercel.

---

## Overview

### What This Plan Accomplishes

Creates a production-ready Next.js web application that allows users to input a company URL, receive AI-generated automation opportunities, and capture leads via email. The app will be deployable on Vercel at scan.liberators.ai.

### Why This Matters

This is the core lead generation tool for Liberators AI - used as an interactive takeaway for webinars and ongoing lead capture. It solves the problem of generic PDFs by providing personalized, company-specific AI opportunity analysis.

---

## Current State

### Relevant Existing Structure

```
ai-opportunity-scanner/
├── CLAUDE.md              # Project overview ✓
├── context/
│   ├── product.md         # Full PRD ✓
│   ├── backend.md         # MCP endpoint details ✓
│   └── design.md          # Design specs ✓
├── reference/
│   └── original-prd.md    # Original PRD ✓
└── (no src/ directory)    # No code exists yet
```

### Gaps or Problems Being Addressed

- No application code exists - need to build from scratch
- MCP backend returns plain text - need LLM post-processing to structure into JSON
- No frontend infrastructure (Next.js, Tailwind, components)

---

## Proposed Changes

### Summary of Changes

- Initialize Next.js 14 project with App Router
- Configure Tailwind CSS with custom department colors
- Create API routes to call MCP backend + LLM structuring
- Build UI components (Landing, Loading, Results, EmailCapture)
- Add Liberators AI branding (logo, colors)
- Set up for Vercel deployment

### New Files to Create

| File Path | Purpose |
|-----------|---------|
| `src/app/layout.tsx` | Root layout with metadata and fonts |
| `src/app/page.tsx` | Main page component orchestrating all states |
| `src/app/globals.css` | Global styles + Tailwind |
| `src/app/api/analyze/route.ts` | API route: MCP call + LLM parsing |
| `src/app/api/send-report/route.ts` | API route: Send email report |
| `src/components/LandingSection.tsx` | URL input + CTA button |
| `src/components/LoadingState.tsx` | Progress bar + step animations |
| `src/components/ResultsSection.tsx` | Container for results |
| `src/components/OpportunityCard.tsx` | Single opportunity card |
| `src/components/OpportunityMatrix.tsx` | 2x2 grid visualization |
| `src/components/EmailCapture.tsx` | Email input + send button |
| `src/components/CTASection.tsx` | Footer CTA with Calendly link |
| `src/components/Header.tsx` | Logo + branding header |
| `src/lib/types.ts` | TypeScript interfaces |
| `src/lib/colors.ts` | Department color mapping |
| `src/lib/api.ts` | API helper functions |
| `package.json` | Dependencies |
| `tailwind.config.ts` | Tailwind configuration |
| `next.config.js` | Next.js configuration |
| `.env.example` | Environment variables template |
| `public/logo.png` | Liberators AI logo |

### Files to Modify

| File Path | Changes |
|-----------|---------|
| None | Fresh project, no existing files to modify |

---

## Design Decisions

### Key Decisions Made

1. **Next.js 14 with App Router**: Modern React framework with built-in API routes, optimal for Vercel deployment.

2. **LLM post-processing for data parsing**: Use OpenAI GPT-3.5-turbo to structure the plain text response into JSON. More robust than regex, handles variations in MCP output.

3. **Single-page app with state management**: Use React useState to manage app state (idle → loading → results → sent). No need for complex state management.

4. **Tailwind CSS with custom colors**: Extend Tailwind config with department-specific colors from design spec for consistent styling.

5. **Server-side API routes**: Keep MCP calls and LLM processing in API routes to protect API keys and handle CORS.

### Alternatives Considered

- **Regex parsing**: Simpler but fragile - rejected because MCP output format could vary
- **Client-side MCP calls**: Would expose endpoints and keys - rejected for security
- **Separate backend service**: Over-engineering for MVP - Next.js API routes are sufficient

### Open Questions

None - all requirements clarified.

---

## Step-by-Step Tasks

### Step 1: Initialize Next.js Project

Create the base Next.js project with TypeScript and Tailwind CSS.

**Actions:**
- Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router
- Clean up default files
- Configure tailwind.config.ts with custom colors

**Files affected:**
- `package.json`
- `tailwind.config.ts`
- `next.config.js`
- `tsconfig.json`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

---

### Step 2: Add Liberators AI Logo

Copy logo file to public directory.

**Actions:**
- Copy logo from provided path to `public/logo.png`
- Use black letters version (white background assumed)

**Files affected:**
- `public/logo.png`

---

### Step 3: Create TypeScript Types

Define interfaces for opportunities, API responses, and app state.

**Actions:**
- Create `src/lib/types.ts` with:
  - `Opportunity` interface
  - `AnalysisResult` interface
  - `AppState` type

**Files affected:**
- `src/lib/types.ts`

---

### Step 4: Create Color Utilities

Set up department color mapping.

**Actions:**
- Create `src/lib/colors.ts` with department → color mapping
- Export functions for getting bg/text colors by department

**Files affected:**
- `src/lib/colors.ts`

---

### Step 5: Build API Route - Analyze

Create the `/api/analyze` endpoint that calls MCP + structures response.

**Actions:**
- Create `src/app/api/analyze/route.ts`
- Implement MCP call to `voice_agent_website_analysis`
- Add OpenAI call to structure plain text into JSON
- Handle errors and return structured response

**Files affected:**
- `src/app/api/analyze/route.ts`

---

### Step 6: Build API Route - Send Report

Create the `/api/send-report` endpoint.

**Actions:**
- Create `src/app/api/send-report/route.ts`
- Implement MCP call to `send_report_to_email`
- Handle success/error responses

**Files affected:**
- `src/app/api/send-report/route.ts`

---

### Step 7: Create API Helper Functions

Client-side helpers to call API routes.

**Actions:**
- Create `src/lib/api.ts`
- Export `analyzeWebsite(url)` function
- Export `sendReport(email)` function

**Files affected:**
- `src/lib/api.ts`

---

### Step 8: Build Header Component

Logo and branding header.

**Actions:**
- Create `src/components/Header.tsx`
- Display Liberators AI logo
- Clean, minimal design

**Files affected:**
- `src/components/Header.tsx`

---

### Step 9: Build Landing Section Component

URL input with validation and submit button.

**Actions:**
- Create `src/components/LandingSection.tsx`
- URL input field with placeholder "π.χ. example.com"
- "Ανάλυση" button
- Basic URL validation
- Headline and subheadline text

**Files affected:**
- `src/components/LandingSection.tsx`

---

### Step 10: Build Loading State Component

Progress bar with animated step messages.

**Actions:**
- Create `src/components/LoadingState.tsx`
- Progress bar (0-100%)
- 5 step messages with transitions:
  1. "Αναλύουμε το website σας..."
  2. "Εντοπίζουμε departments και υπηρεσίες..."
  3. "Αξιολογούμε ευκαιρίες AI..."
  4. "Υπολογίζουμε εκτιμήσεις..."
  5. "Ετοιμάζουμε τα αποτελέσματα..."
- Auto-progress animation

**Files affected:**
- `src/components/LoadingState.tsx`

---

### Step 11: Build Opportunity Card Component

Single opportunity card with metrics.

**Actions:**
- Create `src/components/OpportunityCard.tsx`
- Department badge with color coding
- Title, description
- Metrics row: time savings, effort level, timeline
- Card styling per design spec

**Files affected:**
- `src/components/OpportunityCard.tsx`

---

### Step 12: Build Opportunity Matrix Component

2x2 grid visualization (nice-to-have).

**Actions:**
- Create `src/components/OpportunityMatrix.tsx`
- 2x2 grid: Impact (Y) vs Effort (X)
- Plot opportunities as dots
- Color-code by department
- Highlight "Quick Wins" quadrant

**Files affected:**
- `src/components/OpportunityMatrix.tsx`

---

### Step 13: Build Email Capture Component

Email input with send button.

**Actions:**
- Create `src/components/EmailCapture.tsx`
- Email input field
- "Αποστολή report" button
- "Δωρεάν. Χωρίς δεσμεύσεις." note
- Success confirmation state

**Files affected:**
- `src/components/EmailCapture.tsx`

---

### Step 14: Build CTA Section Component

Footer call-to-action.

**Actions:**
- Create `src/components/CTASection.tsx`
- "Θέλετε να εμβαθύνουμε;" text
- "Κλείστε δωρεάν 30-λεπτο call" button
- Link to: https://calendly.com/andreaskaravanas/30-minute-demo
- Liberators AI branding

**Files affected:**
- `src/components/CTASection.tsx`

---

### Step 15: Build Results Section Container

Container that assembles results components.

**Actions:**
- Create `src/components/ResultsSection.tsx`
- Company name badge
- 3 OpportunityCard components
- OpportunityMatrix component
- EmailCapture component
- CTASection component

**Files affected:**
- `src/components/ResultsSection.tsx`

---

### Step 16: Assemble Main Page

Wire up all components with state management.

**Actions:**
- Update `src/app/page.tsx`
- State management: idle → loading → results → emailSent
- Conditional rendering based on state
- Handle analyze and send-report flows

**Files affected:**
- `src/app/page.tsx`

---

### Step 17: Add Global Styles and Layout

Configure fonts and global CSS.

**Actions:**
- Update `src/app/globals.css` with base styles
- Update `src/app/layout.tsx` with metadata
- Set page title, description, favicon

**Files affected:**
- `src/app/globals.css`
- `src/app/layout.tsx`

---

### Step 18: Create Environment Configuration

Set up environment variables.

**Actions:**
- Create `.env.example` with:
  - `MCP_ENDPOINT`
  - `OPENAI_API_KEY`
- Create `.env.local` (gitignored)

**Files affected:**
- `.env.example`

---

### Step 19: Initialize Git Repository

Set up git for GitHub deployment.

**Actions:**
- Run `git init`
- Create `.gitignore` (Next.js defaults)
- Initial commit

**Files affected:**
- `.gitignore`
- All project files

---

### Step 20: Test and Validate

Run development server and test flows.

**Actions:**
- Run `npm run dev`
- Test URL input → loading → results flow
- Test email capture
- Verify responsive design
- Check error handling

**Files affected:**
- None (testing only)

---

## Connections & Dependencies

### Files That Reference This Area

- `CLAUDE.md` - will need update with src/ structure
- `context/` files - reference only, no changes needed

### Updates Needed for Consistency

- Update `CLAUDE.md` to document final src/ structure after implementation

### Impact on Existing Workflows

- None - this is a new project build

---

## Validation Checklist

How to verify the implementation is complete and correct:

- [ ] `npm run dev` starts without errors
- [ ] URL input accepts valid URLs and shows validation for invalid
- [ ] Loading state shows progress bar and step animations
- [ ] Results display 3 opportunity cards with correct data
- [ ] Department colors match design spec
- [ ] Opportunity Matrix renders with plotted opportunities
- [ ] Email capture sends report and shows confirmation
- [ ] CTA button links to Calendly
- [ ] Mobile responsive (test at 320px, 768px, 1024px)
- [ ] Logo displays correctly
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No console errors in browser

---

## Success Criteria

The implementation is complete when:

1. User can input a URL and receive 3 AI opportunity cards with structured data
2. Email capture successfully sends report via MCP backend
3. App is mobile responsive and matches design specifications
4. Project builds successfully and is ready for Vercel deployment
5. Git repository is initialized with clean commit history

---

## Notes

### Environment Variables for Vercel

When deploying, set these in Vercel dashboard:
- `MCP_ENDPOINT=https://web-voice-automation.up.railway.app/mcp`
- `OPENAI_API_KEY=<your-key>`

### Future Enhancements (Post-MVP)

- Share results link
- Industry benchmarks comparison
- Scan history (requires auth)
- Multi-language support

### Technical Notes

- MCP endpoint may need testing to verify exact request format
- LLM parsing prompt should be tuned based on actual MCP output samples
- Consider rate limiting on API routes for production

---

## Implementation Notes

**Implemented:** 2025-04-25

### Summary

Successfully built the complete MVP frontend for AI Opportunity Scanner with all planned features:
- Next.js 14 project with App Router, TypeScript, and Tailwind CSS
- API routes for website analysis (with OpenAI GPT-3.5-turbo parsing) and email report sending
- Complete UI: Landing page, Loading state with animations, Results section with 3 opportunity cards, 2x2 Opportunity Matrix, Email capture, and CTA section
- Liberators AI branding with logo and department color coding
- Git repository initialized and ready for GitHub push

### Deviations from Plan

- Created project files manually instead of using `npx create-next-app` due to existing files in directory
- Added `.eslintrc.json` configuration file (not in original plan)
- Created `.env.local` in addition to `.env.example` for local development

### Issues Encountered

None - all steps completed successfully. Build and lint passed with no errors.
