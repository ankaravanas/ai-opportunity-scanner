/**
 * OpenAI GPT-4o analysis service
 */

import OpenAI from 'openai';
import { AnalysisResult, Opportunity, Department, EffortLevel } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BusinessInfo {
  companyName: string;
  industry: string;
  services: string[];
  technologies: string[];
}

export interface RawOpportunity {
  title: string;
  description: string;
  impact: string;
  implementation: string;
  roi_estimate: string;
  priority: string;
}

export interface AnalysisData {
  opportunities: RawOpportunity[];
  overall_assessment: string;
  recommended_next_steps: string;
}

/**
 * Extract company name using GPT-4o-mini
 * Intelligently identifies the actual brand/company name, not taglines
 */
async function extractCompanyName(title: string, content: string): Promise<string> {
  if (!title && !content) return 'Unknown Company';

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Extract the ACTUAL COMPANY/BRAND NAME from this website.

Page Title: "${title}"
Content snippet: "${content.slice(0, 500)}"

RULES:
- Return ONLY the company/brand name, nothing else
- Do NOT return taglines or descriptions (e.g., "Web Design Agency" is NOT a company name)
- Look for the actual brand name (e.g., "WeDoHype", "Liberators AI", "Apple", "Nike")
- If the title has format "Description | BrandName", extract "BrandName"
- If the title has format "BrandName - Description", extract "BrandName"
- Prefer proper nouns and capitalized brand names
- If truly uncertain, return the most likely brand name

Company name:`,
        },
      ],
      temperature: 0.1,
      max_tokens: 50,
    });

    const extracted = response.choices[0]?.message?.content?.trim();
    if (extracted && extracted.length > 0 && extracted.length < 100) {
      return extracted;
    }
  } catch {
    // Fallback to simple extraction
  }

  // Simple fallback: try to find brand after separator
  const parts = title.split(/[|–—·]/);
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart.length > 2 && lastPart.length < 50) {
      return lastPart;
    }
  }
  return parts[0].trim() || 'Unknown Company';
}

/**
 * Detect language of content using GPT-4o-mini
 */
async function detectLanguage(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Analyze this content and identify the primary language. Return ONLY the language name in English (e.g., "English", "Greek", "Spanish").\n\nContent: ${content.slice(0, 500)}\n\nLanguage:`,
        },
      ],
      temperature: 0.1,
      max_tokens: 30,
    });

    return response.choices[0]?.message?.content?.trim() || 'English';
  } catch {
    return 'English';
  }
}

/**
 * Extract industry using GPT-4o-mini
 */
async function detectIndustry(content: string, companyName: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Analyze this business content and identify the primary industry category.\n\nCompany: ${companyName}\nContent: ${content.slice(0, 1500)}\n\nReturn ONLY one word for the industry category. Choose from: technology, consulting, ecommerce, healthcare, finance, marketing, education, manufacturing, retail, services, or general.\n\nIndustry:`,
        },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    return response.choices[0]?.message?.content?.trim().toLowerCase() || 'general';
  } catch {
    return 'general';
  }
}

/**
 * Full website analysis with GPT-4o
 */
async function analyzeWithGPT(
  content: string,
  businessInfo: BusinessInfo,
  language: string
): Promise<AnalysisData> {
  const prompt = `You are an AI automation expert. Propose 3 REAL workflow automations for THIS SPECIFIC business.

LANGUAGE: Greek text, English for tech terms (AI, GPT, API, workflow)

BUSINESS:
Company: ${businessInfo.companyName}
Industry: ${businessInfo.industry}
Content:
${content.slice(0, 3000)}

CRITICAL RULE - STAY WITHIN THEIR BUSINESS:
The automations MUST be directly related to the SERVICES/PRODUCTS this business actually provides.
DO NOT suggest automations for services they don't offer!

Example: If a company builds WEBSITES:
✅ AI for generating website content (they build websites)
✅ AI for design-to-code conversion (they build websites)
✅ AI for web project proposals (they sell websites)
❌ Social media automation (they don't do social media)
❌ Email marketing automation (they don't do email marketing)
❌ Customer support chatbot (irrelevant to website building)

FIRST: Read the content and identify EXACTLY what services/products they offer.
THEN: Propose automations ONLY for those specific services.

EXAMPLES OF CORRECT AUTOMATIONS:

WEB DEVELOPMENT AGENCY (builds websites):
1. "AI Website Content Generator" - Δημιουργία κειμένων για τα websites που φτιάχνουν: headlines, about pages, service descriptions. Input: brief πελάτη. Output: έτοιμο copy.
2. "Design-to-Code AI Workflow" - Μετατροπή Figma mockups σε React/HTML code αυτόματα. Μείωση χρόνου front-end development κατά 50%.
3. "AI Web Project Estimator" - Αυτόματη εκτίμηση ωρών και κόστους για web projects. Input: requirements. Output: αναλυτικό quote με breakdown.

E-COMMERCE (sells products online):
1. "AI Product Description Writer" - Bulk generation περιγραφών για εκατοντάδες προϊόντα
2. "Smart Inventory Forecasting" - AI προβλέπει πότε θα τελειώσει stock και τι να παραγγείλεις
3. "Order Processing Automation" - Αυτόματη επεξεργασία παραγγελιών, invoices, shipping labels

RESTAURANT (serves food):
1. "AI Menu Engineering" - Ανάλυση πωλήσεων, βελτιστοποίηση menu για profit
2. "Review Response Bot" - AI απαντάει σε Google/TripAdvisor reviews
3. "Reservation Chatbot" - WhatsApp/web bot για κρατήσεις τραπεζιών

CONSULTING FIRM (provides advice):
1. "AI Research Assistant" - Αυτόματη έρευνα αγοράς πριν από client meetings
2. "Meeting Notes Automation" - AI transcribes calls και γράφει action items
3. "Proposal Generator" - AI γράφει proposals από templates + client data

RETURN ONLY VALID JSON:
{
    "opportunities": [
        {
            "title": "Specific Tool Name (not vague)",
            "description": "What it does step-by-step. Input → Process → Output. (3-5 sentences in Greek)",
            "impact": "Measurable: 'X hours/week saved', 'Y% faster delivery'",
            "implementation": "Tech stack: GPT-4, n8n, Make, custom",
            "roi_estimate": "Implementation timeline",
            "priority": "High/Medium/Low"
        }
    ],
    "overall_assessment": "Brief assessment",
    "recommended_next_steps": "Next steps"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert AI automation consultant. Provide detailed, practical automation recommendations in valid JSON format only.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const aiContent = response.choices[0]?.message?.content || '';

  try {
    const jsonStart = aiContent.indexOf('{');
    const jsonEnd = aiContent.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      return JSON.parse(aiContent.slice(jsonStart, jsonEnd));
    }
  } catch {
    // Fallback
  }

  // Fallback analysis (Greek)
  return {
    opportunities: [
      {
        title: 'Αυτοματοποίηση Επαναλαμβανόμενων Διαδικασιών',
        description: 'Αυτοματοποίηση χειροκίνητων διαδικασιών για βελτίωση της αποδοτικότητας. Περιλαμβάνει workflow automation για εργασίες ρουτίνας, μείωση ανθρώπινων λαθών και απελευθέρωση χρόνου για στρατηγικές δραστηριότητες.',
        impact: '25-35% εξοικονόμηση χρόνου σε καθημερινές εργασίες',
        implementation: 'Εργαλεία workflow automation',
        roi_estimate: '3-6 μήνες απόσβεση',
        priority: 'High',
      },
      {
        title: 'AI Chatbot Εξυπηρέτησης Πελατών',
        description: 'Υλοποίηση έξυπνου AI chatbot για αυτόματη εξυπηρέτηση πελατών. Απαντά σε συχνές ερωτήσεις 24/7, κατευθύνει τους πελάτες στο σωστό τμήμα και μειώνει τον φόρτο της ομάδας υποστήριξης.',
        impact: '24/7 διαθεσιμότητα, 60% ταχύτερη απόκριση',
        implementation: 'AI chatbot platform',
        roi_estimate: 'Άμεση εξοικονόμηση κόστους',
        priority: 'Medium',
      },
      {
        title: 'Αυτοματοποιημένα Analytics & Reporting',
        description: 'Real-time business intelligence με αυτόματη δημιουργία αναφορών. Συγκέντρωση δεδομένων από πολλαπλές πηγές, dashboards για λήψη αποφάσεων και alerts για σημαντικές μεταβολές.',
        impact: 'Data-driven αποφάσεις',
        implementation: 'Analytics platform',
        roi_estimate: '6-12 μήνες στρατηγική αξία',
        priority: 'Medium',
      },
    ],
    overall_assessment: 'Υψηλό δυναμικό για υλοποίηση AI automation.',
    recommended_next_steps: 'Ξεκινήστε με χαρτογράφηση διαδικασιών και προτεραιοποίηση ευκαιριών με το υψηλότερο ROI.',
  };
}

/**
 * Map priority to effort level
 */
function priorityToEffort(priority: string): EffortLevel {
  const p = priority.toLowerCase();
  if (p === 'high') return 'low'; // High priority = usually quick wins = low effort
  if (p === 'low') return 'high';
  return 'medium';
}

/**
 * Map priority to timeline
 */
function priorityToTimeline(priority: string): number {
  const p = priority.toLowerCase();
  if (p === 'high') return 3;
  if (p === 'low') return 10;
  return 6;
}

/**
 * Map priority to impact score
 */
function priorityToImpact(priority: string): number {
  const p = priority.toLowerCase();
  if (p === 'high') return 9;
  if (p === 'low') return 5;
  return 7;
}

/**
 * Guess department from opportunity content
 */
function guessDepartment(opp: RawOpportunity): Department {
  const text = `${opp.title} ${opp.description} ${opp.impact}`.toLowerCase();

  if (text.includes('sales') || text.includes('revenue') || text.includes('lead')) return 'Sales';
  if (text.includes('customer') || text.includes('support') || text.includes('service')) return 'Customer Service';
  if (text.includes('hr') || text.includes('employee') || text.includes('hiring') || text.includes('recruit')) return 'HR';
  if (text.includes('finance') || text.includes('invoice') || text.includes('payment') || text.includes('accounting')) return 'Finance';
  if (text.includes('marketing') || text.includes('campaign') || text.includes('content') || text.includes('social')) return 'Marketing';

  return 'Operations';
}

/**
 * Estimate hours saved per week from impact text
 */
function estimateHoursSaved(impact: string): number {
  // Look for percentage or number patterns
  const percentMatch = impact.match(/(\d+)%/);
  if (percentMatch) {
    const percent = parseInt(percentMatch[1]);
    // Assume 40 hour work week, calculate savings
    return Math.round((percent / 100) * 40 * 0.3); // 30% of percentage as hours
  }

  const hourMatch = impact.match(/(\d+)\s*hour/i);
  if (hourMatch) {
    return parseInt(hourMatch[1]);
  }

  // Default based on keywords
  if (impact.toLowerCase().includes('significant') || impact.toLowerCase().includes('major')) return 15;
  if (impact.toLowerCase().includes('immediate') || impact.toLowerCase().includes('24/7')) return 20;

  return 10;
}

/**
 * Main analysis function - analyzes website and returns structured result
 */
export async function analyzeWebsite(
  url: string,
  content: string,
  title: string
): Promise<AnalysisResult> {
  // Extract company name, language, and industry in parallel
  const [companyName, language, industryRaw] = await Promise.all([
    extractCompanyName(title, content),
    detectLanguage(content),
    detectIndustry(content, title),
  ]);

  // Detect industry with actual company name for better accuracy
  const industry = industryRaw;

  const businessInfo: BusinessInfo = {
    companyName,
    industry,
    services: [],
    technologies: [],
  };

  // Get full analysis
  const analysis = await analyzeWithGPT(content, businessInfo, language);

  // Convert to our format
  const opportunities: Opportunity[] = analysis.opportunities.slice(0, 3).map((opp) => ({
    title: opp.title,
    department: guessDepartment(opp),
    description: opp.description,
    time_savings_hours_week: estimateHoursSaved(opp.impact),
    effort: priorityToEffort(opp.priority),
    timeline_weeks: priorityToTimeline(opp.priority),
    impact_score: priorityToImpact(opp.priority),
  }));

  return {
    company: companyName,
    industry: industry.charAt(0).toUpperCase() + industry.slice(1),
    opportunities,
    raw_summary: analysis.overall_assessment,
  };
}
