/**
 * ClickUp API service for lead capture
 * Target: AI Labs workspace → Internal (CRM & Access) → CRM
 */

// CRM list custom field IDs
const CRM_FIELDS = {
  website: 'ab66a021-fe3e-40b5-9a17-104164bd7020',      // 🌐 Website (url)
  email: '8312ad71-dcb1-4e69-8559-3362c2c01665',        // 📥 Contact Email (email)
  phone: 'dcb4bf64-de78-443a-8057-be0daa0b56e1',        // 📱 Phone Number (phone)
  extraBrief: 'bcc25936-cc6f-4ebb-b38f-bbeaabcf3fd1',   // 📕 Extra Brief (text)
};

export interface LeadData {
  companyName: string;
  industry: string;
  websiteUrl: string;
  emails?: string[];
  phones?: string[];
}

/**
 * Capture lead in ClickUp CRM with custom fields
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

    // Clean description - just the essentials
    const description = `Lead από AI Opportunity Scanner\nΗμερομηνία: ${now}\nIndustry: ${data.industry}`;

    // Build custom fields array
    const customFields: Array<{ id: string; value: string }> = [];

    // Website field (required)
    customFields.push({
      id: CRM_FIELDS.website,
      value: data.websiteUrl,
    });

    // Email field (first email if available)
    if (data.emails?.length) {
      customFields.push({
        id: CRM_FIELDS.email,
        value: data.emails[0],
      });
    }

    // Phone field (first phone if available)
    if (data.phones?.length) {
      customFields.push({
        id: CRM_FIELDS.phone,
        value: data.phones[0],
      });
    }

    // Extra brief with all contact info
    const briefParts: string[] = [];
    if (data.emails?.length) {
      briefParts.push(`Emails: ${data.emails.join(', ')}`);
    }
    if (data.phones?.length) {
      briefParts.push(`Phones: ${data.phones.join(', ')}`);
    }
    if (briefParts.length > 0) {
      customFields.push({
        id: CRM_FIELDS.extraBrief,
        value: briefParts.join('\n'),
      });
    }

    const taskData = {
      name: data.companyName,
      description,
      status: 'lead',
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
