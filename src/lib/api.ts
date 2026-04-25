import { AnalyzeResponse, SendReportResponse, AnalysisResult } from './types';

interface ProgressEvent {
  step: number;
  status: 'start' | 'complete' | 'error';
  message: string;
  data?: { success: boolean; data: AnalysisResult };
}

interface StreamAnalyzeCallbacks {
  onProgress: (step: number, status: 'start' | 'complete' | 'error', message: string) => void;
  onComplete: (result: AnalysisResult) => void;
  onError: (error: string) => void;
}

export async function analyzeWebsiteStream(
  url: string,
  callbacks: StreamAnalyzeCallbacks
): Promise<void> {
  try {
    const response = await fetch('/api/analyze-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      callbacks.onError(`Request failed with status ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError('Failed to get response reader');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event: ProgressEvent = JSON.parse(line.slice(6));

            if (event.status === 'error') {
              callbacks.onError(event.message);
              return;
            }

            callbacks.onProgress(event.step, event.status, event.message);

            if (event.step === 4 && event.status === 'complete' && event.data?.data) {
              callbacks.onComplete(event.data.data);
            }
          } catch {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
  } catch (error) {
    callbacks.onError(error instanceof Error ? error.message : 'Network error');
  }
}

export async function analyzeWebsite(url: string): Promise<AnalyzeResponse> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export async function sendReport(email: string, analysisData: AnalysisResult): Promise<SendReportResponse> {
  try {
    const response = await fetch('/api/send-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, analysisData }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
