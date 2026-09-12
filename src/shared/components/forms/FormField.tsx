import React, { ReactNode } from 'react';
import clsx from 'clsx';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  helperText,
  children,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 tracking-wide select-none">
          {label}
          {required && <span className="text-orange-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p className="text-xs text-rose-400 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
