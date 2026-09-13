import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';

export const ApplicationStatusChart: React.FC = () => {
  const items = [
    { label: 'Active', count: 180, pct: '72%', color: '#00E599', strokeDash: '72 28', strokeOffset: '0' },
    { label: 'Pending', count: 32, pct: '13%', color: '#F59E0B', strokeDash: '13 87', strokeOffset: '-72' },
    { label: 'Suspended', count: 22, pct: '9%', color: '#EF4444', strokeDash: '9 91', strokeOffset: '-85' },
    { label: 'Inactive', count: 14, pct: '6%', color: '#64748B', strokeDash: '6 94', strokeOffset: '-94' },
  ];

  return (
    <Card className="h-full bg-[#111827] border border-[#273244] shadow-xl flex flex-col">
      <CardHeader title="Company Status Distribution" />
      <CardBody className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-4 sm:gap-6 px-2">
          {/* Donut Chart with Center Text */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <g transform="rotate(115 60 60)">
                {/* Background ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#1F2937"
                  strokeWidth="15"
                />
                {/* Colored Segments */}
                {items.map((item, idx) => (
                  <circle
                    key={idx}
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="15"
                    pathLength="100"
                    strokeDasharray={item.strokeDash}
                    strokeDashoffset={item.strokeOffset}
                    className="transition-all duration-500"
                  />
                ))}
              </g>
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black font-heading text-white tracking-tight leading-none">
                248
              </span>
              <span className="text-[11px] font-medium text-[#9CA3AF] mt-0.5">
                Total
              </span>
            </div>
          </div>

          {/* Legend on Right matching reference image */}
          <div className="flex-1 space-y-3 pl-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-[#D1D5DB] text-xs">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
