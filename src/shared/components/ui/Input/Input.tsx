import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={clsx('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-content-secondary tracking-wide select-none"
          >
            {label}
            {props.required && <span className="text-brand-primary ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-content-muted">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={clsx(
              'w-full h-11 px-3.5 bg-bg-cardInner text-sm text-content-primary placeholder-content-muted rounded-xl border transition-all duration-200 outline-none shadow-sm',
              'border-border-subtle hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-glow focus:bg-bg-cardInner',
              'disabled:bg-bg-app disabled:border-border-divider disabled:text-content-muted disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error && '!border-rose-500 focus:!ring-rose-500/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-content-muted">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-400 mt-0.5 animate-fadeIn">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-content-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
