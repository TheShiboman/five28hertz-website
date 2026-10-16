import React from 'react';
import logoImage from '../../assets/logo.png';

interface AssetLogoProps {
  className?: string;
  variant?: 'default' | 'small' | 'large';
}

/**
 * AssetLogo component for Argento Homes
 * Uses a direct import of the logo image file which is processed by Vite
 */
export function AssetLogo({ 
  className = "", 
  variant = "default"
}: AssetLogoProps) {
  // Size classes based on variant - doubled in size
  const sizeClasses = {
    small: "h-16", // was h-8
    default: "h-24", // was h-12
    large: "h-32" // was h-16
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Argento Homes" 
        className={`${sizeClasses[variant]} object-contain mr-3`}
      />
    </div>
  );
}

export default AssetLogo;