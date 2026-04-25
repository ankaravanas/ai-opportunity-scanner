'use client';

import { useState } from 'react';
import { Opportunity, calculateAnnualSavings, formatEuros } from '@/lib/types';
import { getDepartmentClasses, getEffortLabel, departmentIconPaths } from '@/lib/colors';

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1A1915] text-white text-xs rounded-lg shadow-lg z-10 w-64 whitespace-normal">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1A1915]" />
        </div>
      )}
    </div>
  );
}

export default function OpportunityCard({ opportunity, index }: OpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const departmentClasses = getDepartmentClasses(opportunity.department);
  const annualSavings = calculateAnnualSavings(opportunity.time_savings_hours_week);
  const iconPaths = departmentIconPaths[opportunity.department];

  const isLongDescription = opportunity.description.length > 150;

  return (
    <div
      className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#D4D4D4] transition-all duration-300 flex flex-col"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Department badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl w-fit ${departmentClasses}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {iconPaths.map((path, i) => (
            <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
          ))}
        </svg>
        {opportunity.department}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-bold text-[#1A1915] leading-snug">
        {opportunity.title}
      </h3>

      {/* Description */}
      <div className="mt-3 flex-grow">
        <p
          className={`text-sm text-[#666666] leading-relaxed ${
            !isExpanded && isLongDescription ? 'line-clamp-4' : ''
          }`}
        >
          {opportunity.description}
        </p>
        {isLongDescription && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {isExpanded ? 'Λιγότερα ↑' : 'Περισσότερα →'}
          </button>
        )}
      </div>

      {/* Annual Savings Box */}
      <div className="mt-6 p-4 bg-white border border-[#E5E5E5] rounded-xl">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E5E5]">
          <Tooltip content={`Υπολογισμός: ${opportunity.time_savings_hours_week} ώρες/εβδ × 48 εβδομάδες × €25/ώρα`}>
            <span className="text-sm text-[#666666] flex items-center gap-1">
              Ετήσια εξοικονόμηση
              <svg className="w-3.5 h-3.5 text-[#999999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </Tooltip>
          <span className="text-2xl font-bold text-primary">{formatEuros(annualSavings)}</span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-bold text-[#1A1915]">{opportunity.time_savings_hours_week}</div>
            <div className="text-[10px] font-medium text-[#888888] uppercase tracking-wide">Ώρες/Εβδ</div>
          </div>
          <div className="border-l border-r border-[#E5E5E5]">
            <div className="text-xl font-bold text-[#1A1915]">{opportunity.timeline_weeks}</div>
            <div className="text-[10px] font-medium text-[#888888] uppercase tracking-wide">Εβδομάδες</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#1A1915]">{getEffortLabel(opportunity.effort)}</div>
            <div className="text-[10px] font-medium text-[#888888] uppercase tracking-wide">Προσπάθεια</div>
          </div>
        </div>
      </div>

    </div>
  );
}
