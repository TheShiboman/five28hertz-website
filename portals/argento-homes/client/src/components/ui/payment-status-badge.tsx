import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, XCircle, RotateCcw } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * A component that displays a badge with the payment status
 * and appropriate styling based on the status value.
 * Updated to use Argento Homes brand colors.
 */
export function PaymentStatusBadge({ status, className = '' }: PaymentStatusBadgeProps) {
  const statusLower = status?.toLowerCase() || '';
  
  // Define badge style and icon based on status
  let badgeStyle = "";
  let icon = null;
  
  switch(statusLower) {
    case 'paid':
      badgeStyle = "bg-brand-success/20 text-brand-success";
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      break;
    case 'pending':
      badgeStyle = "bg-brand-warning/20 text-brand-warning";
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      break;
    case 'failed':
      badgeStyle = "bg-brand-danger/20 text-brand-danger";
      icon = <XCircle className="h-3.5 w-3.5 mr-1" />;
      break;
    case 'refunded':
      badgeStyle = "bg-brand-muted/20 text-brand-muted";
      icon = <RotateCcw className="h-3.5 w-3.5 mr-1" />;
      break;
    default:
      badgeStyle = "bg-brand-muted/20 text-brand-muted";
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1" />;
  }
  
  return (
    <Badge 
      variant="outline" 
      className={cn("flex items-center whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium", badgeStyle, className)}
    >
      {icon}
      {statusLower === 'paid' ? 'Paid' : 
       statusLower === 'pending' ? 'Pending' :
       statusLower === 'failed' ? 'Failed' :
       statusLower === 'refunded' ? 'Refunded' : 'Unknown'}
    </Badge>
  );
}