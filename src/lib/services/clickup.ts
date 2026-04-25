/**
 * ClickUp API service for lead capture
 * Target: AI Labs workspace → Internal (CRM & Access) → CRM
 */

export interface LeadData {
  companyName: string;
  industry: string;
  websiteUrl: string;
  emails?: string[];
}

/**
 * Capture lead in ClickUp (🔥 Leads list)
 * Runs in the background, doesn't affect main flow
 */
export async function captureClickUpLead(data: LeadData): Promise<void> {
  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_LIST_ID;

  if (!apiKey || !listId) {
    console.log('[ClickUp] Not configured, skipping lead capture');
    return;
  }

  try {
    const now = new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' });

    const description = [
      '🚀 **Lead from AI Opportunity Scanner**',
      '',
      `📅 **Ημερομηνία:** ${now}`,
      `🌐 **Website:** ${data.websiteUrl}`,
      `🏢 **Industry:** ${data.industry}`,
      data.emails?.length ? `📧 **Emails:** ${data.emails.join(', ')}` : '',
      '',
      '---',
      '_Αυτόματη καταχώρηση από scan.liberators.ai_',
    ]
      .filter(Boolean)
      .join('\n');

    const taskData = {
      name: data.companyName,
      description,
      status: 'lead',  // CRM list status
    };

    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log(`[ClickUp] Lead captured: ${data.companyName} (ID: ${result.id})`);
    } else {
      const errorText = await response.text();
      console.error(`[ClickUp] Failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('[ClickUp] Error:', error);
  }
}
