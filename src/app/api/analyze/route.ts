import { NextRequest, NextResponse } from 'next/server';
import { scrapeWebsite } from '@/lib/services/firecrawl';
import { analyzeWebsite } from '@/lib/services/analysis';
import { cacheReport } from '@/lib/services/email';
import { captureClickUpLead } from '@/lib/services/clickup';

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

    // Validate URL
    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Step 1: Scrape website with Firecrawl
    console.log(`[Analyze] Scraping: ${normalizedUrl}`);
    const scrapeResult = await scrapeWebsite(normalizedUrl);

    if (!scrapeResult.success || !scrapeResult.content) {
      return NextResponse.json(
        { success: false, error: scrapeResult.error || 'Failed to scrape website' },
        { status: 422 }
      );
    }

    // Step 2: Analyze with OpenAI
    console.log(`[Analyze] Analyzing: ${scrapeResult.title}`);
    const analysisResult = await analyzeWebsite(
      normalizedUrl,
      scrapeResult.content,
      scrapeResult.title || ''
    );

    // Step 3: Cache report for later email sending
    cacheReport(analysisResult);

    // Step 4: Capture lead in ClickUp (background, non-blocking)
    captureClickUpLead({
      companyName: analysisResult.company,
      industry: analysisResult.industry,
      websiteUrl: normalizedUrl,
      emails: scrapeResult.emails,
    }).catch(() => {}); // Silently ignore errors

    console.log(`[Analyze] Complete: ${analysisResult.company}`);

    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error('[Analyze] Error:', error);

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
