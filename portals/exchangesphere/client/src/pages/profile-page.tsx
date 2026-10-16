import React from 'react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Skill } from '@shared/schema';
import { UserAvatar } from '@/components/user-avatar';
import { SkillBadge } from '@/components/skill-badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Star, Clock, AlertCircle, Users, Calendar } from 'lucide-react';
import { BucketListTab } from '@/components/profile/bucket-list-tab';
import { ReferralCodeSection } from '@/components/profile/referral-code';
import { ReferralStatsSection } from '@/components/profile/referral-stats';
import { AvailabilityTab } from '@/components/profile/availability-tab';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const { data: skills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <UserAvatar 
                  src={user.avatarUrl ? user.avatarUrl : undefined}
                  name={user.fullName}
                  size="xl"
                />
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">{user.fullName}</h1>
                  <p className="text-gray-500 mb-3">@{user.username}</p>
                  
                  {user.location && (
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="inline-block mr-1">📍</span> {user.location}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                    {skills?.slice(0, 5).map((skill) => (
                      <SkillBadge 
                        key={skill.id}
                        skill={skill.name}
                      />
                    ))}
                  </div>
                  
                  <div className="flex gap-3 justify-center md:justify-start">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">4.9 (36 reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium">42 hours shared</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button>Edit Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Tabs defaultValue="about">
            <TabsList className="mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="bucket-list">Bucket List</TabsTrigger>
              <TabsTrigger value="exchanges">Exchange History</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="availability">
                <Calendar className="h-4 w-4 mr-2" />
                Availability
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.bio ? (
                    <p className="text-gray-700">{user.bio}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">No bio yet</h3>
                      <p className="text-gray-400 mb-4">Tell others about yourself, your interests, and what you're passionate about.</p>
                      <Button>Add Bio</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>My Skills</CardTitle>
                    <Button size="sm">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingSkills ? (
                    <p>Loading skills...</p>
                  ) : skills && skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <div key={skill.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800">{skill.name}</h3>
                              <p className="text-sm text-gray-500">{skill.category}</p>
                            </div>
                            <SkillBadge skill={skill.category} />
                          </div>
                          {skill.description && (
                            <p className="mt-2 text-sm text-gray-600">{skill.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">No skills added yet</h3>
                      <p className="text-gray-400 mb-4">Add skills you'd like to share with others.</p>
                      <Button>Add First Skill</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bucket-list">
              <BucketListTab userId={user.id} />
            </TabsContent>
            
            <TabsContent value="exchanges">
              <Card>
                <CardHeader>
                  <CardTitle>Exchange History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No exchanges yet</h3>
                    <p className="text-gray-400 mb-4">Explore matches and start exchanging skills with others.</p>
                    <Button>Find Matches</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No reviews yet</h3>
                    <p className="text-gray-400 mb-4">Reviews will appear here after completing exchanges.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="referrals">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReferralCodeSection userId={user.id} />
                <ReferralStatsSection userId={user.id} />
              </div>
            </TabsContent>
            
            <TabsContent value="availability">
              <AvailabilityTab userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
