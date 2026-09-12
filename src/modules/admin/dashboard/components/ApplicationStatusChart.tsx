import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';

export const ApplicationStatusChart: React.FC = () => {
  const items = [
    { label: 'Active', count: 210, pct: '84.7%', color: '#00e599', strokeDash: '266 314', strokeOffset: '0' },
    { label: 'Pending', count: 32, pct: '12.9%', color: '#f59e0b', strokeDash: '41 314', strokeOffset: '-266' },
    { label: 'Suspended', count: 4, pct: '1.6%', color: '#ef4444', strokeDash: '5 314', strokeOffset: '-307' },
    { label: 'Inactive', count: 2, pct: '0.8%', color: '#64748b', strokeDash: '3 314', strokeOffset: '-312' },
  ];

  return (
    <Card className="h-full bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl flex flex-col">
      <CardHeader title="Company Status Distribution" />
      <CardBody className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Donut Chart with Center Text */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#0b2e26"
                strokeWidth="14"
              />
              {/* Segments */}
              {items.map((item, idx) => (
                <circle
                  key={idx}
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="14"
                  strokeDasharray={item.strokeDash}
                  strokeDashoffset={item.strokeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              ))}
            </svg>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">248</span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">Total</span>
            </div>
          </div>

          {/* Legend on Right */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-0.5 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-slate-300 text-xs truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <span className="font-bold text-white font-mono text-xs">{item.count}</span>
                  <span className="text-slate-400 text-[11px] font-medium whitespace-nowrap">({item.pct})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
