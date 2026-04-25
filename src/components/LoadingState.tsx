'use client';

import { useEffect, useState } from 'react';

const LOADING_STEPS = [
  'Σύνδεση με το website',
  'Ανάλυση περιεχομένου',
  'Εντοπισμός ευκαιριών',
  'Υπολογισμός εκτιμήσεων',
  'Ετοιμασία αποτελεσμάτων',
];

interface LoadingStateProps {
  onCancel?: () => void;
}

export default function LoadingState({ onCancel }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress: reaches ~90% in about 20 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = prev < 40 ? 2.5 : prev < 70 ? 1.5 : 0.5;
        return Math.min(90, prev + increment);
      });
    }, 500);

    // Steps: change every 4 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 4000);

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

        {/* Steps list */}
        <div className="text-left mb-6 space-y-2">
          {LOADING_STEPS.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 transition-all duration-300 ${
                index < currentStep
                  ? 'text-primary'
                  : index === currentStep
                  ? 'text-text-main'
                  : 'text-text-muted'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                index < currentStep
                  ? 'bg-primary'
                  : index === currentStep
                  ? 'bg-primary-light border-2 border-primary'
                  : 'bg-border-light'
              }`}>
                {index < currentStep && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${index === currentStep ? 'font-medium' : ''}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm text-text-muted">
          {Math.round(progress)}%
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
