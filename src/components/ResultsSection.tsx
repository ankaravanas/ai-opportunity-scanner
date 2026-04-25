'use client';

import { useState } from 'react';
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
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Δείτε τις AI ευκαιρίες για ${result.company}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Ευκαιρίες - ${result.company}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Share toast */}
        {showShareToast && (
          <div className="fixed top-20 right-4 bg-text-main text-white px-4 py-3 rounded-xl shadow-elevated z-50">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link αντιγράφηκε!
            </div>
          </div>
        )}

        {/* Company badge + Title */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-light text-primary rounded-full font-medium mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {result.industry}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main leading-tight">
            3 AI ευκαιρίες για<br />
            <span className="text-primary">{result.company}</span>
          </h2>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 text-text-secondary hover:text-primary bg-bg-elevated hover:bg-primary-light rounded-xl border border-border-light transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Results
          </button>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {result.opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={index}
              opportunity={opportunity}
              index={index}
            />
          ))}
        </div>

        {/* Opportunity Matrix */}
        <div className="mb-14">
          <OpportunityMatrix opportunities={result.opportunities} />
        </div>

        {/* Email Capture */}
        <div className="mb-14">
          <EmailCapture onSubmit={onSendReport} isSubmitted={isEmailSent} />
        </div>

        {/* CTA Section */}
        <CTASection />
      </div>
    </section>
  );
}
