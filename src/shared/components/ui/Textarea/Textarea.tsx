import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      containerClassName,
      disabled,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={clsx('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-content-secondary tracking-wide select-none"
          >
            {label}
            {props.required && <span className="text-brand-primary ml-1">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={clsx(
            'w-full p-3.5 bg-bg-cardInner text-sm text-content-primary placeholder-content-muted rounded-xl border transition-all duration-200 outline-none resize-y shadow-sm',
            'border-border-subtle hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-glow focus:bg-bg-cardInner',
            'disabled:bg-bg-app disabled:border-border-divider disabled:text-content-muted disabled:cursor-not-allowed',
            error && '!border-rose-500',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs text-rose-400 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-content-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
