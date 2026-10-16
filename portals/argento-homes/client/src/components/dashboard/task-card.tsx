import { Button } from '@/components/ui/button';
import { ReactNode, isValidElement, cloneElement } from 'react';
import { Sparkles, Wrench, Leaf, CheckCircle, AlertTriangle, Calendar, Home, FileText, Settings } from 'lucide-react';

interface TaskCardProps {
  icon: ReactNode;
  iconBgColor?: string;
  title: string;
  location: string;
  date: string;
  onViewDetails: () => void;
}

const TaskCard = ({ icon, iconBgColor, title, location, date, onViewDetails }: TaskCardProps) => {
  // Map icon types to brand colors
  let iconColor = "text-brand";
  let bgColor = "bg-brand/10";

  if (isValidElement(icon)) {
    const iconType = icon.type;
    
    // Map different icon types to appropriate brand colors
    if (iconType === Sparkles) {
      iconColor = "text-brand-warning";
      bgColor = "bg-brand-warning/10";
    } else if (iconType === Wrench) {
      iconColor = "text-brand";
      bgColor = "bg-brand/10";
    } else if (iconType === Leaf) {
      iconColor = "text-brand-success";
      bgColor = "bg-brand-success/10";
    } else if (iconType === CheckCircle) {
      iconColor = "text-brand-success";
      bgColor = "bg-brand-success/10";
    } else if (iconType === AlertTriangle) {
      iconColor = "text-brand-danger";
      bgColor = "bg-brand-danger/10";
    } else if (iconType === Calendar) {
      iconColor = "text-brand-light";
      bgColor = "bg-brand-light/10";
    } else if (iconType === Home) {
      iconColor = "text-brand-muted";
      bgColor = "bg-brand-muted/10";
    } else if (iconType === FileText) {
      iconColor = "text-brand-muted";
      bgColor = "bg-brand-muted/10";
    } else if (iconType === Settings) {
      iconColor = "text-brand-muted";
      bgColor = "bg-brand-muted/10";
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
    <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-center hover:border-[#2ECC71]/20 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
      <div className="flex items-start">
        <div className={`${finalBgColor} p-2 rounded mr-4`}>
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-[#2E2E2E]">{title}</h4>
          <p className="text-sm text-[#2E2E2E]/70">{location} - {date}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        className="text-sm text-[#2ECC71] hover:text-[#2ECC71]/80 font-medium"
        onClick={onViewDetails}
      >
        Details
      </Button>
    </div>
  );
};

export default TaskCard;
