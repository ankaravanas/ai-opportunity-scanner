import { Opportunity } from '@/lib/types';
import { departmentColorsHex } from '@/lib/colors';

interface OpportunityMatrixProps {
  opportunities: Opportunity[];
}

export default function OpportunityMatrix({ opportunities }: OpportunityMatrixProps) {
  // Calculate positions with collision detection
  const getPositions = () => {
    const positions: { x: number; y: number }[] = [];

    // Base X positions for effort levels - clearly within quadrants
    const effortX = { low: 25, medium: 50, high: 75 };

    // Base Y position from impact score (1-10)
    // High impact (10) = top (20%), Low impact (1) = bottom (80%)
    const getBaseY = (impactScore: number): number => {
      // Map 1-10 to 80-20 range
      return 80 - ((impactScore - 1) * (60 / 9));
    };

    opportunities.forEach((opp, index) => {
      let x = effortX[opp.effort];
      let y = getBaseY(opp.impact_score);

      // Adjust medium effort to be clearly in a quadrant based on impact
      if (opp.effort === 'medium') {
        // If high impact, push slightly right into Strategic
        // If low impact, push slightly right into Low Priority
        x = opp.impact_score >= 6 ? 62 : 62;
      }

      // Check for collisions with previous dots
      for (let i = 0; i < index; i++) {
        const prev = positions[i];
        const dx = Math.abs(x - prev.x);
        const dy = Math.abs(y - prev.y);

        // If too close, offset this dot
        if (dx < 15 && dy < 15) {
          // Offset diagonally
          x += 12;
          y += 8;
        }
      }

      // Clamp to visible range
      x = Math.max(12, Math.min(88, x));
      y = Math.max(15, Math.min(85, y));

      positions.push({ x, y });
    });

    return positions;
  };

  const positions = getPositions();

  // Get quadrant label for opportunity
  const getQuadrant = (opp: Opportunity): string => {
    const highImpact = opp.impact_score >= 6;
    const lowEffort = opp.effort === 'low';

    if (highImpact && lowEffort) return 'Quick Win';
    if (highImpact && !lowEffort) return 'Strategic';
    if (!highImpact && lowEffort) return 'Easy Win';
    return 'Low Priority';
  };

  // Check if opportunity is in Quick Wins quadrant
  const isQuickWin = (opp: Opportunity): boolean => {
    return opp.effort === 'low' && opp.impact_score >= 6;
  };

  return (
    <section className="w-full bg-white py-16">
      {/* Full width container - no max-width */}
      <div className="w-full px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-text-main mb-2">
            AI Opportunity Matrix
          </h3>
          <p className="text-text-secondary">
            Προτεραιοποίηση ευκαιριών με βάση impact και effort
          </p>
        </div>

        {/* Matrix - Full Width */}
        <div className="w-full flex">
          {/* Y Axis Label */}
          <div className="flex-shrink-0 flex items-center justify-center w-12">
            <span className="text-sm font-semibold text-text-muted uppercase tracking-wider -rotate-90 whitespace-nowrap">
              High Impact
            </span>
          </div>

          {/* Main Matrix Area */}
          <div className="flex-1">
            <div className="flex">
              {/* Y Axis Numbers */}
              <div className="w-8 flex flex-col justify-between py-4 text-right pr-2">
                <span className="text-xs text-text-muted font-medium">10</span>
                <span className="text-xs text-text-muted font-medium">5</span>
                <span className="text-xs text-text-muted font-medium">0</span>
              </div>

              {/* Matrix Grid - Takes full remaining width */}
              <div className="flex-1 relative" style={{ height: '500px' }}>
                <div className="absolute inset-0 border-2 border-border-medium rounded-2xl">
                  {/* Quadrant backgrounds */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
                    {/* Top-left: High Impact, Low Effort = Quick Wins */}
                    <div className="bg-[#FEF3F0] flex items-center justify-center">
                      <span className="text-lg md:text-xl text-primary font-bold">Quick Wins</span>
                    </div>
                    {/* Top-right: High Impact, High Effort = Strategic */}
                    <div className="bg-[#F8F8FC] flex items-center justify-center">
                      <span className="text-lg md:text-xl text-text-secondary font-semibold">Strategic</span>
                    </div>
                    {/* Bottom-left: Low Impact, Low Effort = Easy Wins */}
                    <div className="bg-[#F5F5F5] flex items-center justify-center">
                      <span className="text-lg md:text-xl text-text-muted font-semibold">Easy Wins</span>
                    </div>
                    {/* Bottom-right: Low Impact, High Effort = Low Priority */}
                    <div className="bg-[#FAFAFA] flex items-center justify-center">
                      <span className="text-lg md:text-xl text-text-muted font-semibold">Low Priority</span>
                    </div>
                  </div>

                  {/* Grid lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-border-medium" />
                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-border-medium" />
                  </div>

                  {/* Plot opportunities */}
                  {opportunities.map((opp, index) => {
                    const { x, y } = positions[index];
                    const colors = departmentColorsHex[opp.department];

                    return (
                      <div
                        key={index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          zIndex: 10 + index,
                        }}
                      >
                        {/* Dot */}
                        <div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-xl font-bold shadow-md cursor-pointer hover:scale-110 transition-transform"
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
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                          <div
                            className="px-4 py-2 rounded-lg text-sm font-medium shadow-xl max-w-[240px] text-center"
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
            </div>

            {/* X Axis Labels */}
            <div className="flex mt-4 ml-8">
              <div className="flex-1 flex justify-between px-4">
                <span className="text-sm font-medium text-text-muted">Low Effort</span>
                <span className="text-sm font-medium text-text-muted">Medium</span>
                <span className="text-sm font-medium text-text-muted">High Effort</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {opportunities.map((opp, index) => {
            const colors = departmentColorsHex[opp.department];
            const quadrant = getQuadrant(opp);
            const isHighPriority = quadrant === 'Quick Win' || quadrant === 'Strategic';
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-5 rounded-xl border-2 ${
                  isHighPriority ? 'bg-[#FEF3F0] border-primary/40' : 'bg-white border-border-light'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 shadow-md"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    border: `3px solid ${colors.text}`,
                  }}
                >
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-text-main line-clamp-2">{opp.title}</span>
                  <span className={`text-xs font-bold block mt-1 ${isHighPriority ? 'text-primary' : 'text-text-muted'}`}>
                    {quadrant}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
