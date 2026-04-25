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
    <section className="min-h-[70vh] flex items-center justify-center py-20">
      <div className="max-w-sm mx-auto text-center px-4">
        {/* Loading Animation */}
        <div className="mb-10">
          <div className="w-20 h-20 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#E5E5E5]" />
            {/* Progress ring */}
            <svg className="absolute inset-0 w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="38"
                fill="none"
                stroke="#007BFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.39} 239`}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl font-semibold text-[#1A1915] mb-2">
          Αναλύουμε το website σας
        </h2>
        <p className="text-sm text-[#888888] mb-8">
          Εξαγωγή πληροφοριών και εντοπισμός ευκαιριών...
        </p>

        {/* Steps */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 mb-6">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  step.status === 'complete'
                    ? 'opacity-100'
                    : step.status === 'in_progress'
                    ? 'opacity-100'
                    : 'opacity-40'
                }`}
              >
                {/* Status indicator */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  step.status === 'complete'
                    ? 'bg-primary'
                    : step.status === 'in_progress'
                    ? 'bg-white border-2 border-primary'
                    : 'bg-[#F0F0F0] border border-[#E5E5E5]'
                }`}>
                  {step.status === 'complete' && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {step.status === 'in_progress' && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm text-left ${
                  step.status === 'complete'
                    ? 'text-primary font-medium'
                    : step.status === 'in_progress'
                    ? 'text-[#1A1915] font-medium'
                    : 'text-[#888888]'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress text */}
        <p className="text-xs text-[#AAAAAA] font-medium tracking-wide">
          {progress}% ολοκληρώθηκε
        </p>

        {/* Cancel button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-8 px-5 py-2.5 text-sm text-[#666666] hover:text-primary bg-white hover:bg-[#F5F8FF] rounded-lg border border-[#E5E5E5] transition-all duration-200"
          >
            Ακύρωση
          </button>
        )}
      </div>
    </section>
  );
}
