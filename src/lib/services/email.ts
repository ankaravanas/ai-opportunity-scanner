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
function calcAnnualSavings(hoursPerWeek: number): number {
  return hoursPerWeek * 48 * 25;
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `${Math.round(amount / 1000).toLocaleString('el-GR')}K`;
  }
  return amount.toLocaleString('el-GR');
}

/**
 * Get effort label
 */
function getEffortLabel(effort: string): string {
  switch (effort) {
    case 'low': return 'Χαμηλή';
    case 'medium': return 'Μέτρια';
    default: return 'Υψηλή';
  }
}

/**
 * Generate HTML email report - editorial/refined aesthetic
 * Table-based layout for email client compatibility
 */
export function generateHtmlReport(result: AnalysisResult): string {
  const { company, industry, opportunities } = result;
  const now = new Date();
  const dateStr = now.toLocaleDateString('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalHours = opportunities.reduce((sum, opp) => sum + opp.time_savings_hours_week, 0);
  const totalSavings = calcAnnualSavings(totalHours);

  const opportunitiesHtml = opportunities
    .map((opp, i) => {
      const annualSavings = calcAnnualSavings(opp.time_savings_hours_week);

      return `
        <!-- Opportunity ${i + 1} -->
        <tr>
          <td style="padding: 0 0 24px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E5E5E5; border-radius: 4px;">
              <tr>
                <td style="padding: 24px;">
                  <!-- Header row -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <span style="display: inline-block; background: #1A1915; color: #FFFFFF; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 2px; margin-right: 8px;">${i + 1}</span>
                        <span style="font-family: Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">${opp.department}</span>
                      </td>
                      <td style="text-align: right;">
                        <span style="font-family: Arial, sans-serif; font-size: 11px; color: #999999;">Προσπάθεια: ${getEffortLabel(opp.effort)}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Title -->
                  <h3 style="font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: normal; color: #1A1915; margin: 16px 0 12px 0; line-height: 1.4;">${opp.title}</h3>

                  <!-- Description -->
                  <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555555; line-height: 1.7; margin: 0 0 20px 0;">${opp.description}</p>

                  <!-- Metrics -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #E5E5E5; padding-top: 16px;">
                    <tr>
                      <td width="33%" style="padding-top: 16px; text-align: center; border-right: 1px solid #E5E5E5;">
                        <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #D97757; font-weight: bold;">${formatCurrency(annualSavings)}</div>
                        <div style="font-family: Arial, sans-serif; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Ετήσια</div>
                      </td>
                      <td width="33%" style="padding-top: 16px; text-align: center; border-right: 1px solid #E5E5E5;">
                        <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #1A1915;">${opp.time_savings_hours_week}</div>
                        <div style="font-family: Arial, sans-serif; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Ωρες/Εβδ</div>
                      </td>
                      <td width="33%" style="padding-top: 16px; text-align: center;">
                        <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #1A1915;">${opp.timeline_weeks}</div>
                        <div style="font-family: Arial, sans-serif; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Εβδομαδες</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Opportunity Report - ${company}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9F7; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF9F7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Main container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid #E5E5E5;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #1A1915; font-weight: bold;">Liberators</span>
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #D97757; font-weight: bold;"> AI</span>
                  </td>
                  <td style="text-align: right;">
                    <span style="font-family: Arial, sans-serif; font-size: 12px; color: #999999;">${dateStr}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title section -->
          <tr>
            <td style="padding: 48px 40px 32px 40px;">
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #D97757; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">AI Opportunity Report</p>
              <h1 style="font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: normal; color: #1A1915; margin: 0 0 8px 0; line-height: 1.2;">${company}</h1>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; margin: 0;">${industry}</p>
            </td>
          </tr>

          <!-- Total savings -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1A1915; border-radius: 4px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <p style="font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Συνολικη Ετησια Εξοικονομηση</p>
                    <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 42px; color: #FFFFFF; margin: 0; font-weight: bold;">${formatCurrency(totalSavings)}</p>
                    <p style="font-family: Arial, sans-serif; font-size: 12px; color: rgba(255,255,255,0.5); margin: 12px 0 0 0;">${totalHours} ωρες/εβδ. x 48 εβδ. x 25/ωρα</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section title -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Ευκαιριες Αυτοματοποιησης</p>
              <div style="width: 40px; height: 2px; background-color: #D97757;"></div>
            </td>
          </tr>

          <!-- Opportunities -->
          <tr>
            <td style="padding: 0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${opportunitiesHtml}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 16px 40px 48px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 2px solid #D97757; border-radius: 4px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <h3 style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: normal; color: #1A1915; margin: 0 0 12px 0;">Ετοιμοι να ξεκινησετε;</h3>
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; margin: 0 0 24px 0;">Κλειστε ενα δωρεαν 30-λεπτο call για να συζητησουμε πως μπορουμε να υλοποιησουμε αυτες τις ευκαιριες.</p>
                    <a href="https://calendly.com/liberators-ai/30min" style="display: inline-block; background-color: #D97757; color: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 4px;">Κλειστε Call</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #FAFAFA; border-top: 1px solid #E5E5E5;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; color: #1A1915; margin: 0 0 4px 0; font-weight: bold;">Liberators AI</p>
                    <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">Your Business, Automated with AI</p>
                  </td>
                  <td style="text-align: right;">
                    <a href="mailto:hello@liberators.ai" style="font-family: Arial, sans-serif; font-size: 12px; color: #D97757; text-decoration: none;">hello@liberators.ai</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Disclaimer -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
          <tr>
            <td style="padding: 24px 40px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #AAAAAA; line-height: 1.6; margin: 0;">
                Οι εκτιμησεις βασιζονται σε μεσους ορους αγορας.<br>
                Τα πραγματικα αποτελεσματα μπορει να διαφερουν.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
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
