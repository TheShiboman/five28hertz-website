import React, { useState } from 'react';
import { EmbeddedLogo } from './embedded-logo';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'small' | 'large';
  type?: 'full' | 'icon';
}

/**
 * Logo component for Argento Homes
 * Simply displays the exact Argento Homes logo image
 * Falls back to text-based EmbeddedLogo if image fails to load
 */
export function Logo({ 
  className = "", 
  variant = "default", 
  type = "full" 
}: LogoProps) {
  const [imageLoaded, setImageLoaded] = useState(true);
  
  // Size classes based on variant
  const sizeClasses = {
    small: "h-8",
    default: "h-12",
    large: "h-16"
  };
  
  // Map variant to EmbeddedLogo size
  const embeddedSizeMap = {
    small: 'small',
    default: 'medium',
    large: 'large'
  } as const;
  
  // If image fails to load, show text-based logo instead
  if (!imageLoaded) {
    return <EmbeddedLogo className={className} size={embeddedSizeMap[variant]} />;
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/argento-homes-logo.png" 
        alt="Argento Homes" 
        className={sizeClasses[variant]}
        onError={() => setImageLoaded(false)}
      />
    </div>
  );
}

export default Logo;