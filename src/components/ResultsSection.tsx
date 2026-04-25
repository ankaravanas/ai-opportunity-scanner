'use client';

import { useState } from 'react';
import { AnalysisResult, calculateAnnualSavings, formatEuros } from '@/lib/types';
import OpportunityCard from './OpportunityCard';
import OpportunityMatrix from './OpportunityMatrix';
import EmailCapture from './EmailCapture';

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

  // Calculate total savings
  const totalHours = result.opportunities.reduce(
    (sum, opp) => sum + opp.time_savings_hours_week,
    0
  );
  const totalSavings = calculateAnnualSavings(totalHours);

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Share toast */}
        {showShareToast && (
          <div className="fixed top-6 right-6 bg-[#1A1915] text-white px-5 py-3 rounded-lg shadow-2xl z-50 animate-fade-in">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Link αντιγράφηκε!</span>
            </div>
          </div>
        )}

        {/* Editorial Header */}
        <header className="mb-16 md:mb-20">
          {/* Top bar with category and share */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                AI Opportunity Report
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4]" />
              <span className="text-sm text-[#888888]">{result.industry}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#666666] hover:text-primary bg-white hover:bg-[#F5F8FF] rounded-lg border border-[#E5E5E5] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>

          {/* Company Title - Editorial Style */}
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-[#1A1915] leading-[1.1] tracking-tight">
              {result.company}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-[#666666] font-light">
              3 ευκαιρίες AI αυτοματοποίησης
            </p>
          </div>
        </header>

        {/* Total Savings Hero */}
        <div className="mb-16 md:mb-20">
          <div className="bg-[#1A1915] rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />

            <div className="relative">
              <p className="text-xs font-medium tracking-[0.15em] uppercase text-white/50 mb-3">
                Συνολική Ετήσια Εξοικονόμηση
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-5xl md:text-7xl font-bold text-white">
                  {formatEuros(totalSavings)}
                </span>
              </div>
              <p className="mt-4 text-sm text-white/40">
                {totalHours} ώρες/εβδ. × 48 εβδομάδες × €25/ώρα
              </p>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#888888]">
              Ευκαιρίες Αυτοματοποίησης
            </h2>
            <div className="flex-1 h-px bg-[#E5E5E5]" />
          </div>
        </div>

        {/* Opportunity Cards - Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 md:mb-20">
          {result.opportunities.map((opportunity, index) => (
            <OpportunityCard
              key={index}
              opportunity={opportunity}
              index={index}
            />
          ))}
        </div>

        {/* Opportunity Matrix */}
        <div className="mb-16 md:mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#888888]">
                Opportunity Matrix
              </h2>
              <div className="flex-1 h-px bg-[#E5E5E5]" />
            </div>
          </div>
          <OpportunityMatrix opportunities={result.opportunities} />
        </div>

        {/* Email Capture */}
        <div className="mb-8">
          <EmailCapture onSubmit={onSendReport} isSubmitted={isEmailSent} />
        </div>
      </div>
    </section>
  );
}
