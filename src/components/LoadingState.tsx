'use client';

interface LoadingStep {
  label: string;
  status: 'pending' | 'in_progress' | 'complete';
}

interface LoadingStateProps {
  steps: LoadingStep[];
  onCancel?: () => void;
}

export default function LoadingState({ steps, onCancel }: LoadingStateProps) {
  // Calculate progress based on completed steps
  const completedCount = steps.filter(s => s.status === 'complete').length;
  const inProgressCount = steps.filter(s => s.status === 'in_progress').length;
  const progress = Math.round(((completedCount + inProgressCount * 0.5) / steps.length) * 100);

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-md mx-auto text-center px-4">
        {/* Loading indicator */}
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
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 transition-all duration-300 ${
                step.status === 'complete'
                  ? 'text-primary'
                  : step.status === 'in_progress'
                  ? 'text-text-main'
                  : 'text-text-muted'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.status === 'complete'
                  ? 'bg-primary'
                  : step.status === 'in_progress'
                  ? 'bg-primary-light border-2 border-primary'
                  : 'bg-border-light'
              }`}>
                {step.status === 'complete' && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${step.status === 'in_progress' ? 'font-medium' : ''}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm text-text-muted">
          {progress}%
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
