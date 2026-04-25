'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  onSubmit: (email: string) => Promise<void>;
  isSubmitted: boolean;
}

export default function EmailCapture({ onSubmit, isSubmitted }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (input: string): boolean => {
    if (!input.trim()) {
      setError('Παρακαλώ εισάγετε το email σας');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.trim())) {
      setError('Παρακαλώ εισάγετε ένα έγκυρο email');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setIsLoading(true);
      try {
        await onSubmit(email.trim());
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-primary-light border border-primary/20 rounded-2xl p-8 text-center shadow-soft">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">
          Το report στάλθηκε!
        </h3>
        <p className="text-text-secondary">
          Ελέγξτε το inbox σας για το αναλυτικό report.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-8 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-text-main mb-1">
            Στείλτε το πλήρες report στην ομάδα σας
          </h3>
          <p className="text-text-secondary">
            Λάβετε αναλυτικό PDF με όλες τις ευκαιρίες και τα metrics.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="team@company.com"
            disabled={isLoading}
            className={`w-full px-4 py-4 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-bg-main ${
              error ? 'border-red-400' : 'border-border-medium'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-soft"
        >
          {isLoading ? 'Αποστολή...' : 'Αποστολή Report'}
        </button>
      </form>
    </div>
  );
}
