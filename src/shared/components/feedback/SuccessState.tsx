import React, { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export interface SuccessStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title = 'Action Successful',
  message = 'The operation has been completed successfully.',
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-emerald-500/30 bg-[#091b27] max-w-md mx-auto my-6 shadow-xl',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-slate-100 font-heading">{title}</h3>
      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xs">{message}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
