import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AnalysisResult, Opportunity, Department, EffortLevel } from '@/lib/types';

const MCP_ENDPOINT = process.env.MCP_ENDPOINT || 'https://web-voice-automation.up.railway.app/mcp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PARSING_PROMPT = `You are a JSON parser. Convert the following analysis text into a structured JSON object.

The JSON must have this exact structure:
{
  "company": "Company Name",
  "industry": "Industry Name",
  "opportunities": [
    {
      "title": "Opportunity Title",
      "department": "Sales" | "Operations" | "HR" | "Customer Service" | "Finance" | "Marketing",
      "description": "2-3 sentence description",
      "time_savings_hours_week": number (estimate hours saved per week),
      "effort": "low" | "medium" | "high",
      "timeline_weeks": number (weeks to implement),
      "impact_score": number (1-10, where 10 is highest impact)
    }
  ]
}

Rules:
- Extract exactly 3 opportunities
- Estimate time_savings_hours_week based on context (typically 5-20 hours)
- Estimate timeline_weeks based on effort (low: 2-4, medium: 4-8, high: 8-12)
- Assign impact_score based on mentioned percentages or business value
- Department must be one of: Sales, Operations, HR, Customer Service, Finance, Marketing
- If company or industry cannot be determined, use reasonable defaults

Return ONLY valid JSON, no markdown or explanation.`;

async function callMCPTool(url: string): Promise<string> {
  const response = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'voice_agent_website_analysis',
        arguments: {
          url: url,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'MCP tool returned an error');
  }

  // Extract the text content from the MCP response
  const content = data.result?.content;
  if (Array.isArray(content) && content.length > 0) {
    return content[0].text || '';
  }

  return typeof content === 'string' ? content : JSON.stringify(content);
}

async function parseAnalysisWithLLM(rawText: string): Promise<AnalysisResult> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: PARSING_PROMPT },
      { role: 'user', content: rawText },
    ],
    temperature: 0.1,
    max_tokens: 1500,
  });

  const responseText = completion.choices[0]?.message?.content || '';

  try {
    const parsed = JSON.parse(responseText);

    // Validate and normalize the response
    const validDepartments: Department[] = ['Sales', 'Operations', 'HR', 'Customer Service', 'Finance', 'Marketing'];
    const validEfforts: EffortLevel[] = ['low', 'medium', 'high'];

    const opportunities: Opportunity[] = (parsed.opportunities || []).slice(0, 3).map((opp: Opportunity) => ({
      title: String(opp.title || 'AI Opportunity'),
      department: validDepartments.includes(opp.department) ? opp.department : 'Operations',
      description: String(opp.description || ''),
      time_savings_hours_week: Number(opp.time_savings_hours_week) || 10,
      effort: validEfforts.includes(opp.effort) ? opp.effort : 'medium',
      timeline_weeks: Number(opp.timeline_weeks) || 4,
      impact_score: Math.min(10, Math.max(1, Number(opp.impact_score) || 7)),
    }));

    return {
      company: String(parsed.company || 'Unknown Company'),
      industry: String(parsed.industry || 'Technology'),
      opportunities,
      raw_summary: rawText,
    };
  } catch (parseError) {
    console.error('Failed to parse LLM response:', parseError);
    throw new Error('Failed to structure analysis results');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Call MCP tool
    const rawAnalysis = await callMCPTool(normalizedUrl);

    if (!rawAnalysis || rawAnalysis.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Analysis returned empty results' },
        { status: 422 }
      );
    }

    // Parse with LLM
    const structuredResult = await parseAnalysisWithLLM(rawAnalysis);

    return NextResponse.json({
      success: true,
      data: structuredResult,
    });
  } catch (error) {
    console.error('Analysis error:', error);

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
