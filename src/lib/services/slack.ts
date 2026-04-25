/**
 * Slack notification service for lead alerts
 */

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID || 'C0AV6PT92AJ';

export interface SlackLeadNotification {
  companyName: string;
  websiteUrl: string;
  industry: string;
  opportunities: string[];
  clickupTaskId?: string;
}

/**
 * Send Slack notification when a new lead is captured
 */
export async function sendSlackLeadNotification(data: SlackLeadNotification): Promise<void> {
  const token = SLACK_BOT_TOKEN;

  console.log('[Slack] Attempting to send notification for:', data.companyName);
  console.log('[Slack] Token exists:', !!token);
  console.log('[Slack] Channel:', SLACK_CHANNEL_ID);

  if (!token) {
    console.error('[Slack] SLACK_BOT_TOKEN not configured, skipping notification');
    return;
  }

  try {
    const now = new Date().toLocaleString('el-GR', {
      timeZone: 'Europe/Athens',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Extract domain from URL
    let domain = data.websiteUrl;
    try {
      domain = new URL(data.websiteUrl).hostname.replace('www.', '');
    } catch {
      // Keep original if parsing fails
    }

    // Build opportunities list
    const oppList = data.opportunities
      .slice(0, 3)
      .map((opp, i) => `${i + 1}. ${opp}`)
      .join('\n');

    // Create rich Slack message
    const message = {
      channel: SLACK_CHANNEL_ID,
      username: 'AI Scanner Bot',
      icon_emoji: ':robot_face:',
      text: `🎯 Νέο Lead: ${data.companyName} (${domain})`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🎯 ${data.companyName}`,
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${data.websiteUrl}|${domain}> · ${data.industry}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*💡 AI Opportunities:*\n${oppList}`
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `📊 Πηγή: *scan.liberators.ai* | ⏰ ${now}`
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: data.clickupTaskId
                ? `✅ Προστέθηκε στο ClickUp CRM (ID: ${data.clickupTaskId})`
                : '✅ Προστέθηκε στο ClickUp CRM'
            }
          ]
        }
      ]
    };

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(message)
    });

    const result = await response.json();
    console.log('[Slack] API Response:', JSON.stringify(result, null, 2));

    if (result.ok) {
      console.log(`[Slack] ✅ Notification sent for: ${data.companyName}`);
    } else {
      console.error(`[Slack] ❌ API error: ${result.error}`);
      if (result.response_metadata?.messages) {
        console.error('[Slack] Details:', result.response_metadata.messages);
      }
    }
  } catch (error) {
    console.error('[Slack] Error:', error);
  }
}
