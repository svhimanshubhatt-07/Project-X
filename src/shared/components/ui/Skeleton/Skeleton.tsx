import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const variants = {
    text: 'rounded-md h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const inlineStyles = {
    width: width,
    height: height,
    ...style,
  };

  return (
    <div
      className={clsx(
        'bg-[#0f2d42] animate-pulse border border-[#17384e]/60',
        variants[variant],
        className
      )}
      style={inlineStyles}
      {...props}
    />
  );
};
