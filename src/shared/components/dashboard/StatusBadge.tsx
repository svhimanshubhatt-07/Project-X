import React from 'react';
import { Badge, BadgeProps } from '../ui/Badge';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Ban,
  PauseCircle,
} from 'lucide-react';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className,
}) => {
  const normalized = (status || '').toUpperCase().trim();

  let variant: BadgeProps['variant'] = 'default';
  let label = normalized.replace(/_/g, ' ');
  let icon = <Clock className="w-3.5 h-3.5" />;

  switch (normalized) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'VERIFIED':
    case 'SUCCESS':
    case 'PUBLISHED':
      variant = 'success';
      icon = <CheckCircle2 className="w-3.5 h-3.5" />;
      break;

    case 'UNDER_REVIEW':
    case 'IN_REVIEW':
      variant = 'warning';
      icon = <Clock className="w-3.5 h-3.5" />;
      break;

    case 'MORE_INFORMATION_REQUIRED':
    case 'ACTION_REQUIRED':
      variant = 'orange';
      label = 'MORE INFO REQUIRED';
      icon = <AlertCircle className="w-3.5 h-3.5" />;
      break;

    case 'SUBMITTED':
    case 'RESUBMITTED':
    case 'PENDING':
      variant = 'info';
      icon = <Clock className="w-3.5 h-3.5" />;
      break;

    case 'REJECTED':
    case 'FAILED':
    case 'SUSPENDED':
      variant = 'danger';
      icon = <XCircle className="w-3.5 h-3.5" />;
      break;

    case 'NOT_STARTED':
    case 'DRAFT':
    case 'INACTIVE':
      variant = 'default';
      label = normalized === 'NOT_STARTED' ? 'NOT STARTED' : normalized.replace(/_/g, ' ');
      icon = <PauseCircle className="w-3.5 h-3.5" />;
      break;

    default:
      variant = 'default';
      icon = <HelpCircle className="w-3.5 h-3.5" />;
  }

  return (
    <Badge variant={variant} size={size} icon={icon} className={className}>
      {label}
    </Badge>
  );
};
