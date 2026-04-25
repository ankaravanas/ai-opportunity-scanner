/**
 * ClickUp API service for lead capture
 * Target: AI Labs workspace → Internal (CRM & Access) → CRM
 */

// CRM list custom field IDs
const CRM_FIELDS = {
  website: 'ab66a021-fe3e-40b5-9a17-104164bd7020',      // 🌐 Website (url)
  email: '8312ad71-dcb1-4e69-8559-3362c2c01665',        // 📥 Contact Email (email)
  phone: 'dcb4bf64-de78-443a-8057-be0daa0b56e1',        // 📱 Phone Number (phone)
};

export interface LeadData {
  companyName: string;
  industry: string;
  websiteUrl: string;
  emails?: string[];
  phones?: string[];
  businessSummary?: string;
  opportunities?: string[];
}

/**
 * Validate email format strictly
 */
function isValidEmail(email: string): boolean {
  if (!email || email.length < 6 || email.length > 60) return false;
  const lower = email.toLowerCase();
  // Must match proper email format
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return false;
  // Skip example/placeholder emails
  if (lower.includes('example') || lower.includes('test') || lower.includes('your')) return false;
  // Skip image filenames
  if (lower.includes('.png') || lower.includes('.jpg') || lower.includes('.svg')) return false;
  return true;
}

export interface ClickUpResult {
  success: boolean;
  taskId?: string;
}

/**
 * Capture lead in ClickUp CRM with custom fields
 */
export async function captureClickUpLead(data: LeadData): Promise<ClickUpResult> {
  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_LIST_ID;

  if (!apiKey || !listId) {
    console.log('[ClickUp] Not configured, skipping lead capture');
    return { success: false };
  }

  try {
    const now = new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' });

    // Build rich description
    const descriptionParts: string[] = [
      `📅 ${now}`,
      `🏢 Sector: ${data.industry}`,
      '',
    ];

    // Add business summary if available
    if (data.businessSummary) {
      descriptionParts.push('📝 Περιγραφή:');
      descriptionParts.push(data.businessSummary);
      descriptionParts.push('');
    }

    // Add opportunities if available
    if (data.opportunities?.length) {
      descriptionParts.push('💡 AI Opportunities:');
      data.opportunities.forEach((opp, i) => {
        descriptionParts.push(`${i + 1}. ${opp}`);
      });
      descriptionParts.push('');
    }

    descriptionParts.push('---');
    descriptionParts.push('🤖 Πηγή: AI Opportunity Scanner (scan.liberators.ai)');
    descriptionParts.push('📊 Lead captured automatically via website analysis tool');

    const description = descriptionParts.join('\n');

    // Build custom fields array
    const customFields: Array<{ id: string; value: string }> = [];

    // Website field (required)
    customFields.push({
      id: CRM_FIELDS.website,
      value: data.websiteUrl,
    });

    // Email field (first VALID email only)
    const validEmail = data.emails?.find(e => isValidEmail(e));
    if (validEmail) {
      customFields.push({
        id: CRM_FIELDS.email,
        value: validEmail,
      });
    }

    // Phone field (first phone if available)
    if (data.phones?.length && data.phones[0]) {
      customFields.push({
        id: CRM_FIELDS.phone,
        value: data.phones[0],
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
      return { success: true, taskId: result.id };
    } else {
      const errorText = await response.text();
      console.error(`[ClickUp] Failed: ${response.status} - ${errorText}`);
      return { success: false };
    }
  } catch (error) {
    console.error('[ClickUp] Error:', error);
    return { success: false };
  }
}
