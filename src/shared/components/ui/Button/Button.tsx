import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary: 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:brightness-110 text-slate-950 font-semibold shadow-sm hover:shadow-[var(--shadow-glow)] border border-transparent',
      secondary: 'bg-[var(--bg-table)] hover:bg-[var(--bg-surface-hover)] text-slate-200 border border-[var(--border-table)] shadow-sm hover:border-[var(--brand-primary)]/40',
      outline: 'bg-transparent border border-[var(--border-table)] text-slate-200 hover:bg-[var(--bg-table)] hover:text-white hover:border-[var(--brand-primary)]/40',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-500/20 border border-transparent',
      ghost: 'bg-transparent hover:bg-[var(--bg-surface-hover)] text-slate-300 hover:text-white',
      success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 border border-transparent',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
      md: 'text-sm px-4 py-2.5 rounded-xl gap-2 h-10',
      lg: 'text-base px-6 py-3 rounded-xl gap-2.5 h-12',
      icon: 'p-2 rounded-xl h-10 w-10 justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
