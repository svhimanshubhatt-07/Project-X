import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { ChevronDown } from 'lucide-react';

export const RegistrationChart: React.FC = () => {
  const [range, setRange] = useState('Last 6 Months');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const data = [12, 18, 24, 21, 28, 35, 34, 42, 48]; // out of 50

  // Generate SVG path for smooth line
  const width = 600;
  const height = 180;
  const paddingX = 20;
  const paddingY = 20;

  const points = data.map((val, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (val / 50) * (height - paddingY * 2);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <Card className="h-full bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl">
      <CardHeader
        title="Company Registration Trend"
        action={
          <div className="relative">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] text-xs font-medium text-slate-300 hover:text-white transition-colors">
              <span>{range}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        }
      />
      <CardBody className="p-6">
        <div className="relative flex">
          {/* Y Axis Labels */}
          <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 pr-3 pb-6 h-48 select-none">
            <span>50</span>
            <span>40</span>
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
          </div>

          {/* SVG Chart Area */}
          <div className="flex-1 relative h-48">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
              <div className="w-full border-b border-[var(--border-divider)]" />
              <div className="w-full border-b border-[var(--border-divider)]" />
              <div className="w-full border-b border-[var(--border-divider)]" />
              <div className="w-full border-b border-[var(--border-divider)]" />
              <div className="w-full border-b border-[var(--border-divider)]" />
              <div className="w-full border-b border-[var(--border-divider)]" />
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e599" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00e599" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Gradient Fill */}
              <path d={areaD} fill="url(#trendGradient)" />

              {/* Smooth Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#00e599"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Data dots */}
              {points.map((p, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#00e599"
                    stroke="#041914"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  {/* Hover tooltip */}
                  <title>{`${months[idx]}: ${p.val} Registrations`}</title>
                </g>
              ))}
            </svg>

            {/* X-axis Labels */}
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mt-2 px-1 select-none">
              {months.map((m, idx) => (
                <span key={idx}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
