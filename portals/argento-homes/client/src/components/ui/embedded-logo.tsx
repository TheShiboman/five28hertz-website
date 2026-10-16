import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * A component that displays the Argento Homes logo as text
 * This is a fallback solution when image loading fails
 */
export function EmbeddedLogo({ className = "", size = 'medium' }: LogoProps) {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`font-serif font-bold ${sizeClasses[size]}`}>
        <span className="text-amber-500">Argento</span>
        <span className="text-charcoal ml-1">Homes</span>
      </div>
    </div>
  );
}

export default EmbeddedLogo;