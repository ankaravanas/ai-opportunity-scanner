import { Opportunity } from '@/lib/types';
import { getDepartmentClasses, getEffortLabel } from '@/lib/colors';

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
}

export default function OpportunityCard({ opportunity, index }: OpportunityCardProps) {
  const departmentClasses = getDepartmentClasses(opportunity.department);

  return (
    <div
      className="bg-white border border-border-light rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Department badge */}
      <span
        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${departmentClasses}`}
      >
        {opportunity.department}
      </span>

      {/* Title */}
      <h3 className="mt-4 text-xl font-semibold text-text-main">
        {opportunity.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-text-muted leading-relaxed">
        {opportunity.description}
      </p>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-text-main">
            {opportunity.time_savings_hours_week}
          </p>
          <p className="text-xs text-text-muted mt-1">ώρες/εβδομάδα</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-text-main">
            {getEffortLabel(opportunity.effort)}
          </p>
          <p className="text-xs text-text-muted mt-1">Effort</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-text-main">
            {opportunity.timeline_weeks}
          </p>
          <p className="text-xs text-text-muted mt-1">εβδομάδες</p>
        </div>
      </div>
    </div>
  );
}
