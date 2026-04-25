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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-text-main text-white text-xs rounded-lg shadow-lg z-10 w-64 whitespace-normal">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-text-main" />
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

  // Check if description is long (more than ~150 chars usually means 4+ lines)
  const isLongDescription = opportunity.description.length > 150;

  return (
    <div
      className="bg-bg-card border border-border-light rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Department badge - larger with icon */}
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
      <h3 className="mt-4 text-lg font-bold text-text-main leading-snug">
        {opportunity.title}
      </h3>

      {/* Description - expandable */}
      <div className="mt-3 flex-grow">
        <p
          className={`text-sm text-text-secondary leading-relaxed ${
            !isExpanded && isLongDescription ? 'line-clamp-4' : ''
          }`}
        >
          {opportunity.description}
        </p>
        {isLongDescription && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {isExpanded ? 'Λιγότερα ↑' : 'Διαβάστε περισσότερα →'}
          </button>
        )}
      </div>

      {/* Annual Savings - with info tooltip */}
      <div className="mt-6 p-4 bg-primary-light rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-primary">Ετήσια εξοικονόμηση</span>
            <Tooltip content="Υπολογίζεται ως: ώρες εξοικονόμησης/εβδομάδα × 48 εργάσιμες εβδομάδες × €25 μέσο ωριαίο κόστος εργασίας. Το πραγματικό ποσό εξαρτάται από το μισθολογικό κόστος της εταιρείας σας.">
              <svg className="w-4 h-4 text-primary/60 hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Tooltip>
          </div>
          <span className="text-2xl font-bold text-primary">{formatEuros(annualSavings)}</span>
        </div>
        <p className="text-xs text-primary/70 mt-1">
          {opportunity.time_savings_hours_week} ώρες/εβδ × 48 εβδ × €25/ώρα
        </p>
      </div>

      {/* Compact Metrics with tooltips */}
      <div className="mt-5 pt-5 border-t border-border-light flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* Effort */}
          <Tooltip content="Η προσπάθεια υλοποίησης εκτιμάται βάσει της πολυπλοκότητας: Χαμηλή = plug & play λύσεις, Μεσαία = απαιτεί παραμετροποίηση, Υψηλή = custom development.">
            <div className="flex items-center gap-1.5 cursor-help">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-text-secondary">
                <span className="text-text-muted">Προσπάθεια:</span> {getEffortLabel(opportunity.effort)}
              </span>
            </div>
          </Tooltip>

          {/* Timeline */}
          <Tooltip content="Ο εκτιμώμενος χρόνος υλοποίησης περιλαμβάνει ανάλυση, ρύθμιση, testing και go-live. Εξαρτάται από τη διαθεσιμότητα πόρων και την πολυπλοκότητα.">
            <div className="flex items-center gap-1.5 cursor-help">
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-text-secondary">{opportunity.timeline_weeks} εβδ.</span>
            </div>
          </Tooltip>
        </div>

        {/* Impact Score */}
        <Tooltip content={`Βαθμολογία επίδρασης: ${opportunity.impact_score}/10. Αξιολογείται βάσει της δυνητικής εξοικονόμησης χρόνου, της συχνότητας της διαδικασίας και του αντίκτυπου στην εμπειρία πελάτη/εργαζομένου.`}>
          <div className="flex items-center gap-0.5 cursor-help">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-4 rounded-sm ${
                  i < opportunity.impact_score ? 'bg-primary' : 'bg-border-light'
                }`}
              />
            ))}
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
