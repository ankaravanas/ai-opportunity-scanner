/**
 * ClickUp API service for lead capture
 */

// Custom field IDs for Account Hub list
const CLICKUP_FIELDS = {
  website: 'a2c503df-2704-4819-92d8-80d6402e447d',    // 🌐 Website
  email: '5b234a2d-29d0-4dc0-8270-55c068506971',       // 📥 Contact Email
};

export interface LeadData {
  companyName: string;
  industry: string;
  websiteUrl: string;
  emails?: string[];
}

/**
 * Silently capture lead in ClickUp with status "lead"
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
    const now = new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' });

    const description = [
      '🚀 Lead from AI Opportunity Scanner',
      `📅 Ημερομηνία: ${now}`,
      `🌐 Website: ${data.websiteUrl}`,
      `🏢 Industry: ${data.industry}`,
      data.emails?.length ? `📧 Emails: ${data.emails.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    // Build custom fields array
    const customFields: Array<{ id: string; value: string }> = [
      { id: CLICKUP_FIELDS.website, value: data.websiteUrl },
    ];

    if (data.emails?.length) {
      customFields.push({ id: CLICKUP_FIELDS.email, value: data.emails[0] });
    }

    const taskData = {
      name: data.companyName,
      description,
      status: 'lead',  // Explicitly set status to "lead"
      custom_fields: customFields,
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
