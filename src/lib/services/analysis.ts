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
 * Extract company name from page title
 */
function extractCompanyName(title: string): string {
  if (!title) return 'Unknown Company';
  // Take first part before common separators
  const parts = title.split(/[-|–—·]/);
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
  const prompt = `You are an expert AI automation consultant. Analyze this business and identify exactly 3 specific AI automation opportunities.

IMPORTANT: The website content is in ${language}. Please respond in the SAME LANGUAGE as the website content.

BUSINESS INFORMATION:
- Company: ${businessInfo.companyName}
- Industry: ${businessInfo.industry}
- Services: ${businessInfo.services.join(', ') || 'Not specified'}
- Technologies: ${businessInfo.technologies.join(', ') || 'Not specified'}

WEBSITE CONTENT ANALYSIS:
${content.slice(0, 2500)}

ANALYSIS REQUIREMENTS:
Identify exactly 3 AI automation opportunities that are:
- Practical and implementable
- Aligned with their business model
- Focused on ROI within 6-12 months
- Specific to their industry and operations
- Do NOT mention any pricing, costs, or fees
- Respond in ${language}

Return ONLY valid JSON in this exact format:
{
    "opportunities": [
        {
            "title": "Specific automation solution name",
            "description": "Detailed description (2-3 sentences max)",
            "impact": "Specific business benefits",
            "implementation": "Implementation approach",
            "roi_estimate": "ROI timeframe",
            "priority": "High/Medium/Low"
        }
    ],
    "overall_assessment": "Business automation readiness assessment",
    "recommended_next_steps": "Specific actionable next steps"
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

  // Fallback analysis
  return {
    opportunities: [
      {
        title: 'Process Automation Implementation',
        description: 'Automate repetitive manual processes to improve efficiency.',
        impact: '25-35% time savings on routine operations',
        implementation: 'Workflow automation tools',
        roi_estimate: '3-6 months payback',
        priority: 'High',
      },
      {
        title: 'AI-Powered Customer Service',
        description: 'Implement intelligent chatbots and automated support.',
        impact: '24/7 availability with 60% faster response times',
        implementation: 'AI chatbot platform',
        roi_estimate: 'Immediate cost savings',
        priority: 'Medium',
      },
      {
        title: 'Automated Data Analytics',
        description: 'Real-time business intelligence and automated reporting.',
        impact: 'Data-driven decision making',
        implementation: 'Analytics platform',
        roi_estimate: '6-12 months strategic value',
        priority: 'Medium',
      },
    ],
    overall_assessment: 'Strong potential for AI automation implementation.',
    recommended_next_steps: 'Begin with process mapping and prioritize highest-ROI opportunities.',
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
  // Extract basic info
  const companyName = extractCompanyName(title);

  // Detect language and industry in parallel
  const [language, industry] = await Promise.all([
    detectLanguage(content),
    detectIndustry(content, companyName),
  ]);

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
