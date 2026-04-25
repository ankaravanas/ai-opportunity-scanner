import { Opportunity } from '@/lib/types';
import { departmentColorsHex } from '@/lib/colors';

interface OpportunityMatrixProps {
  opportunities: Opportunity[];
}

export default function OpportunityMatrix({ opportunities }: OpportunityMatrixProps) {
  // Map effort to X position (0-100)
  const getXPosition = (effort: 'low' | 'medium' | 'high'): number => {
    const positions = { low: 25, medium: 50, high: 75 };
    return positions[effort];
  };

  // Map impact score (1-10) to Y position (0-100)
  // Higher impact = lower Y (top of chart)
  const getYPosition = (impactScore: number): number => {
    return 100 - (impactScore * 10);
  };

  return (
    <div className="bg-white border border-border-light rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-main mb-6">
        AI Opportunity Matrix
      </h3>

      <div className="relative">
        {/* Axis labels */}
        <div className="absolute -left-2 top-0 bottom-0 flex items-center">
          <span className="text-xs text-text-muted -rotate-90 whitespace-nowrap">
            Impact →
          </span>
        </div>
        <div className="absolute left-0 right-0 -bottom-6 text-center">
          <span className="text-xs text-text-muted">Effort →</span>
        </div>

        {/* Matrix grid */}
        <div className="ml-6 aspect-square relative border border-border-light rounded">
          {/* Quadrant backgrounds */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Top-left: High Impact, Low Effort = Quick Wins */}
            <div className="bg-green-50 border-r border-b border-border-light flex items-center justify-center">
              <span className="text-xs text-green-700 font-medium opacity-50">Quick Wins</span>
            </div>
            {/* Top-right: High Impact, High Effort = Strategic */}
            <div className="bg-blue-50 border-b border-border-light flex items-center justify-center">
              <span className="text-xs text-blue-700 font-medium opacity-50">Strategic</span>
            </div>
            {/* Bottom-left: Low Impact, Low Effort = Easy Wins */}
            <div className="bg-gray-50 border-r border-border-light flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium opacity-50">Easy Wins</span>
            </div>
            {/* Bottom-right: Low Impact, High Effort = Low Priority */}
            <div className="bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-500 font-medium opacity-50">Low Priority</span>
            </div>
          </div>

          {/* Plot opportunities */}
          {opportunities.map((opp, index) => {
            const x = getXPosition(opp.effort);
            const y = getYPosition(opp.impact_score);
            const colors = departmentColorsHex[opp.department];

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {/* Dot */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: `2px solid ${colors.text}`,
                  }}
                  title={opp.title}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        {opportunities.map((opp, index) => {
          const colors = departmentColorsHex[opp.department];
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.text}`,
                }}
              >
                {index + 1}
              </div>
              <span className="text-sm text-text-muted">{opp.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
