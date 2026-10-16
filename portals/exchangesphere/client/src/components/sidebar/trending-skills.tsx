import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Camera, Code, Clock } from 'lucide-react';

interface TrendingSkill {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

export function TrendingSkills() {
  // Trending skills array - in a real app, these would come from an API
  const trendingSkills: TrendingSkill[] = [
    {
      id: 1,
      name: 'Photography',
      icon: <Camera className="h-6 w-6" />,
      count: 342,
      color: 'bg-primary bg-opacity-10 text-primary'
    },
    {
      id: 2,
      name: 'Web Design',
      icon: <Code className="h-6 w-6" />,
      count: 287,
      color: 'bg-secondary bg-opacity-10 text-secondary'
    },
    {
      id: 3,
      name: 'Language Lessons',
      icon: <Clock className="h-6 w-6" />,
      count: 238,
      color: 'bg-accent bg-opacity-10 text-accent'
    }
  ];
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <CardContent className="p-0">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Trending Skills</h3>
        <div className="space-y-4">
          {trendingSkills.map((skill) => (
            <div key={skill.id} className="flex items-center">
              <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md ${skill.color}`}>
                {skill.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">{skill.name}</p>
                <p className="text-xs text-gray-500">{skill.count} people offering</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/explore">
          <Button variant="outline" className="mt-4 w-full">
            Explore More Skills
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
