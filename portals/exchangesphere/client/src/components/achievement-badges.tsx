import React from 'react';
import { AchievementBadge, AchievementType } from './achievement-badge';

interface AchievementBadgesProps {
  achievements: AchievementType[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AchievementBadges({ 
  achievements,
  size = 'md',
  className = '',
}: AchievementBadgesProps) {
  if (!achievements.length) return null;
  
  return (
    <div className={`flex space-x-1 ${className}`}>
      {achievements.map(achievement => (
        <AchievementBadge 
          key={achievement} 
          type={achievement} 
          size={size}
        />
      ))}
    </div>
  );
}