import React, { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
  description?: string;
  containerClassName?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, containerClassName, id, checked, ...props }, ref) => {
    const radioId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label
        htmlFor={radioId}
        className={clsx(
          'flex items-start gap-3 cursor-pointer group select-none',
          props.disabled && 'cursor-not-allowed opacity-50',
          containerClassName
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={clsx(
              'w-5 h-5 rounded-full border border-[#17384e] bg-[#091b27] transition-all duration-200 flex items-center justify-center shadow-sm',
              'group-hover:border-teal-500/50 peer-checked:border-teal-400',
              'peer-focus:ring-2 peer-focus:ring-teal-500/20',
              className
            )}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 opacity-0 peer-checked:opacity-100 transition-opacity" />
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

Radio.displayName = 'Radio';
