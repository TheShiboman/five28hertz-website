import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AchievementType } from '@/components/achievement-badge';
import { getQueryFn } from '@/lib/queryClient';

export function useUserAchievements(userId: number | undefined) {
  return useQuery<{ achievements: AchievementType[] }>({
    queryKey: ['/api/users', userId, 'achievements'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!userId, // Only run query if userId is provided
  });
}