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
 * Calculate annual savings
 */
function calcAnnualSavings(hoursPerWeek: number): string {
  const annual = hoursPerWeek * 48 * 25;
  if (annual >= 1000) {
    return `€${Math.round(annual / 1000)}K`;
  }
  return `€${annual}`;
}

/**
 * Get effort badge color
 */
function getEffortStyle(effort: string): { bg: string; label: string } {
  switch (effort) {
    case 'low':
      return { bg: '#10B981', label: 'Quick Win' };
    case 'medium':
      return { bg: '#F59E0B', label: 'Μέτρια Προσπάθεια' };
    default:
      return { bg: '#EF4444', label: 'Στρατηγικό' };
  }
}

/**
 * Generate beautiful HTML report from analysis result
 */
export function generateHtmlReport(result: AnalysisResult): string {
  const { company, industry, opportunities } = result;
  const now = new Date();
  const dateStr = now.toLocaleDateString('el-GR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calculate total potential savings
  const totalHours = opportunities.reduce((sum, opp) => sum + opp.time_savings_hours_week, 0);
  const totalSavings = calcAnnualSavings(totalHours);

  const opportunitiesHtml = opportunities
    .map((opp, i) => {
      const effortStyle = getEffortStyle(opp.effort);
      const annualSavings = calcAnnualSavings(opp.time_savings_hours_week);

      return `
      <div style="background: #FFFFFF; border-radius: 16px; padding: 24px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <!-- Header with number and effort badge -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="background: linear-gradient(135deg, #D97757 0%, #C4614B 100%); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">${i + 1}</div>
            <span style="background: #F3F4F6; color: #6B7280; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${opp.department}</span>
          </div>
          <span style="background: ${effortStyle.bg}; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">${effortStyle.label}</span>
        </div>

        <!-- Title -->
        <h3 style="color: #1A1915; margin: 0 0 12px 0; font-size: 18px; font-weight: 700; line-height: 1.4;">${opp.title}</h3>

        <!-- Description -->
        <p style="color: #4B5563; margin: 0 0 20px 0; font-size: 14px; line-height: 1.7;">${opp.description}</p>

        <!-- Metrics Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div style="background: #FEF7F5; border-radius: 12px; padding: 16px; text-align: center;">
            <div style="color: #D97757; font-size: 22px; font-weight: 700;">${annualSavings}</div>
            <div style="color: #9CA3AF; font-size: 11px; margin-top: 4px;">Ετήσια Εξοικονόμηση</div>
          </div>
          <div style="background: #F0FDF4; border-radius: 12px; padding: 16px; text-align: center;">
            <div style="color: #10B981; font-size: 22px; font-weight: 700;">${opp.time_savings_hours_week}h</div>
            <div style="color: #9CA3AF; font-size: 11px; margin-top: 4px;">Ώρες/Εβδομάδα</div>
          </div>
          <div style="background: #EFF6FF; border-radius: 12px; padding: 16px; text-align: center;">
            <div style="color: #3B82F6; font-size: 22px; font-weight: 700;">${opp.timeline_weeks}</div>
            <div style="color: #9CA3AF; font-size: 11px; margin-top: 4px;">Εβδομάδες</div>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Opportunities Report - ${company}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%); color: #1A1915; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 640px; margin: 0 auto; padding: 40px 20px;">

    <!-- Logo Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #1A1915 0%, #2D2D2D 100%); padding: 16px 32px; border-radius: 50px;">
        <span style="color: white; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Liberators</span>
        <span style="color: #D97757; font-size: 20px; font-weight: 700;"> AI</span>
      </div>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);">

      <!-- Hero Section -->
      <div style="background: linear-gradient(135deg, #1A1915 0%, #2D2D2D 100%); padding: 48px 32px; text-align: center;">
        <div style="color: #D97757; font-size: 13px; font-weight: 600; letter-spacing: 2px; margin-bottom: 16px;">AI OPPORTUNITY REPORT</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; line-height: 1.3;">${company}</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 12px 0 0 0; font-size: 14px;">${industry} • ${dateStr}</p>
      </div>

      <!-- Total Savings Banner -->
      <div style="background: linear-gradient(135deg, #D97757 0%, #C4614B 100%); padding: 28px 32px; text-align: center;">
        <div style="color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 500; margin-bottom: 8px;">Συνολική Δυνητική Ετήσια Εξοικονόμηση</div>
        <div style="color: white; font-size: 42px; font-weight: 800; letter-spacing: -1px;">${totalSavings}</div>
        <div style="color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 8px;">${totalHours} ώρες/εβδομάδα × 48 εβδομάδες × €25/ώρα</div>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">

        <!-- Assessment -->
        <div style="background: #F8F9FA; border-radius: 16px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #D97757;">
          <h2 style="color: #1A1915; margin: 0 0 12px 0; font-size: 16px; font-weight: 700;">📊 Αξιολόγηση</h2>
          <p style="color: #4B5563; margin: 0; font-size: 14px; line-height: 1.7;">${result.raw_summary || 'Η επιχείρησή σας έχει σημαντικό δυναμικό για αυτοματοποίηση με AI. Οι παρακάτω ευκαιρίες μπορούν να βελτιώσουν την αποδοτικότητα και να μειώσουν το λειτουργικό κόστος.'}</p>
        </div>

        <!-- Section Title -->
        <h2 style="color: #1A1915; margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">🚀 AI Ευκαιρίες Αυτοματοποίησης</h2>
        <p style="color: #6B7280; margin: 0 0 24px 0; font-size: 14px;">Εντοπίσαμε 3 ευκαιρίες προσαρμοσμένες στην επιχείρησή σας</p>

        <!-- Opportunities -->
        ${opportunitiesHtml}

        <!-- CTA Section -->
        <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-radius: 16px; padding: 32px; margin-top: 32px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 16px;">🎯</div>
          <h3 style="color: #1A1915; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Έτοιμοι να Ξεκινήσετε;</h3>
          <p style="color: #4B5563; margin: 0 0 24px 0; font-size: 14px; line-height: 1.7;">Κλείστε ένα δωρεάν 30-λεπτο call με τους AI experts μας για να συζητήσουμε πώς μπορούμε να υλοποιήσουμε αυτές τις ευκαιρίες.</p>
          <a href="https://calendly.com/liberators-ai/30min" style="display: inline-block; background: linear-gradient(135deg, #D97757 0%, #C4614B 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 15px; box-shadow: 0 8px 20px rgba(217,119,87,0.35);">Κλείστε Δωρεάν Call →</a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background: #1A1915; padding: 32px; text-align: center;">
        <p style="color: white; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Liberators AI</p>
        <p style="color: rgba(255,255,255,0.6); margin: 0 0 16px 0; font-size: 13px;">Your Business, Automated with AI</p>
        <div>
          <a href="mailto:hello@liberators.ai" style="color: #D97757; text-decoration: none; font-size: 13px; margin: 0 12px;">hello@liberators.ai</a>
          <a href="https://liberators.ai" style="color: #D97757; text-decoration: none; font-size: 13px; margin: 0 12px;">liberators.ai</a>
        </div>
      </div>

    </div>

    <!-- Disclaimer -->
    <p style="text-align: center; color: #9CA3AF; font-size: 11px; margin-top: 24px; line-height: 1.6;">
      Αυτό το report δημιουργήθηκε αυτόματα από το AI Opportunity Scanner.<br>
      Οι εκτιμήσεις βασίζονται σε μέσους όρους αγοράς και μπορεί να διαφέρουν ανάλογα με την επιχείρησή σας.
    </p>

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
