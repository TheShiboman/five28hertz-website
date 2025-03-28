import { ReactNode, cloneElement, isValidElement } from 'react';
import { ArrowUp, ArrowDown, Home, CheckCircle, DollarSign, Calendar, Sparkles, Wrench, Leaf } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface KpiCardProps {
  icon: ReactNode;
  iconBgColor?: string;
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
}

const KpiCard = ({ icon, iconBgColor, title, value, change }: KpiCardProps) => {
  // Map icon types to brand colors
  let iconColor = "text-brand";
  let bgColor = "bg-brand/10";

  // Determine icon colors based on icon type
  if (isValidElement(icon)) {
    const iconType = icon.type;
    if (iconType === CheckCircle) {
      iconColor = "text-brand-success";
      bgColor = "bg-brand-success/10";
    } else if (iconType === DollarSign || iconType === Sparkles) {
      iconColor = "text-brand-warning";
      bgColor = "bg-brand-warning/10";
    } else if (iconType === Wrench) {
      iconColor = "text-brand";
      bgColor = "bg-brand/10";
    } else if (iconType === Leaf) {
      iconColor = "text-brand-success";
      bgColor = "bg-brand-success/10";
    } else if (iconType === Calendar) {
      iconColor = "text-brand";
      bgColor = "bg-brand/10";
    }
    
    // Apply color class to the icon
    const existingClass = (icon.props.className || '').split(' ').filter((c: string) => !c.startsWith('text-')).join(' ');
    const newClassName = existingClass ? `${existingClass} ${iconColor}` : iconColor;
    
    // Clone element with the new className
    icon = cloneElement(icon, { 
      ...icon.props,
      className: newClassName
    });
  }

  // Use provided background color or the mapped one
  const finalBgColor = iconBgColor || bgColor;

  return (
    <Card className="p-5 flex items-center bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
      <div className={`rounded-full ${finalBgColor} p-3 flex items-center justify-center`}>
        {icon}
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="text-xl font-semibold text-[#2E2E2E]">{value}</div>
      </div>
      {change && (
        <div className="ml-auto">
          <span className={`text-xs font-medium flex items-center ${
            change.isPositive 
              ? 'text-[#2ECC71]' 
              : 'text-red-500'
          }`}>
            {change.isPositive ? (
              <ArrowUp className="mr-1" size={14} />
            ) : (
              <ArrowDown className="mr-1" size={14} />
            )}
            {change.value}
          </span>
        </div>
      )}
    </Card>
  );
};

export default KpiCard;
