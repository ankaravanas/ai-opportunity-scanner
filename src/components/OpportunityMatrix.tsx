import { Opportunity } from '@/lib/types';

interface OpportunityMatrixProps {
  opportunities: Opportunity[];
}

export default function OpportunityMatrix({ opportunities }: OpportunityMatrixProps) {
  // Calculate positions with collision detection
  const getPositions = () => {
    const positions: { x: number; y: number }[] = [];

    // Base X positions for effort levels
    const effortX = { low: 25, medium: 50, high: 75 };

    // Base Y position from impact score (1-10)
    const getBaseY = (impactScore: number): number => {
      return 85 - ((impactScore - 1) * (70 / 9));
    };

    opportunities.forEach((opp, index) => {
      let x = effortX[opp.effort];
      let y = getBaseY(opp.impact_score);

      // Adjust medium effort
      if (opp.effort === 'medium') {
        x = 60;
      }

      // Check for collisions
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

  // Get quadrant info
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
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        {/* Matrix Grid */}
        <div className="relative aspect-[4/3] md:aspect-[2/1] max-h-[400px]">
          {/* Background quadrants */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
            {/* Top-left: Quick Wins */}
            <div className="bg-primary/5 border-r border-b border-[#E5E5E5]" />
            {/* Top-right: Strategic */}
            <div className="bg-[#F8F8F8] border-b border-[#E5E5E5]" />
            {/* Bottom-left: Easy Wins */}
            <div className="bg-[#FAFAFA] border-r border-[#E5E5E5]" />
            {/* Bottom-right: Low Priority */}
            <div className="bg-[#F5F5F5]" />
          </div>

          {/* Quadrant labels */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-4 left-4 text-xs font-semibold text-primary uppercase tracking-wider">Quick Wins</span>
            <span className="absolute top-4 right-4 text-xs font-semibold text-[#888888] uppercase tracking-wider">Strategic</span>
            <span className="absolute bottom-4 left-4 text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider">Easy Wins</span>
            <span className="absolute bottom-4 right-4 text-xs font-semibold text-[#CCCCCC] uppercase tracking-wider">Low Priority</span>
          </div>

          {/* Axis labels */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full">
            <span className="text-[10px] font-medium text-[#999999] uppercase tracking-wider -rotate-90 block whitespace-nowrap">Impact →</span>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2">
            <span className="text-[10px] font-medium text-[#999999] uppercase tracking-wider">Effort →</span>
          </div>

          {/* Opportunity dots */}
          {opportunities.map((opp, index) => {
            const { x, y } = positions[index];
            const quadrant = getQuadrant(opp);
            const isHighPriority = quadrant.priority <= 2;

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: 10 + index,
                }}
              >
                {/* Dot */}
                <div
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                    font-serif text-lg md:text-xl font-bold
                    transition-all duration-200 hover:scale-110
                    ${isHighPriority
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-[#1A1915] text-white shadow-lg shadow-black/20'
                    }
                  `}
                  title={opp.title}
                >
                  {index + 1}
                </div>

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-[#1A1915] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl max-w-[200px] text-center whitespace-nowrap">
                    {opp.title}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 border-4 border-transparent border-t-[#1A1915]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {opportunities.map((opp, index) => {
              const quadrant = getQuadrant(opp);
              const isHighPriority = quadrant.priority <= 2;

              return (
                <div
                  key={index}
                  className={`
                    flex items-center gap-3 p-4 rounded-xl transition-colors
                    ${isHighPriority ? 'bg-primary/5' : 'bg-[#F8F8F8]'}
                  `}
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      font-serif text-sm font-bold flex-shrink-0
                      ${isHighPriority ? 'bg-primary text-white' : 'bg-[#1A1915] text-white'}
                    `}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A1915] line-clamp-1">{opp.title}</p>
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
