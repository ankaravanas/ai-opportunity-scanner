/**
 * Firecrawl API integration for website scraping
 */

export interface FirecrawlResult {
  success: boolean;
  url: string;
  content?: string;
  title?: string;
  emails?: string[];
  error?: string;
}

export async function scrapeWebsite(url: string): Promise<FirecrawlResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    return { success: false, url, error: 'FIRECRAWL_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
        timeout: 60000,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        url,
        error: `Firecrawl API failed with status ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        url,
        error: data.error || 'Firecrawl returned success=false',
      };
    }

    const crawlData = data.data || {};
    const markdown = crawlData.markdown || '';
    const metadata = crawlData.metadata || {};
    const title = metadata.title || crawlData.title || '';

    // Extract emails from content
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/g;
    const matchedEmails: string[] = markdown.match(emailPattern) || [];
    const emails: string[] = Array.from(new Set(matchedEmails));

    return {
      success: true,
      url,
      content: markdown,
      title,
      emails,
    };
  } catch (error) {
    return {
      success: false,
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
