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
    <section className="min-h-[85vh] flex flex-col justify-center py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="/logo.png"
            alt="Liberators AI"
            width={160}
            height={40}
            priority
            className="h-9 w-auto mx-auto"
          />
        </div>

        {/* Hero Text - Editorial Style */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-5">
            AI Opportunity Scanner
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1915] leading-[1.15] tracking-tight mb-6">
            Ανακαλύψτε τις AI ευκαιρίες<br />
            <span className="text-primary">της εταιρείας σας</span>
          </h1>
          <p className="text-lg text-[#666666] max-w-xl mx-auto leading-relaxed">
            Αναλύστε το website σας και λάβετε personalized προτάσεις αυτοματοποίησης με εκτιμήσεις εξοικονόμησης.
          </p>
        </div>

        {/* Search Form - Clean & Modern */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-[#E5E5E5] p-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="yourcompany.com"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-4 text-base bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-[#BBBBBB] ${
                    error ? 'text-red-500' : 'text-[#1A1915]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="group px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Ανάλυση...</span>
                  </>
                ) : (
                  <>
                    <span>Ανάλυση</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-500 flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
        </form>

        {/* Trust Indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#888888]">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            Δωρεάν ανάλυση
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Ασφαλής επεξεργασία
          </span>
          <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Άμεσα αποτελέσματα
          </span>
        </div>
      </div>
    </section>
  );
}
