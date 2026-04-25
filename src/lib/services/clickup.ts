/**
 * ClickUp API service for lead capture
 */

interface LeadData {
  companyName: string;
  industry: string;
  websiteUrl: string;
  emails?: string[];
}

/**
 * Silently capture lead in ClickUp
 * This runs in the background and doesn't affect the main flow
 */
export async function captureClickUpLead(data: LeadData): Promise<void> {
  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_LIST_ID;

  if (!apiKey || !listId) {
    console.log('[ClickUp] Not configured, skipping lead capture');
    return;
  }

  try {
    const now = new Date().toISOString();

    const description = [
      '🚀 Lead from AI Opportunity Scanner',
      `📅 Date: ${now}`,
      `🌐 Website: ${data.websiteUrl}`,
      `🏢 Industry: ${data.industry}`,
      data.emails?.length ? `📧 Emails: ${data.emails.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const taskData: Record<string, unknown> = {
      name: data.companyName,
      description,
    };

    // Add custom fields if configured
    const customFields = [];

    // Website field
    if (process.env.CLICKUP_FIELD_WEBSITE) {
      customFields.push({
        id: process.env.CLICKUP_FIELD_WEBSITE,
        value: data.websiteUrl,
      });
    }

    // Email field
    if (process.env.CLICKUP_FIELD_EMAIL && data.emails?.length) {
      customFields.push({
        id: process.env.CLICKUP_FIELD_EMAIL,
        value: data.emails[0],
      });
    }

    if (customFields.length > 0) {
      taskData.custom_fields = customFields;
    }

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
      console.log(`[ClickUp] Lead captured: ${data.companyName}`);
    } else {
      console.error(`[ClickUp] Failed: ${response.status}`);
    }
  } catch (error) {
    console.error('[ClickUp] Error:', error);
  }
}
