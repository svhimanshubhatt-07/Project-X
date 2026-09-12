import React, { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
  description?: string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, containerClassName, id, checked, ...props }, ref) => {
    const checkId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={checkId}
        className={clsx(
          'flex items-start gap-3 cursor-pointer group select-none',
          props.disabled && 'cursor-not-allowed opacity-50',
          containerClassName
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            id={checkId}
            ref={ref}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={clsx(
              'w-5 h-5 rounded-md border border-[#17384e] bg-[#091b27] transition-all duration-200 flex items-center justify-center shadow-sm',
              'group-hover:border-teal-500/50 peer-checked:bg-teal-500 peer-checked:border-teal-500',
              'peer-focus:ring-2 peer-focus:ring-teal-500/20',
              className
            )}
          >
            <Check className="w-3.5 h-3.5 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-sm font-medium text-slate-200">{label}</span>}
            {description && <span className="text-xs text-slate-400 mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
