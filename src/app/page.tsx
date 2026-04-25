'use client';

import { useState, useRef } from 'react';
import LandingSection from '@/components/LandingSection';
import LoadingState from '@/components/LoadingState';
import ResultsSection from '@/components/ResultsSection';
import { analyzeWebsiteStream, sendReport } from '@/lib/api';
import { AnalysisResult, AppState } from '@/lib/types';

interface LoadingStep {
  label: string;
  status: 'pending' | 'in_progress' | 'complete';
}

const INITIAL_STEPS: LoadingStep[] = [
  { label: 'Σύνδεση με το website', status: 'pending' },
  { label: 'Ανάλυση περιεχομένου με AI', status: 'pending' },
  { label: 'Αποθήκευση στοιχείων', status: 'pending' },
];

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(INITIAL_STEPS);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAnalyze = async (url: string) => {
    setAppState('loading');
    setError(null);
    setLoadingSteps(INITIAL_STEPS);

    abortControllerRef.current = new AbortController();

    analyzeWebsiteStream(url, {
      onProgress: (step, status, message) => {
        console.log(`[Progress] Step ${step}: ${status} - ${message}`);

        setLoadingSteps(prev => {
          const newSteps = [...prev];
          // Map backend steps to frontend steps
          // Backend: 1=scrape, 2=analyze, 3=save lead, 4=done
          const stepIndex = step - 1;

          if (stepIndex >= 0 && stepIndex < newSteps.length) {
            if (status === 'start') {
              newSteps[stepIndex] = { ...newSteps[stepIndex], status: 'in_progress' };
            } else if (status === 'complete') {
              newSteps[stepIndex] = { ...newSteps[stepIndex], status: 'complete' };
            }
          }

          return newSteps;
        });
      },
      onComplete: (result) => {
        // Mark all steps complete
        setLoadingSteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })));
        setAnalysisResult(result);
        setAppState('results');
      },
      onError: (errorMessage) => {
        setError(errorMessage || 'Παρουσιάστηκε σφάλμα κατά την ανάλυση');
        setAppState('idle');
      },
    });
  };

  const handleSendReport = async (email: string) => {
    if (!analysisResult) {
      throw new Error('Δεν υπάρχουν δεδομένα ανάλυσης');
    }

    const response = await sendReport(email, analysisResult);

    if (response.success) {
      setIsEmailSent(true);
      setAppState('emailSent');
    } else {
      throw new Error(response.error || 'Αποτυχία αποστολής report');
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setAppState('idle');
    setError(null);
    setLoadingSteps(INITIAL_STEPS);
  };

  const handleReset = () => {
    setAppState('idle');
    setAnalysisResult(null);
    setError(null);
    setIsEmailSent(false);
    setLoadingSteps(INITIAL_STEPS);
  };

  return (
    <main className="min-h-screen bg-bg-main">
      {error && (
        <div className="max-w-3xl mx-auto px-4 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p className="font-medium">Σφάλμα</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Κλείσιμο
            </button>
          </div>
        </div>
      )}

      {appState === 'idle' && (
        <LandingSection onSubmit={handleAnalyze} isLoading={false} />
      )}

      {appState === 'loading' && (
        <LoadingState steps={loadingSteps} onCancel={handleCancel} />
      )}

      {(appState === 'results' || appState === 'emailSent') && analysisResult && (
        <>
          <ResultsSection
            result={analysisResult}
            onSendReport={handleSendReport}
            isEmailSent={isEmailSent}
          />

          <div className="text-center pb-10">
            <button
              onClick={handleReset}
              className="text-sm text-text-muted hover:text-text-main underline transition-colors"
            >
              Νέα ανάλυση
            </button>
          </div>
        </>
      )}
    </main>
  );
}
