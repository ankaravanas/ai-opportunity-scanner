# Design Context

> Visual design specifications for AI Opportunity Scanner

---

## Brand

**Company:** Liberators AI
**Domain:** scan.liberators.ai

---

## Layout

- Single page, scrollable
- Mobile-responsive
- Max-width container: 1200px
- Sections: Landing → Loading → Results

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Sans-serif | 24px | Bold |
| Body | Sans-serif | 16px | Regular |
| Labels | Sans-serif | 14px | Medium |
| Metrics | Sans-serif | 18px | Semi-bold |

---

## Colors

### Brand Colors

| Use | Color |
|-----|-------|
| Primary | #007BFF (Blue) |
| Background | #FFFFFF |
| Text | #1a1a1a |
| Muted text | #666666 |
| Borders | #E5E7EB |

### Department Colors

| Department | Background | Text |
|------------|------------|------|
| Sales | #E6F1FB | #0C447C |
| Operations | #EEEDFE | #3C3489 |
| HR | #E1F5EE | #085041 |
| Customer Service | #EAF3DE | #27500A |
| Finance | #FAEEDA | #633806 |
| Marketing | #FAECE7 | #712B13 |

### Matrix Colors

| Quadrant | Color |
|----------|-------|
| Quick Wins (high impact, low effort) | Green highlight |
| Strategic (high impact, high effort) | Blue |
| Low Priority (low impact, high effort) | Gray |
| Easy Wins (low impact, low effort) | Light blue |

---

## Components

### URL Input Section
```
┌─────────────────────────────────────────────────────┐
│  [     π.χ. example.com              ] [ Ανάλυση ] │
└─────────────────────────────────────────────────────┘
```

### Loading State
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│      ████████████░░░░░░░░░░░  45%                  │
│                                                     │
│      "Αξιολογούμε ευκαιρίες AI..."                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Opportunity Card
```
┌─────────────────────────────────────────────────────┐
│  [Sales]                                            │
│                                                     │
│  Αυτοματοποίηση Lead Follow-up                     │
│                                                     │
│  Description text here about the opportunity...     │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 15 ώρες  │ │ Μεσαίο   │ │ 3 εβδ.   │           │
│  │ /εβδομάδα│ │ Effort   │ │ Timeline │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
```

### Opportunity Matrix (2x2)
```
                    HIGH EFFORT
         ┌─────────────┬─────────────┐
    HIGH │  Strategic  │  Strategic  │
  IMPACT │     (2)     │     (3)     │
         ├─────────────┼─────────────┤
     LOW │ Quick Wins  │ Low Priority│
  IMPACT │     (1)     │             │
         └─────────────┴─────────────┘
                    LOW EFFORT
```

### Email Capture
```
┌─────────────────────────────────────────────────────┐
│  Λάβε το πλήρες report στο email σου               │
│                                                     │
│  [      your@email.com           ] [ Αποστολή ]    │
│                                                     │
│  Δωρεάν. Χωρίς δεσμεύσεις.                        │
└─────────────────────────────────────────────────────┘
```

---

## Style Guidelines

### Do
- Clean, premium aesthetic
- Flat cards with subtle borders (1px #E5E7EB)
- Generous whitespace (24px+ between sections)
- Subtle shadows (shadow-sm)
- Smooth transitions (300ms)

### Don't
- Gradients
- Heavy shadows
- Bright neon colors
- Cluttered layouts
- Generic stock photos

---

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 640px) | Single column, stacked cards |
| Tablet (640-1024px) | 2-column grid for cards |
| Desktop (> 1024px) | 3-column grid for cards |

---

## Animations

### Loading Steps
- Fade in/out text (opacity transition)
- Progress bar smooth fill (linear)
- Step dots pulse effect

### Results
- Cards fade in with slight upward motion (translateY)
- Matrix dots appear with scale animation
- Staggered entrance (100ms delay between cards)

---

## Assets Needed

- [ ] Liberators AI logo (light bg version)
- [ ] Department icons (optional)
- [ ] Success checkmark for email confirmation
- [ ] Loading spinner or animation
