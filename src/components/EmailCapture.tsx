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
      <div className="relative bg-white border-2 border-primary/20 rounded-2xl p-10 text-center overflow-hidden">
        {/* Success background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

        <div className="relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-primary"
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
          <h3 className="font-serif text-2xl font-semibold text-[#1A1915] mb-2">
            Το report στάλθηκε!
          </h3>
          <p className="text-[#666666]">
            Ελέγξτε το inbox σας για το αναλυτικό report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      {/* CTA Section */}
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Icon */}
          <div className="w-14 h-14 bg-[#1A1915] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#1A1915] mb-2">
              Στείλτε το πλήρες report στην ομάδα σας
            </h3>
            <p className="text-[#666666] mb-6">
              Λάβετε αναλυτικό report με όλες τις ευκαιρίες, metrics και ROI analysis.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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
                  className={`w-full px-5 py-4 text-base bg-[#FAFAFA] border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all ${
                    error ? 'border-red-400 bg-red-50/50' : 'border-[#E5E5E5]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="group px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Αποστολή...</span>
                  </>
                ) : (
                  <>
                    <span>Αποστολή Report</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom CTA Strip */}
      <div className="px-8 md:px-10 py-5 bg-[#FAFAFA] border-t border-[#E5E5E5]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-[#888888]">
            Θέλετε να συζητήσουμε πώς να υλοποιήσετε αυτές τις ευκαιρίες;
          </p>
          <a
            href="mailto:hello@liberators.ai"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Επικοινωνήστε μαζί μας
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
