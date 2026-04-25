import { NextRequest } from 'next/server';
import { scrapeWebsite } from '@/lib/services/firecrawl';
import { analyzeWebsite } from '@/lib/services/analysis';
import { captureClickUpLead } from '@/lib/services/clickup';
import { sendSlackLeadNotification } from '@/lib/services/slack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProgressEvent {
  step: number;
  status: 'start' | 'complete' | 'error';
  message: string;
  data?: unknown;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: ProgressEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const body = await request.json();
        const { url } = body;

        if (!url || typeof url !== 'string') {
          send({ step: 0, status: 'error', message: 'URL is required' });
          controller.close();
          return;
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
          send({ step: 0, status: 'error', message: 'Invalid URL' });
          controller.close();
          return;
        }

        // Step 1: Scraping
        send({ step: 1, status: 'start', message: 'Scraping website' });
        const scrapeResult = await scrapeWebsite(normalizedUrl);

        if (!scrapeResult.success || !scrapeResult.content) {
          send({ step: 1, status: 'error', message: scrapeResult.error || 'Failed to scrape' });
          controller.close();
          return;
        }
        send({ step: 1, status: 'complete', message: 'Website scraped' });

        // Step 2: Analyzing
        send({ step: 2, status: 'start', message: 'Analyzing with AI' });
        const analysisResult = await analyzeWebsite(
          normalizedUrl,
          scrapeResult.content,
          scrapeResult.title || ''
        );
        send({ step: 2, status: 'complete', message: 'Analysis complete' });

        // Step 3: Saving lead
        send({ step: 3, status: 'start', message: 'Saving lead' });
        const opportunityTitles = analysisResult.opportunities.map(o => o.title);

        const clickupResult = await captureClickUpLead({
          companyName: analysisResult.company,
          industry: analysisResult.industry,
          websiteUrl: normalizedUrl,
          emails: scrapeResult.emails,
          phones: scrapeResult.phones,
          businessSummary: analysisResult.raw_summary,
          opportunities: opportunityTitles,
        }).catch(() => ({ success: false, taskId: undefined }));

        // Send Slack notification
        await sendSlackLeadNotification({
          companyName: analysisResult.company,
          websiteUrl: normalizedUrl,
          industry: analysisResult.industry,
          opportunities: opportunityTitles,
          clickupTaskId: clickupResult?.taskId,
        }).catch((err) => {
          console.error('[Slack] Notification failed:', err);
        });

        send({ step: 3, status: 'complete', message: 'Lead saved' });

        // Done - send final result
        send({
          step: 4,
          status: 'complete',
          message: 'Done',
          data: { success: true, data: analysisResult },
        });

        controller.close();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ step: 0, status: 'error', message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
