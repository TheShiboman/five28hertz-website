import React from 'react';
import { User } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { PlusCircle, Search } from 'lucide-react';

interface GreetingProps {
  user: User;
}

export function Greeting({ user }: GreetingProps) {
  // Get the current time to show appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-6 text-white mb-6 relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-2xl font-bold">{getGreeting()}, {user.fullName.split(' ')[0]}!</h1>
        <p className="mt-1">Ready to make meaningful connections today?</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" className="bg-white text-primary hover:bg-gray-50">
            <PlusCircle className="h-5 w-5 mr-2" />
            Offer Skill
          </Button>
          <Link href="/explore">
            <a>
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-50">
                <Search className="h-5 w-5 mr-2" />
                Explore
              </Button>
            </a>
          </Link>
        </div>
      </div>
      
      {/* Background pattern for some visual interest */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="white" d="M44.9,-76.2C59.7,-69.2,74.4,-60.1,83.4,-46.5C92.3,-32.9,95.5,-14.7,94.1,2.8C92.8,20.4,87,37.3,76.9,50.9C66.7,64.5,52.3,74.7,36.6,79.9C20.9,85.1,3.9,85.3,-12.7,82.2C-29.3,79.1,-45.4,72.7,-57.3,61.9C-69.2,51.1,-76.7,35.9,-80.4,19.7C-84.2,3.4,-84.1,-13.9,-78.9,-29.1C-73.7,-44.3,-63.2,-57.5,-49.7,-65.2C-36.2,-72.9,-19.6,-75.2,-2.9,-71C13.9,-66.7,30.1,-83.2,44.9,-76.2Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>
  );
}
