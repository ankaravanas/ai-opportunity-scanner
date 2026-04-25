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
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-600"
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
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Το report στάλθηκε!
        </h3>
        <p className="text-green-700">
          Ελέγξτε το inbox σας για το αναλυτικό report.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-light rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-main mb-2">
        Λάβετε το πλήρες report στο email σας
      </h3>
      <p className="text-text-muted text-sm mb-4">
        Δωρεάν. Χωρίς δεσμεύσεις.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="your@email.com"
            disabled={isLoading}
            className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
              error ? 'border-red-500' : 'border-border-light'
            } disabled:bg-gray-50 disabled:cursor-not-allowed`}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading ? 'Αποστολή...' : 'Αποστολή report'}
        </button>
      </form>
    </div>
  );
}
