'use client';

import { AnalysisResult } from '@/lib/types';
import OpportunityCard from './OpportunityCard';
import OpportunityMatrix from './OpportunityMatrix';
import EmailCapture from './EmailCapture';
import CTASection from './CTASection';

interface ResultsSectionProps {
  result: AnalysisResult;
  onSendReport: (email: string) => Promise<void>;
  isEmailSent: boolean;
}

export default function ResultsSection({
  result,
  onSendReport,
  isEmailSent,
}: ResultsSectionProps) {
  return (
    <section className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Company badge */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="font-semibold text-text-main">{result.company}</span>
            <span className="text-text-muted">•</span>
            <span className="text-text-muted">{result.industry}</span>
          </div>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-text-main">
            Οι AI Ευκαιρίες σας
          </h2>
          <p className="mt-2 text-text-muted">
            Εντοπίσαμε {result.opportunities.length} ευκαιρίες αυτοματοποίησης για την εταιρεία σας
          </p>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {result.opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={index}
              opportunity={opportunity}
              index={index}
            />
          ))}
        </div>

        {/* Opportunity Matrix */}
        <div className="mb-10">
          <OpportunityMatrix opportunities={result.opportunities} />
        </div>

        {/* Email Capture */}
        <div className="mb-10">
          <EmailCapture onSubmit={onSendReport} isSubmitted={isEmailSent} />
        </div>

        {/* CTA Section */}
        <CTASection />
      </div>
    </section>
  );
}
