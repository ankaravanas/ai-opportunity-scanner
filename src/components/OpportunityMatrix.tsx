import { Opportunity } from '@/lib/types';
import { departmentColorsHex } from '@/lib/colors';

interface OpportunityMatrixProps {
  opportunities: Opportunity[];
}

export default function OpportunityMatrix({ opportunities }: OpportunityMatrixProps) {
  // Map effort to X position (0-100)
  const getXPosition = (effort: 'low' | 'medium' | 'high'): number => {
    const positions = { low: 20, medium: 50, high: 80 };
    return positions[effort];
  };

  // Map impact score (1-10) to Y position (0-100)
  // Higher impact = lower Y (top of chart)
  const getYPosition = (impactScore: number): number => {
    // Clamp between 10-90 to keep dots visible
    const position = 100 - (impactScore * 10);
    return Math.max(12, Math.min(88, position));
  };

  // Check if opportunity is in Quick Wins quadrant
  const isQuickWin = (opp: Opportunity): boolean => {
    return opp.effort === 'low' && opp.impact_score >= 6;
  };

  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-8 shadow-soft">
      <h3 className="text-xl font-bold text-text-main mb-2">
        AI Opportunity Matrix
      </h3>
      <p className="text-sm text-text-secondary mb-8">
        Προτεραιότητα ανά impact και effort
      </p>

      <div className="relative">
        {/* Axis labels */}
        <div className="absolute -left-1 top-0 bottom-0 flex items-center pointer-events-none">
          <span className="text-sm font-medium text-text-muted -rotate-90 whitespace-nowrap">
            Impact ↑
          </span>
        </div>
        <div className="absolute left-0 right-0 -bottom-8 text-center">
          <span className="text-sm font-medium text-text-muted">Effort →</span>
        </div>

        {/* Matrix grid */}
        <div className="ml-8 aspect-square max-w-md mx-auto relative border-2 border-border-medium rounded-xl overflow-hidden">
          {/* Quadrant backgrounds */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Top-left: High Impact, Low Effort = Quick Wins */}
            <div className="bg-primary-light border-r-2 border-b-2 border-primary/20 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <span className="text-sm text-primary font-bold z-10">Quick Wins</span>
            </div>
            {/* Top-right: High Impact, High Effort = Strategic */}
            <div className="bg-bg-elevated border-b-2 border-border-light flex items-center justify-center">
              <span className="text-sm text-text-secondary font-medium">Strategic</span>
            </div>
            {/* Bottom-left: Low Impact, Low Effort = Easy Wins */}
            <div className="bg-bg-accent border-r-2 border-border-light flex items-center justify-center">
              <span className="text-sm text-text-muted font-medium">Easy Wins</span>
            </div>
            {/* Bottom-right: Low Impact, High Effort = Low Priority */}
            <div className="bg-bg-elevated flex items-center justify-center">
              <span className="text-sm text-text-muted font-medium">Low Priority</span>
            </div>
          </div>

          {/* Plot opportunities */}
          {opportunities.map((opp, index) => {
            const x = getXPosition(opp.effort);
            const y = getYPosition(opp.impact_score);
            const colors = departmentColorsHex[opp.department];
            const quickWin = isQuickWin(opp);

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {/* Pulse effect for Quick Wins */}
                {quickWin && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: '#D97757' }}
                  />
                )}
                {/* Dot - larger (32px) */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-medium cursor-pointer hover:scale-110 transition-transform relative ${
                    quickWin ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: `3px solid ${colors.text}`,
                  }}
                  title={opp.title}
                >
                  {index + 1}
                </div>
                {/* Tooltip on hover */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div
                    className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg"
                    style={{
                      backgroundColor: colors.text,
                      color: '#fff',
                    }}
                  >
                    {opp.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {opportunities.map((opp, index) => {
          const colors = departmentColorsHex[opp.department];
          const quickWin = isQuickWin(opp);
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                quickWin ? 'bg-primary-light border-primary/20' : 'bg-bg-elevated border-border-light'
              }`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-soft"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  border: `2px solid ${colors.text}`,
                }}
              >
                {index + 1}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-text-main line-clamp-1">{opp.title}</span>
                {quickWin && (
                  <span className="text-xs text-primary font-semibold">Quick Win</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
