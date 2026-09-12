import React, { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { SelectOption } from '../../../types/common.types';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options = [],
      children,
      error,
      helperText,
      className,
      containerClassName,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={clsx('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-content-secondary tracking-wide select-none"
          >
            {label}
            {props.required && <span className="text-brand-primary ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={clsx(
              'w-full h-11 pl-3.5 pr-10 bg-bg-cardInner text-sm text-content-primary rounded-xl border transition-all duration-200 appearance-none outline-none cursor-pointer shadow-sm',
              'border-border-subtle hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-glow focus:bg-bg-cardInner',
              'disabled:bg-bg-app disabled:border-border-divider disabled:text-content-muted disabled:cursor-not-allowed',
              error && '!border-rose-500',
              className
            )}
            {...props}
          >
            {children ? (
              children
            ) : (
              options.map((opt) => (
                <option
                  key={String(opt.value)}
                  value={String(opt.value)}
                  disabled={opt.disabled}
                  className="bg-bg-surface text-content-primary py-1"
                >
                  {opt.label}
                </option>
              ))
            )}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 text-content-muted pointer-events-none" />
        </div>

        {error ? (
          <p className="text-xs text-rose-400 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-content-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
