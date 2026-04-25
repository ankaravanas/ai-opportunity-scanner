import { NextRequest, NextResponse } from 'next/server';

const MCP_ENDPOINT = process.env.MCP_ENDPOINT || 'https://web-voice-automation.up.railway.app/mcp';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Call MCP tool to send report
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'send_report_to_email',
          arguments: {
            email: trimmedEmail,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Failed to send report');
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Send report error:', error);

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
