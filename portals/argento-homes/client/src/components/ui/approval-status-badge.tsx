import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ApprovalStatus } from '@shared/schema';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface ApprovalStatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * A component that displays a badge with the approval status
 * and appropriate styling based on the status value.
 * Updated to use Argento Homes brand colors.
 */
export function ApprovalStatusBadge({ status, className = '' }: ApprovalStatusBadgeProps) {
  // Determine badge style and icon based on status
  let badgeStyle = '';
  let statusText = status.toUpperCase();
  let icon = null;

  switch (status) {
    case ApprovalStatus.APPROVED:
      badgeStyle = 'badge-approved';
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      break;
    case ApprovalStatus.REJECTED:
      badgeStyle = 'badge-rejected';
      icon = <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      break;
    case ApprovalStatus.PENDING:
    default:
      badgeStyle = 'badge-pending';
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      break;
  }

  return (
    <Badge variant="outline" className={`${badgeStyle} ${className} flex items-center`}>
      {icon}
      {statusText}
    </Badge>
  );
}