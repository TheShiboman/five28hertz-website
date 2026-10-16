import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { UserAvatar } from '@/components/user-avatar';
import { SkillBadge } from '@/components/skill-badge';
import { User } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { Stars } from '@/components/ui/stars';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { data: skills } = useQuery({
    queryKey: ['/api/skills'],
    enabled: !!user,
  });
  
  const { data: reviews } = useQuery({
    queryKey: [`/api/reviews/user/${user.id}`],
    enabled: !!user,
  });
  
  const averageRating = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, [reviews]);
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <CardContent className="p-0">
        <div className="flex flex-col items-center text-center">
          <UserAvatar
            src={user.avatarUrl}
            name={user.fullName}
            size="xl"
            className="mb-3"
          />
          <h3 className="text-lg font-medium text-gray-800">{user.fullName}</h3>
          <p className="text-sm text-gray-500">{user.location || 'No location set'}</p>
          <div className="flex mt-2 items-center">
            <Stars rating={averageRating} />
            <span className="ml-1 text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews?.length || 0} reviews)
            </span>
          </div>
          <div className="mt-4 flex space-x-1">
            {skills?.slice(0, 3).map(skill => (
              <SkillBadge 
                key={skill.id} 
                skill={skill.name} 
                category={skill.category as any}
                size="sm"
              />
            ))}
          </div>
          <Link href="/profile">
            <a className="w-full">
              <Button variant="outline" className="mt-4 w-full">
                Edit Profile
              </Button>
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
