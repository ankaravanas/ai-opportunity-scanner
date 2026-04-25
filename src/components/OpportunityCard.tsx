'use client';

import { useState } from 'react';
import { Opportunity, calculateAnnualSavings, formatEuros } from '@/lib/types';
import { getDepartmentClasses, getEffortLabel } from '@/lib/colors';

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
}

export default function OpportunityCard({ opportunity, index }: OpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const departmentClasses = getDepartmentClasses(opportunity.department);
  const annualSavings = calculateAnnualSavings(opportunity.time_savings_hours_week);

  // Check if description is long
  const isLongDescription = opportunity.description.length > 150;

  return (
    <article
      className="group bg-white border border-[#E5E5E5] rounded-xl overflow-hidden hover:border-[#D4D4D4] transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Header with Number Badge */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between gap-4">
          {/* Number Badge - Editorial Style */}
          <div className="flex items-center justify-center w-10 h-10 bg-[#1A1915] text-white font-serif text-lg font-bold rounded-lg flex-shrink-0">
            {index + 1}
          </div>

          {/* Department Badge */}
          <div className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-md ${departmentClasses}`}>
            {opportunity.department}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-5 font-serif text-xl font-semibold text-[#1A1915] leading-tight">
          {opportunity.title}
        </h3>

        {/* Description */}
        <div className="mt-3">
          <p
            className={`text-sm text-[#666666] leading-relaxed ${
              !isExpanded && isLongDescription ? 'line-clamp-3' : ''
            }`}
          >
            {opportunity.description}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {isExpanded ? 'Λιγότερα' : 'Περισσότερα →'}
            </button>
          )}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="mt-6 mx-6 p-5 bg-[#FAFAFA] rounded-xl border border-[#EAEAEA]">
        {/* Annual Savings - Hero Metric */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E5E5]">
          <span className="text-sm text-[#888888]">Ετήσια εξοικονόμηση</span>
          <span className="font-serif text-2xl font-bold text-primary">
            {formatEuros(annualSavings)}
          </span>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Hours per week */}
          <div className="text-center">
            <div className="font-serif text-xl font-semibold text-[#1A1915]">
              {opportunity.time_savings_hours_week}
            </div>
            <div className="mt-0.5 text-[10px] font-medium tracking-wide uppercase text-[#999999]">
              Ώρες/Εβδ
            </div>
          </div>

          {/* Timeline */}
          <div className="text-center border-l border-r border-[#E5E5E5]">
            <div className="font-serif text-xl font-semibold text-[#1A1915]">
              {opportunity.timeline_weeks}
            </div>
            <div className="mt-0.5 text-[10px] font-medium tracking-wide uppercase text-[#999999]">
              Εβδομάδες
            </div>
          </div>

          {/* Effort */}
          <div className="text-center">
            <div className="font-serif text-xl font-semibold text-[#1A1915]">
              {getEffortLabel(opportunity.effort).charAt(0)}
            </div>
            <div className="mt-0.5 text-[10px] font-medium tracking-wide uppercase text-[#999999]">
              Προσπάθεια
            </div>
          </div>
        </div>
      </div>

      {/* Impact Score Bar */}
      <div className="p-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#888888]">Impact Score</span>
          <span className="text-xs font-semibold text-[#1A1915]">{opportunity.impact_score}/10</span>
        </div>
        <div className="h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${opportunity.impact_score * 10}%` }}
          />
        </div>
      </div>
    </article>
  );
}
