import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { ProfileCard } from '@/components/sidebar/profile-card';
import { ImpactStats } from '@/components/sidebar/impact-stats';
import { BucketList } from '@/components/sidebar/bucket-list';
import { MessagesPreview } from '@/components/sidebar/messages-preview';
import { TrendingSkills } from '@/components/sidebar/trending-skills';
import { SuccessStory } from '@/components/sidebar/success-story';
import { Greeting } from '@/components/dashboard/greeting';
import { UpcomingExchanges } from '@/components/dashboard/upcoming-exchanges';
import { RecommendedMatches } from '@/components/dashboard/recommended-matches';
import { CommunityFeed } from '@/components/dashboard/community-feed';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Exchange } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestExchangeCompletion } from '@/components/dashboard/test-exchange-completion';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <ProfileCard user={user} />
            <ImpactStats userId={user.id} />
            <BucketList userId={user.id} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6">
            <Greeting user={user} />
            <TestExchangeCompletion userId={user.id} />
            <UpcomingExchanges userId={user.id} />
            <RecommendedMatches userId={user.id} />
            <CommunityFeed limit={2} />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <MessagesPreview userId={user.id} />
            <TrendingSkills />
            <SuccessStory />
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
