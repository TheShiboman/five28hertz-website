import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { SkillBadge } from '@/components/skill-badge';
import { AchievementBadges } from '@/components/achievement-badges';
import { AchievementType } from '@/components/achievement-badge';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Link } from 'wouter';
import { Stars } from '@/components/ui/stars';
import { CheckCircle } from 'lucide-react';
import { useUserAchievements } from '@/hooks/use-achievements';

interface RecommendedMatchesProps {
  userId: number;
}

export function RecommendedMatches({ userId }: RecommendedMatchesProps) {
  const { data: matches, isLoading } = useQuery<User[]>({
    queryKey: ['/api/matches'],
    enabled: !!userId,
  });
  
  // Fetch achievements for the first two matches
  const firstMatchId = matches && matches.length > 0 ? matches[0].id : undefined;
  const secondMatchId = matches && matches.length > 1 ? matches[1].id : undefined;
  
  const { data: firstMatchAchievements } = useUserAchievements(firstMatchId);
  const { data: secondMatchAchievements } = useUserAchievements(secondMatchId);
  
  // For MVP, we'll augment user data with some extra match-specific info
  // In a real app, this would come from the API
  const enhancedMatches = React.useMemo(() => {
    if (!matches) return [];
    
    return matches.map((user, index) => {
      // Determine which achievements data to use based on index
      let userAchievements: AchievementType[] = [];
      if (index === 0 && firstMatchAchievements) {
        userAchievements = firstMatchAchievements.achievements;
      } else if (index === 1 && secondMatchAchievements) {
        userAchievements = secondMatchAchievements.achievements;
      }
      
      return {
        ...user,
        // Example skills that would come from API
        skills: [
          { id: 1, name: user.id === 2 ? 'Drone Photography' : 'Cooking', category: user.id === 2 ? 'photography' : 'cooking' },
          { id: 2, name: user.id === 2 ? 'Video Editing' : 'Baking', category: user.id === 2 ? 'editing' : 'baking' }
        ],
        // Example match score that would come from AI matching
        matchScore: user.id === 2 ? 93 : 87,
        // Example rating that would come from reviews
        rating: user.id === 2 ? 4.8 : 4.7,
        // Example bio summary
        bio: user.id === 2 
          ? 'David is an expert drone pilot who can help with aerial photography and is looking to learn cooking skills.'
          : 'Sarah is a professional chef who offers cooking lessons and is interested in learning photography skills.',
        // Include fetched achievements
        achievements: userAchievements
      };
    });
  }, [matches, firstMatchAchievements, secondMatchAchievements]);
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <CardContent className="p-0">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Recommended Matches for You</h2>
        
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Finding your matches...</div>
        ) : enhancedMatches && enhancedMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {enhancedMatches.slice(0, 2).map((match) => (
              <div key={match.id} className="border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <div className="flex items-start">
                  <UserAvatar
                    src={match.avatarUrl}
                    name={match.fullName}
                    size="lg"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-800">{match.fullName}</h3>
                      <div className="flex items-center">
                        <Stars rating={match.rating} size="xs" />
                        <span className="ml-1 text-xs text-gray-600">{match.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{match.location}</p>
                    
                    {match.achievements && match.achievements.length > 0 && (
                      <div className="mt-1">
                        <AchievementBadges 
                          achievements={match.achievements} 
                          size="sm"
                        />
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{match.bio}</p>
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                      {match.skills?.map((skill, idx) => (
                        <SkillBadge
                          key={idx}
                          skill={skill.name}
                          category={skill.category as any}
                          size="sm"
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div className="text-xs text-green-600 font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {match.matchScore}% Match
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="text-xs"
                        >
                          Connect
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No matches found</div>
        )}
        
        <Link href="/explore">
          <Button variant="outline" className="mt-4 w-full">
            Explore More Matches
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
