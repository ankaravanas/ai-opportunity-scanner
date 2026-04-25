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
    <section className="py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center px-4">
        <div className="mb-8">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-text-muted">{Math.round(progress)}%</p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {LOADING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Current step text */}
        <p className="text-lg text-text-main font-medium transition-opacity duration-300">
          {LOADING_STEPS[currentStep]}
        </p>

        <p className="mt-4 text-sm text-text-muted">
          Η ανάλυση διαρκεί περίπου 15-30 δευτερόλεπτα
        </p>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-6 text-sm text-text-muted hover:text-text-main underline transition-colors"
          >
            Ακύρωση
          </button>
        )}
      </div>
    </section>
  );
}
