'use client';

import { useEffect, useState } from 'react';

const LOADING_STEPS = [
  'Αναλύουμε το website σας...',
  'Εντοπίζουμε departments και υπηρεσίες...',
  'Αξιολογούμε ευκαιρίες AI...',
  'Υπολογίζουμε εκτιμήσεις...',
  'Ετοιμάζουμε τα αποτελέσματα...',
];

interface LoadingStateProps {
  onCancel?: () => void;
}

export default function LoadingState({ onCancel }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation - completes in ~25 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        // Slower progress as we get closer to 100
        const increment = prev < 50 ? 2 : prev < 80 ? 1.5 : 0.5;
        return Math.min(95, prev + increment);
      });
    }, 500);

    // Step animation - change every ~5 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) return prev;
        return prev + 1;
      });
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-md mx-auto text-center px-4">
        {/* Claude-style loading indicator */}
        <div className="w-16 h-16 mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full border-4 border-border-light" />
          <div
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            style={{ animationDuration: '1s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full h-1.5 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-5">
          {LOADING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-primary scale-100' : 'bg-border-medium scale-75'
              }`}
            />
          ))}
        </div>

        {/* Current step text */}
        <p className="text-lg text-text-main font-semibold">
          {LOADING_STEPS[currentStep]}
        </p>

        <p className="mt-3 text-sm text-text-muted">
          {Math.round(progress)}% · 15-30 δευτερόλεπτα
        </p>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-8 px-5 py-2.5 text-sm text-text-secondary hover:text-primary bg-bg-elevated hover:bg-primary-light rounded-xl border border-border-light transition-all"
          >
            Ακύρωση
          </button>
        )}
      </div>
    </section>
  );
}
