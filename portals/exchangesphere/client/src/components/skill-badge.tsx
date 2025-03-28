import React from 'react';

type SkillCategory = 'photography' | 'cooking' | 'yoga' | 'design' | 'language' | 'drone' | 'editing' | 'baking';

interface SkillBadgeProps {
  skill: string;
  category?: SkillCategory;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillBadge({ skill, category, size = 'md' }: SkillBadgeProps) {
  const getCategoryColors = (category?: SkillCategory) => {
    switch(category) {
      case 'photography':
        return 'bg-blue-100 text-blue-700';
      case 'cooking':
        return 'bg-green-100 text-green-700';
      case 'yoga':
        return 'bg-purple-100 text-purple-700';
      case 'design':
        return 'bg-indigo-100 text-indigo-700';
      case 'language':
        return 'bg-yellow-100 text-yellow-700';
      case 'drone':
        return 'bg-blue-100 text-blue-800';
      case 'editing':
        return 'bg-purple-100 text-purple-800';
      case 'baking':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${getCategoryColors(category)} ${sizeClasses[size]}`}>
      {skill}
    </span>
  );
}
