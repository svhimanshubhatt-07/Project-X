import React, { useState, useMemo } from 'react';

type TimeframeOption = '7D' | '30D' | '90D';

const TIMEFRAME_CONFIG: Record<
  TimeframeOption,
  { labels: string[]; data: number[]; yMax: number; yTicks: number[] }
> = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [14, 22, 28, 25, 48, 34, 20],
    yMax: 50,
    yTicks: [50, 40, 30, 20, 10, 0],
  },
  '30D': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [42, 68, 95, 138],
    yMax: 150,
    yTicks: [150, 120, 90, 60, 30, 0],
  },
  '90D': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    data: [100, 160, 220],
    yMax: 250,
    yTicks: [250, 200, 150, 100, 50, 0],
  },
};

export const RegistrationChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('90D');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeConfig = TIMEFRAME_CONFIG[timeframe];
  const { labels, data, yMax, yTicks } = activeConfig;

  // Generate SVG path for smooth line
  const width = 600;
  const height = 180;
  const paddingX = 15;
  const paddingY = 5;

  const points = useMemo(() => {
    return data.map((val, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (val / yMax) * (height - paddingY * 2);
      return { x, y, val };
    });
  }, [data, yMax]);

  const pathD = useMemo(() => {
    return points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cx1 = prev.x + (p.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (p.x - prev.x) / 2;
      const cy2 = p.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return '';
    return `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }, [pathD, points]);

  return (
    <div className="h-full bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl flex flex-col overflow-hidden">
      {/* Card Header with Divider */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-[#1F2937]">
        <h3 className="text-base font-bold text-white font-heading tracking-tight">
          Company Registration Trend
        </h3>

        {/* Pill Selector with Active Outline */}
        <div className="flex items-center p-1 rounded-xl bg-[#0B0F14] border border-[#1F2937] gap-1">
          {(['7D', '30D', '90D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoveredIdx(null);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-[#3B82F6] text-white font-bold border border-white/80 shadow-md shadow-blue-500/20'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      <div className="p-6 pt-5">
        <div className="relative flex">
          {/* Y Axis Labels */}
          <div className="flex flex-col justify-between text-xs font-medium text-[#9CA3AF] pr-4 h-48 select-none">
            {yTicks.map((tick, i) => (
              <span key={i} className="leading-none text-right">
                {tick}
              </span>
            ))}
          </div>

          {/* SVG Chart Area with Horizontal Grid Lines */}
          <div className="flex-1 relative h-48">
            {/* Horizontal Grid lines directly aligned with ticks */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yTicks.map((_, i) => (
                <div key={i} className="w-full border-b border-[#1F2937]/90" />
              ))}
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="adminTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
                <filter id="adminGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.7" />
                </filter>
              </defs>

              {/* Gradient Area Fill */}
              <path d={areaD} fill="url(#adminTrendGradient)" />

              {/* Smooth Spline Curve */}
              <path
                d={pathD}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#adminGlow)"
              />

              {/* Data Nodes */}
              {points.map((p, idx) => (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIdx === idx ? '6.5' : '4.5'}
                    fill="#0B0F14"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                  />
                  {/* Invisible Hitbox */}
                  <circle cx={p.x} cy={p.y} r="20" fill="transparent" />
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredIdx !== null && (
              <div
                className="absolute -top-3 bg-[#1F2937]/95 border border-[#3B82F6]/50 px-2.5 py-1 rounded-lg shadow-xl backdrop-blur-md pointer-events-none text-xs text-white"
                style={{
                  left: `${(points[hoveredIdx].x / width) * 100}%`,
                  transform: 'translateX(-50%) translateY(-100%)',
                }}
              >
                <span className="font-bold text-[#60A5FA]">{labels[hoveredIdx]}:</span>{' '}
                <span className="font-bold">{points[hoveredIdx].val}</span> Registrations
              </div>
            )}
          </div>
        </div>

        {/* X-axis Labels (aligned with bottom) */}
        <div className="flex items-center justify-between text-xs font-medium text-[#9CA3AF] mt-4 pl-8 pr-1 select-none">
          {labels.map((m, idx) => (
            <span
              key={idx}
              className={`transition-colors ${
                hoveredIdx === idx ? 'text-[#3B82F6] font-bold' : ''
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

