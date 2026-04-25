/**
 * Gmail API service for sending reports
 */

import { AnalysisResult } from '../types';

interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

// Cache for last analysis (for sending report later)
let cachedReport: {
  html: string;
  companyName: string;
  timestamp: string;
} | null = null;

/**
 * Generate HTML report from analysis result
 */
export function generateHtmlReport(result: AnalysisResult): string {
  const { company, industry, opportunities } = result;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const opportunitiesHtml = opportunities
    .map(
      (opp, i) => `
      <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin: 15px 0; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #D97757; padding-bottom: 6px; font-size: 1.2em;">
          ${i + 1}. ${opp.title}
        </h3>
        <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 0.8em; font-weight: bold; margin-bottom: 12px; background: ${opp.effort === 'low' ? '#27ae60' : opp.effort === 'medium' ? '#f39c12' : '#e74c3c'}; color: white;">
          ${opp.effort === 'low' ? 'Quick Win' : opp.effort === 'medium' ? 'Medium Effort' : 'Strategic'}
        </span>
        <div style="background: #ecf0f1; padding: 10px; border-radius: 6px; margin: 8px 0;">
          <strong style="color: #2c3e50;">Department:</strong> ${opp.department}
        </div>
        <div style="background: #ecf0f1; padding: 10px; border-radius: 6px; margin: 8px 0;">
          <strong style="color: #2c3e50;">Description:</strong> ${opp.description}
        </div>
        <div style="background: #ecf0f1; padding: 10px; border-radius: 6px; margin: 8px 0;">
          <strong style="color: #2c3e50;">Time Savings:</strong> ~${opp.time_savings_hours_week} hours/week
        </div>
        <div style="background: #ecf0f1; padding: 10px; border-radius: 6px; margin: 8px 0;">
          <strong style="color: #2c3e50;">Timeline:</strong> ${opp.timeline_weeks} weeks
        </div>
      </div>
    `
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Automation Opportunities Report - ${company}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 10px; background: #FAF9F7; color: #1A1915;">
  <div style="max-width: 100%; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
    <div style="background: #1A1915; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 1.8em; font-weight: 300;">AI Automation Opportunities Report</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 0.9em;">Comprehensive Analysis for ${company}</p>
      <p style="margin: 8px 0 0 0; opacity: 0.7; font-size: 0.8em;">Generated: ${dateStr}</p>
    </div>

    <div style="padding: 20px;">
      <div style="background: #FDF8F5; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #D97757;">
        <h2 style="color: #1A1915; margin-top: 0; font-size: 1.3em;">Business Overview</h2>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Industry:</strong> ${industry}</p>
      </div>

      <div style="background: #D97757; color: white; padding: 18px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0;">Overall Assessment</h2>
        <p style="margin: 0;">${result.raw_summary || 'This business shows strong potential for AI automation implementation.'}</p>
      </div>

      <h2 style="color: #1A1915;">AI Automation Opportunities</h2>
      ${opportunitiesHtml}

      <div style="background: #E5F2ED; border: 1px solid #27ae60; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <h3 style="color: #27ae60; margin-top: 0; font-size: 1.2em;">Next Steps</h3>
        <p>Ready to implement these opportunities? Book a free 30-minute call with our AI automation experts.</p>
        <a href="https://calendly.com/andreaskaravanas/30-minute-demo" style="display: inline-block; padding: 12px 24px; background: #D97757; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Book Free Call</a>
      </div>
    </div>

    <div style="background: #1A1915; color: white; text-align: center; padding: 15px; font-size: 0.85em;">
      <p style="margin: 0;"><strong>Liberators AI</strong> - Your Business, Automated with AI</p>
      <p style="margin: 8px 0 0 0;">Contact: <a href="mailto:hello@liberators.ai" style="color: #D97757;">hello@liberators.ai</a> | <a href="https://liberators.ai" style="color: #D97757;">liberators.ai</a></p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Cache the report for later sending
 */
export function cacheReport(result: AnalysisResult): void {
  cachedReport = {
    html: generateHtmlReport(result),
    companyName: result.company,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get cached report
 */
export function getCachedReport(): typeof cachedReport {
  return cachedReport;
}

/**
 * Send HTML email via Gmail API using OAuth2
 */
export async function sendEmailReport(
  recipientEmail: string,
  htmlReport?: string,
  companyName?: string
): Promise<EmailResult> {
  // Use cached report if not provided
  const report = htmlReport || cachedReport?.html;
  const company = companyName || cachedReport?.companyName || 'Business';

  if (!report) {
    return { success: false, error: 'No report available. Run analysis first.' };
  }

  const gmailUser = process.env.GMAIL_USER;
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!gmailUser || !clientId || !clientSecret || !refreshToken) {
    return { success: false, error: 'Gmail OAuth2 credentials not configured' };
  }

  try {
    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!tokenResponse.ok) {
      return { success: false, error: 'Failed to refresh OAuth2 token' };
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create email
    const subject = `AI Automation Opportunities Report - ${company}`;
    const emailContent = `To: ${recipientEmail}
From: Liberators AI <${gmailUser}>
Subject: ${subject}
Content-Type: text/html; charset=utf-8

${report}`;

    // Encode for Gmail API
    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send via Gmail API
    const sendResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    );

    if (sendResponse.ok) {
      const data = await sendResponse.json();
      return { success: true, messageId: data.id };
    } else {
      const error = await sendResponse.text();
      return { success: false, error: `Gmail API failed: ${error.slice(0, 200)}` };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
