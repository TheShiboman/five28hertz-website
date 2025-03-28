import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color?: 'primary' | 'secondary' | 'accent';
  showValue?: boolean;
}

export function ProgressBar({ 
  value, 
  max, 
  label, 
  color = 'primary',
  showValue = true 
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const getBarColor = () => {
    switch(color) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'accent':
        return 'bg-accent';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && (
          <span className={`text-sm font-medium text-${color}`}>
            {value}/{max}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${getBarColor()} rounded-full h-2`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
