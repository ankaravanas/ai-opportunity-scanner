'use client';

import { useEffect, useState } from 'react';

const LOADING_STEPS = [
  { text: 'Σύνδεση με το website...', icon: '🔗' },
  { text: 'Ανάλυση περιεχομένου...', icon: '📄' },
  { text: 'Εντοπισμός ευκαιριών AI...', icon: '🤖' },
  { text: 'Υπολογισμός εξοικονομήσεων...', icon: '💰' },
  { text: 'Ετοιμασία αποτελεσμάτων...', icon: '✨' },
];

interface LoadingStateProps {
  onCancel?: () => void;
}

export default function LoadingState({ onCancel }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation - smooth increment
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        // Variable speed: fast start, slow middle, pause near end
        const increment = prev < 30 ? 3 : prev < 60 ? 2 : prev < 85 ? 1 : 0.3;
        return Math.min(92, prev + increment);
      });
    }, 400);

    // Step animation - change every ~4 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) return prev;
        return prev + 1;
      });
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

        {/* Step indicators */}
        <div className="flex justify-center gap-3 mb-6">
          {LOADING_STEPS.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ${
                index < currentStep
                  ? 'bg-primary text-white scale-100'
                  : index === currentStep
                  ? 'bg-primary-light text-primary scale-110 animate-pulse'
                  : 'bg-border-light text-text-muted scale-90'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm">{step.icon}</span>
              )}
            </div>
          ))}
        </div>

        {/* Current step text */}
        <p className="text-lg text-text-main font-semibold">
          {LOADING_STEPS[currentStep].text}
        </p>

        <p className="mt-3 text-sm text-text-muted">
          Περίπου 15-30 δευτερόλεπτα
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
