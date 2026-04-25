'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import LandingSection from '@/components/LandingSection';
import LoadingState from '@/components/LoadingState';
import ResultsSection from '@/components/ResultsSection';
import { analyzeWebsite, sendReport } from '@/lib/api';
import { AnalysisResult, AppState } from '@/lib/types';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleAnalyze = async (url: string) => {
    setAppState('loading');
    setError(null);

    const response = await analyzeWebsite(url);

    if (response.success && response.data) {
      setAnalysisResult(response.data);
      setAppState('results');
    } else {
      setError(response.error || 'Παρουσιάστηκε σφάλμα κατά την ανάλυση');
      setAppState('idle');
    }
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
    setAppState('idle');
    setError(null);
  };

  const handleReset = () => {
    setAppState('idle');
    setAnalysisResult(null);
    setError(null);
    setIsEmailSent(false);
  };

  return (
    <main className="min-h-screen bg-bg-main">
      <Header />

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
        <LoadingState onCancel={handleCancel} />
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
