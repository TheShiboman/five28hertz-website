import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Award, Star, Globe, Clock } from 'lucide-react';

export type AchievementType = 'mentor' | 'cultural' | 'trusted' | 'time';

interface AchievementBadgeProps {
  type: AchievementType;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function AchievementBadge({ 
  type, 
  size = 'md',
  showTooltip = true 
}: AchievementBadgeProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const iconClass = `${sizeClass[size]} text-foreground`;
  
  const getAchievementIcon = () => {
    switch (type) {
      case 'mentor':
        return <Award className={`${iconClass} text-amber-500`} />;
      case 'cultural':
        return <Globe className={`${iconClass} text-emerald-500`} />;
      case 'trusted':
        return <Star className={`${iconClass} text-purple-500`} />;
      case 'time':
        return <Clock className={`${iconClass} text-blue-500`} />;
    }
  };
  
  const getAchievementTooltip = () => {
    switch (type) {
      case 'mentor':
        return 'Mentor: Completed 5+ teaching exchanges';
      case 'cultural':
        return 'Culture Connector: Has exchanged with people in 3+ different countries';
      case 'trusted':
        return 'Trusted Peer: 10+ reviews with avg rating above 4.5';
      case 'time':
        return 'Time Hero: 20+ total hours shared';
    }
  };

  const badge = (
    <div className="inline-flex items-center justify-center rounded-full bg-background border-2 p-1">
      {getAchievementIcon()}
    </div>
  );
  
  if (!showTooltip) {
    return badge;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{getAchievementTooltip()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}