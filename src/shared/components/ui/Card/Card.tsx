import React, { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'subtle' | 'gradient';
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  isHoverable = false,
  ...props
}) => {
  const variants = {
    default: 'bg-bg-card border border-border-card shadow-xl text-content-primary',
    glass: 'bg-bg-card/80 backdrop-blur-md border border-border-card shadow-xl text-content-primary',
    subtle: 'bg-bg-cardInner border border-border-card text-content-primary',
    gradient: 'bg-gradient-to-b from-bg-card to-bg-cardInner border border-border-card shadow-xl text-content-primary',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-200 overflow-hidden',
        variants[variant],
        isHoverable && 'hover:border-brand-primary/40 hover:shadow-2xl hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement> & { title?: string; subtitle?: string; action?: ReactNode }> = ({
  children,
  title,
  subtitle,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'px-6 py-5 border-b border-border-divider flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      {children || (
        <>
          <div>
            {title && <h3 className="text-base font-semibold text-content-primary font-heading">{title}</h3>}
            {subtitle && <p className="text-xs text-content-secondary mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </>
      )}
    </div>
  );
};

export const CardBody: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={clsx('p-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={clsx('px-6 py-4 border-t border-border-divider bg-bg-cardInner/70 flex items-center justify-end gap-3', className)} {...props}>
      {children}
    </div>
  );
};
