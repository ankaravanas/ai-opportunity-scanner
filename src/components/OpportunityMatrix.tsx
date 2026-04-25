import { Opportunity } from '@/lib/types';

interface OpportunityMatrixProps {
  opportunities: Opportunity[];
}

export default function OpportunityMatrix({ opportunities }: OpportunityMatrixProps) {
  // Calculate positions with collision detection
  const getPositions = () => {
    const positions: { x: number; y: number }[] = [];

    const effortX = { low: 25, medium: 50, high: 75 };

    const getBaseY = (impactScore: number): number => {
      return 85 - ((impactScore - 1) * (70 / 9));
    };

    opportunities.forEach((opp, index) => {
      let x = effortX[opp.effort];
      let y = getBaseY(opp.impact_score);

      if (opp.effort === 'medium') {
        x = 60;
      }

      for (let i = 0; i < index; i++) {
        const prev = positions[i];
        const dx = Math.abs(x - prev.x);
        const dy = Math.abs(y - prev.y);

        if (dx < 12 && dy < 12) {
          x += 10;
          y += 6;
        }
      }

      x = Math.max(10, Math.min(90, x));
      y = Math.max(12, Math.min(88, y));

      positions.push({ x, y });
    });

    return positions;
  };

  const positions = getPositions();

  const getQuadrant = (opp: Opportunity) => {
    const highImpact = opp.impact_score >= 6;
    const lowEffort = opp.effort === 'low';

    if (highImpact && lowEffort) return { label: 'Quick Win', priority: 1 };
    if (highImpact && !lowEffort) return { label: 'Strategic', priority: 2 };
    if (!highImpact && lowEffort) return { label: 'Easy Win', priority: 3 };
    return { label: 'Low Priority', priority: 4 };
  };

  return (
    <div className="w-full">
      {/* Matrix Container */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
        {/* Matrix Area */}
        <div className="p-6 md:p-8">
          <div className="flex">
            {/* Y-axis label */}
            <div className="flex items-center justify-center w-8 flex-shrink-0">
              <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider -rotate-90 whitespace-nowrap">
                Impact →
              </span>
            </div>

            {/* Matrix Grid */}
            <div className="flex-1">
              <div className="relative w-full" style={{ aspectRatio: '2/1', minHeight: '280px' }}>
                {/* Background quadrants */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden border border-[#E5E5E5]">
                  <div className="bg-primary/5 border-r border-b border-[#E5E5E5] relative">
                    <span className="absolute top-3 left-3 text-xs font-semibold text-primary uppercase tracking-wider">Quick Wins</span>
                  </div>
                  <div className="bg-[#F8F8F8] border-b border-[#E5E5E5] relative">
                    <span className="absolute top-3 right-3 text-xs font-semibold text-[#888888] uppercase tracking-wider">Strategic</span>
                  </div>
                  <div className="bg-[#FAFAFA] border-r border-[#E5E5E5] relative">
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Easy Wins</span>
                  </div>
                  <div className="bg-[#F5F5F5] relative">
                    <span className="absolute bottom-3 right-3 text-xs font-semibold text-[#CCCCCC] uppercase tracking-wider">Low Priority</span>
                  </div>
                </div>

                {/* Dots */}
                {opportunities.map((opp, index) => {
                  const { x, y } = positions[index];
                  const quadrant = getQuadrant(opp);
                  const isHighPriority = quadrant.priority <= 2;

                  return (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{ left: `${x}%`, top: `${y}%`, zIndex: 10 + index }}
                    >
                      <div
                        className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg transition-transform hover:scale-110 ${
                          isHighPriority
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-[#1A1915] text-white shadow-lg shadow-black/20'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <div className="bg-[#1A1915] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-xl whitespace-nowrap">
                          {opp.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis label */}
              <div className="mt-4 text-center">
                <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                  Effort →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 md:px-8 py-5 bg-[#FAFAFA] border-t border-[#E5E5E5]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {opportunities.map((opp, index) => {
              const quadrant = getQuadrant(opp);
              const isHighPriority = quadrant.priority <= 2;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${isHighPriority ? 'bg-primary/5' : 'bg-white'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isHighPriority ? 'bg-primary text-white' : 'bg-[#1A1915] text-white'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A1915] truncate">{opp.title}</p>
                    <p className={`text-xs ${isHighPriority ? 'text-primary' : 'text-[#888888]'}`}>
                      {quadrant.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
