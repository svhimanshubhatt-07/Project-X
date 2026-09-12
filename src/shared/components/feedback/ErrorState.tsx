import React, { ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import clsx from 'clsx';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this data. Please try again.',
  onRetry,
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-rose-500/30 bg-[#091b27] max-w-md mx-auto my-6 shadow-xl',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-slate-100 font-heading">{title}</h3>
      <p className="text-xs text-rose-300 mt-1.5 leading-relaxed max-w-xs">{message}</p>

      <div className="mt-5 flex items-center gap-3">
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retry
          </Button>
        )}
        {action}
      </div>
    </div>
  );
};
