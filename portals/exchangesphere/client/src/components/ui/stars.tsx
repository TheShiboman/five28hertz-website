import React from 'react';
import { Star } from 'lucide-react';

interface StarsProps {
  rating: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function Stars({ rating, max = 5, size = 'md' }: StarsProps) {
  // Calculate full stars, partial star, and empty stars
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const emptyStars = max - fullStars - (hasPartialStar ? 1 : 0);
  
  // Size classes for different star sizes
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  // Render the stars
  return (
    <div className="flex items-center">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />
      ))}
      
      {/* Partial star if needed */}
      {hasPartialStar && (
        <div className="relative">
          {/* Background star (empty) */}
          <Star className={`${sizeClasses[size]} text-yellow-400`} />
          {/* Foreground star (filled) with width based on partial value */}
          <div 
            className="absolute top-0 left-0 overflow-hidden" 
            style={{ width: `${(rating % 1) * 100}%` }}
          >
            <Star className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClasses[size]} text-yellow-400`} />
      ))}
    </div>
  );
}
