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

  if (!token) {
    console.log('[Slack] Not configured, skipping notification');
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
      text: `🎯 Νέο Lead από AI Opportunity Scanner!`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎯 Νέο Lead από AI Opportunity Scanner',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*🏢 Εταιρεία:*\n${data.companyName}`
            },
            {
              type: 'mrkdwn',
              text: `*🏷️ Κλάδος:*\n${data.industry}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🌐 Website:*\n<${data.websiteUrl}|${data.websiteUrl}>`
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

    if (response.ok) {
      const result = await response.json();
      if (result.ok) {
        console.log(`[Slack] Notification sent for: ${data.companyName}`);
      } else {
        console.error(`[Slack] API error: ${result.error}`);
      }
    } else {
      console.error(`[Slack] HTTP error: ${response.status}`);
    }
  } catch (error) {
    console.error('[Slack] Error:', error);
  }
}
