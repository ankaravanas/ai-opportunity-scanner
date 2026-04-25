import { NextRequest, NextResponse } from 'next/server';
import { sendEmailReport, generateHtmlReport } from '@/lib/services/email';
import { AnalysisResult } from '@/lib/types';

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, analysisData } = body as { email: string; analysisData?: AnalysisResult };

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

    // Generate report from passed data
    if (!analysisData) {
      return NextResponse.json(
        { success: false, error: 'Analysis data is required' },
        { status: 400 }
      );
    }

    const htmlReport = generateHtmlReport(analysisData);

    console.log(`[SendReport] Sending to: ${trimmedEmail}`);

    const result = await sendEmailReport(trimmedEmail, htmlReport, analysisData.company);

    if (result.success) {
      console.log(`[SendReport] Sent successfully`);
      return NextResponse.json({ success: true });
    } else {
      console.error(`[SendReport] Failed: ${result.error}`);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[SendReport] Error:', error);

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
