/**
 * Firecrawl API integration for website scraping
 */

export interface FirecrawlResult {
  success: boolean;
  url: string;
  content?: string;
  title?: string;
  emails?: string[];
  phones?: string[];
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

    // Extract emails from content with strict validation
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b/g;
    const matchedEmails: string[] = markdown.match(emailPattern) || [];

    // Filter out invalid/fake emails
    const validEmails = matchedEmails.filter(email => {
      const lower = email.toLowerCase();
      // Must have valid TLD
      if (!/\.(com|gr|net|org|eu|io|co|info|biz)$/i.test(email)) return false;
      // Skip example/placeholder emails
      if (lower.includes('example') || lower.includes('test') || lower.includes('your')) return false;
      // Skip image filenames that look like emails
      if (lower.includes('.png') || lower.includes('.jpg') || lower.includes('.svg')) return false;
      // Must have reasonable length
      if (email.length < 6 || email.length > 60) return false;
      return true;
    });
    const emails: string[] = Array.from(new Set(validEmails));

    // Extract phone numbers (Greek and international formats)
    const phonePattern = /(?:\+30|0030)?[\s.-]?(?:2\d{2}|69\d)[\s.-]?\d{3}[\s.-]?\d{4}|\+\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
    const matchedPhones: string[] = markdown.match(phonePattern) || [];
    const phones: string[] = Array.from(new Set(matchedPhones.map(p => p.replace(/[\s.-]/g, ''))));

    return {
      success: true,
      url,
      content: markdown,
      title,
      emails,
      phones,
    };
  } catch (error) {
    return {
      success: false,
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
