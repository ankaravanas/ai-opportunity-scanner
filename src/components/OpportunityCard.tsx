import { Opportunity, calculateAnnualSavings, formatEuros } from '@/lib/types';
import { getDepartmentClasses, getEffortLabel, departmentIconPaths } from '@/lib/colors';

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
}

export default function OpportunityCard({ opportunity, index }: OpportunityCardProps) {
  const departmentClasses = getDepartmentClasses(opportunity.department);
  const annualSavings = calculateAnnualSavings(opportunity.time_savings_hours_week);
  const iconPaths = departmentIconPaths[opportunity.department];

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

      {/* Description - shorter */}
      <p className="mt-3 text-sm text-text-secondary leading-relaxed line-clamp-3 flex-grow">
        {opportunity.description}
      </p>

      {/* Annual Savings - prominent with warm colors */}
      <div className="mt-6 p-4 bg-primary-light rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">Ετήσια εξοικονόμηση</span>
          <span className="text-2xl font-bold text-primary">{formatEuros(annualSavings)}</span>
        </div>
        <p className="text-xs text-primary/70 mt-1">
          {opportunity.time_savings_hours_week} ώρες/εβδ × 48 εβδ × €25/ώρα
        </p>
      </div>

      {/* Compact Metrics */}
      <div className="mt-5 pt-5 border-t border-border-light flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-text-secondary">{getEffortLabel(opportunity.effort)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-text-secondary">{opportunity.timeline_weeks} εβδ.</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-4 rounded-sm ${
                i < opportunity.impact_score ? 'bg-primary' : 'bg-border-light'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
