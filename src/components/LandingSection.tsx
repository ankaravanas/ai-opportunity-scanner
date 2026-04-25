'use client';

import { useState } from 'react';

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
        <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
          Ανακαλύψτε τις AI ευκαιρίες της εταιρείας σας
        </h1>
        <p className="text-lg text-text-muted mb-10">
          Αναλύστε το website σας και λάβετε personalized προτάσεις αυτοματοποίησης
          με εκτιμήσεις εξοικονόμησης χρόνου.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
                placeholder="π.χ. example.com"
                disabled={isLoading}
                className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                  error ? 'border-red-500' : 'border-border-light'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-500 text-left">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? 'Ανάλυση...' : 'Ανάλυση'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-text-muted">
          Δωρεάν ανάλυση. Χωρίς δεσμεύσεις.
        </p>
      </div>
    </section>
  );
}
