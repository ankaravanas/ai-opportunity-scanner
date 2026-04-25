'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LandingSectionProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function LandingSection({ onSubmit, isLoading }: LandingSectionProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (input: string): boolean => {
    if (!input.trim()) {
      setError('Παρακαλώ εισάγετε ένα URL');
      return false;
    }

    // Basic URL validation - allow with or without protocol
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (!urlPattern.test(input.trim())) {
      setError('Παρακαλώ εισάγετε ένα έγκυρο URL');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      onSubmit(url.trim());
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center px-4">
        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/logo.png"
            alt="Liberators AI"
            width={140}
            height={35}
            priority
            className="h-8 w-auto mx-auto opacity-90"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-5 leading-tight">
          Ανακαλύψτε τις AI ευκαιρίες<br />
          <span className="text-primary">της εταιρείας σας</span>
        </h1>
        <p className="text-lg text-text-secondary mb-12 max-w-xl mx-auto leading-relaxed">
          Αναλύστε το website σας και λάβετε personalized προτάσεις αυτοματοποίησης με εκτιμήσεις εξοικονόμησης.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="bg-bg-card rounded-2xl p-2 shadow-soft border border-border-light">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="example.com"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-4 text-base bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-text-muted ${
                    error ? 'text-red-500' : 'text-text-main'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-soft"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ανάλυση...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Ανάλυση
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </form>

        <p className="mt-8 text-sm text-text-muted flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Δωρεάν ανάλυση · Χωρίς δεσμεύσεις · Ασφαλής επεξεργασία
        </p>
      </div>
    </section>
  );
}
