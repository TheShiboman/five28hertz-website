import React from 'react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Exchange, BucketListItem, Review } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { UserAvatar } from '@/components/user-avatar';
import { AlertTriangle, Award, Clock, Leaf, Share2, Target, Trophy, Users } from 'lucide-react';

export default function ImpactDashboardPage() {
  const { user } = useAuth();

  const { data: exchanges, isLoading: isLoadingExchanges } = useQuery<Exchange[]>({
    queryKey: ['/api/exchanges'],
    enabled: !!user,
  });
  
  const { data: bucketList, isLoading: isLoadingBucketList } = useQuery<BucketListItem[]>({
    queryKey: ['/api/bucket-list', user?.id],
    enabled: !!user,
  });
  
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ['/api/reviews/user', user?.id],
    enabled: !!user,
  });

  if (!user) return null;
  
  const isLoading = isLoadingExchanges || isLoadingBucketList || isLoadingReviews;

  // Calculate impact metrics
  const completedExchanges = exchanges?.filter(ex => ex.status === 'completed') || [];
  const pendingExchanges = exchanges?.filter(ex => ex.status === 'accepted') || [];
  const completedBucketItems = bucketList?.filter(item => item.completed) || [];
  
  // Calculate total time in hours from completed exchanges
  const totalHours = completedExchanges.reduce((total, exchange) => {
    return total + (exchange.duration || 0) / 60;
  }, 0);
  
  // Skills exchanged (using title as a proxy since we don't have a skillId in the Exchange schema)
  const uniqueSkills = new Set<string>();
  completedExchanges.forEach(ex => {
    if (ex.title) uniqueSkills.add(ex.title);
  });
  
  // Calculate average rating
  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;
    
  // Calculate sustainability impact (1 hour = 2.5kg CO2 saved compared to buying new)
  const co2Saved = totalHours * 2.5;
  
  // Badges earned based on milestones
  const badges = [
    { earned: completedExchanges.length >= 5, name: 'Exchange Pioneer', icon: <Share2 className="h-5 w-5" /> },
    { earned: totalHours >= 10, name: 'Time Banker', icon: <Clock className="h-5 w-5" /> },
    { earned: averageRating >= 4.5, name: 'Trusted Teacher', icon: <Trophy className="h-5 w-5" /> },
    { earned: completedBucketItems.length >= 3, name: 'Dream Chaser', icon: <Target className="h-5 w-5" /> },
    { earned: co2Saved >= 20, name: 'Earth Saver', icon: <Leaf className="h-5 w-5" /> },
    { earned: uniqueSkills.size >= 3, name: 'Skill Collector', icon: <Award className="h-5 w-5" /> },
  ];
  
  const earnedBadges = badges.filter(badge => badge.earned);
  
  // Chart data
  const exchangeData = [
    { name: 'Jan', exchanges: 2 },
    { name: 'Feb', exchanges: 4 },
    { name: 'Mar', exchanges: 3 },
    { name: 'Apr', exchanges: 5 },
    { name: 'May', exchanges: 7 },
    { name: 'Jun', exchanges: 6 },
  ];
  
  const skillBreakdown = [
    { name: 'Teaching', value: 35 },
    { name: 'Learning', value: 30 },
    { name: 'Mentoring', value: 20 },
    { name: 'Creating', value: 15 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Level calculation - gamified progression
  const currentLevel = Math.floor(totalHours / 10) + 1;
  const experiencePoints = totalHours * 100 + completedExchanges.length * 50;
  const nextLevelPoints = currentLevel * 1000;
  const progressToNextLevel = (experiencePoints % 1000) / 10; // 0-100 percentage
  
  // Impact Tiers
  const TIERS = [
    { name: 'Bronze', min: 0, max: 1000 },
    { name: 'Silver', min: 1000, max: 2500 },
    { name: 'Gold', min: 2500, max: 5000 },
    { name: 'Platinum', min: 5000, max: 10000 },
    { name: 'Diamond', min: 10000, max: Infinity },
  ];
  
  const currentTier = TIERS.find(tier => 
    experiencePoints >= tier.min && experiencePoints < tier.max
  ) || TIERS[0];
  
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressToNextTier = nextTier 
    ? ((experiencePoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Impact Dashboard</h1>
          <p className="mt-2 text-lg text-gray-500">
            Track your impact, earn rewards, and see your sustainability contributions
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading your impact data...</span>
          </div>
        ) : (
          <>
            {/* User Level Card */}
            <Card className="mb-8 overflow-hidden border-2 border-primary/20">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <UserAvatar 
                        src={user.avatarUrl ? user.avatarUrl : undefined}
                        name={user.fullName}
                        size="lg"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {currentLevel}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{user.fullName}</h2>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                          Level {currentLevel} Exchange Master
                        </Badge>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          {currentTier.name} Tier
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Experience Points</div>
                    <div className="text-2xl font-bold text-primary">{experiencePoints.toLocaleString()}</div>
                    {nextTier && (
                      <div className="text-xs text-gray-500">
                        {nextTier.min - experiencePoints} points to {nextTier.name} tier
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level Progress</span>
                    <span>{progressToNextLevel.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-2" />
                  
                  {nextTier && (
                    <>
                      <div className="flex justify-between text-sm mb-1 mt-3">
                        <span>Progress to {nextTier.name} Tier</span>
                        <span>{progressToNextTier.toFixed(0)}%</span>
                      </div>
                      <Progress value={progressToNextTier} className="h-2 bg-amber-100" 
                        indicatorClassName="bg-amber-500" />
                    </>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Main Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Exchanges Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Share2 className="w-5 h-5 text-primary mr-2" />
                    <div className="text-3xl font-bold">{completedExchanges.length}</div>
                    <Badge className="ml-auto" variant="outline">
                      +{pendingExchanges.length} Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Hours Shared
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-indigo-500 mr-2" />
                    <div className="text-3xl font-bold">{totalHours.toFixed(1)}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    CO₂ Emissions Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Leaf className="w-5 h-5 text-green-500 mr-2" />
                    <div className="text-3xl font-bold">{co2Saved.toFixed(1)} kg</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Badges Earned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-amber-500 mr-2" />
                    <div className="text-3xl font-bold">{earnedBadges.length}</div>
                    <Badge className="ml-auto" variant="outline">
                      {badges.length - earnedBadges.length} Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Badges Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Achievement Badges</CardTitle>
                <CardDescription>
                  Collect badges by reaching milestones and making an impact in the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {badges.map((badge, i) => (
                    <div 
                      key={i}
                      className={`relative flex flex-col items-center justify-center p-4 text-center rounded-lg border ${
                        badge.earned 
                          ? 'border-primary/20 bg-primary/5' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className={`rounded-full p-3 mb-2 ${
                        badge.earned ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {badge.icon}
                      </div>
                      <span className="text-sm font-medium">{badge.name}</span>
                      {!badge.earned && (
                        <AlertTriangle className="absolute top-2 right-2 h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Exchange Activity</CardTitle>
                  <CardDescription>Your exchange activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={exchangeData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="exchanges" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Time Distribution</CardTitle>
                  <CardDescription>How you're distributing your exchange time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={skillBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {skillBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Impact Details */}
            <Tabs defaultValue="exchanges" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="exchanges">Exchange Details</TabsTrigger>
                <TabsTrigger value="sustainability">Sustainability Impact</TabsTrigger>
                <TabsTrigger value="community">Community Contribution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="exchanges">
                <Card>
                  <CardHeader>
                    <CardTitle>Exchange Breakdown</CardTitle>
                    <CardDescription>Detailed view of your exchanges and their impact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-blue-600 font-medium">Teaching</div>
                          <div className="text-2xl font-bold">{Math.round(completedExchanges.length / 2)}</div>
                          <div className="text-sm text-gray-500">exchanges</div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-green-600 font-medium">Learning</div>
                          <div className="text-2xl font-bold">{Math.round(completedExchanges.length / 2)}</div>
                          <div className="text-sm text-gray-500">exchanges</div>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-4">
                          <div className="text-amber-600 font-medium">Most Exchanged</div>
                          <div className="text-2xl font-bold">Photography</div>
                          <div className="text-sm text-gray-500">as a skill</div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-purple-600 font-medium">Average Rating</div>
                          <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
                          <div className="text-sm text-gray-500">from {reviews?.length || 0} reviews</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2">Recent Exchange Highlights</h3>
                        <ul className="space-y-2">
                          {completedExchanges.slice(0, 3).map((exchange, i) => (
                            <li key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                              <div className="bg-primary/10 rounded-full p-2">
                                <Share2 className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{exchange.title || 'Skill Exchange'}</p>
                                <p className="text-sm text-gray-500">
                                  {exchange.duration ? (exchange.duration / 60).toFixed(1) + ' hours' : 'N/A'}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {exchange.providerId === user.id ? 'Teaching' : 'Learning'}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sustainability">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Sustainability Impact</CardTitle>
                    <CardDescription>Environmental benefits of your skill exchanges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <Leaf className="h-5 w-5 text-green-600 mb-2" />
                          <div className="text-2xl font-bold">{co2Saved.toFixed(1)} kg</div>
                          <div className="text-sm text-gray-500">CO₂ emissions saved</div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-2xl font-bold">{(totalHours * 15).toFixed(0)}</div>
                          <div className="text-sm text-gray-500">liters of water saved</div>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-4">
                          <div className="text-2xl font-bold">{Math.floor(completedExchanges.length * 3)}</div>
                          <div className="text-sm text-gray-500">items kept from landfill</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-green-800 mb-2">Your Sustainability Stats</h3>
                        <p className="text-green-700 mb-4">By exchanging skills instead of buying products or paid services, you've made a real environmental impact.</p>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-green-800">Carbon Footprint Reduction</span>
                              <span className="text-green-800">{(co2Saved / 250 * 100).toFixed(0)}% of monthly average</span>
                            </div>
                            <Progress value={(co2Saved / 250 * 100)} 
                              className="h-2 bg-green-200" indicatorClassName="bg-green-600" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-green-800">Resource Conservation</span>
                              <span className="text-green-800">
                                {(totalHours / 20 * 100).toFixed(0)}% of target
                              </span>
                            </div>
                            <Progress value={(totalHours / 20 * 100)} 
                              className="h-2 bg-green-200" indicatorClassName="bg-green-600" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Button className="bg-green-600 hover:bg-green-700">
                          View Detailed Sustainability Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="community">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Contribution</CardTitle>
                    <CardDescription>Your impact on the ExchangeSphere community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <Users className="h-5 w-5 text-indigo-600 mb-2" />
                          <div className="text-2xl font-bold">{completedExchanges.length * 2}</div>
                          <div className="text-sm text-gray-500">lives impacted</div>
                        </div>
                        
                        <div className="bg-pink-50 rounded-lg p-4">
                          <div className="text-2xl font-bold">{uniqueSkills.size}</div>
                          <div className="text-sm text-gray-500">skills shared</div>
                        </div>
                        
                        <div className="bg-cyan-50 rounded-lg p-4">
                          <div className="text-2xl font-bold">
                            {completedExchanges.length > 0 ? 
                              ((completedExchanges.filter(e => e.providerId === user.id).length / 
                              completedExchanges.length) * 100).toFixed(0) : 0}%
                          </div>
                          <div className="text-sm text-gray-500">teaching ratio</div>
                        </div>
                        
                        <div className="bg-violet-50 rounded-lg p-4">
                          <div className="text-2xl font-bold">8</div>
                          <div className="text-sm text-gray-500">community posts</div>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-indigo-800 mb-2">Community Rankings</h3>
                        <p className="text-indigo-700 mb-4">See how you compare to other members in the community.</p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-indigo-200 text-indigo-800 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                45
                              </div>
                              <span className="font-medium">Overall Rank</span>
                            </div>
                            <span className="text-indigo-700">Top 15%</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-green-200 text-green-800 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                12
                              </div>
                              <span className="font-medium">Sustainability Impact</span>
                            </div>
                            <span className="text-green-700">Top 5%</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-amber-200 text-amber-800 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                67
                              </div>
                              <span className="font-medium">Teaching Quality</span>
                            </div>
                            <span className="text-amber-700">Top 25%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">Ready to grow your impact?</h3>
                    <p className="opacity-90">Share more skills, complete more exchanges, and climb the rankings.</p>
                  </div>
                  <div className="flex space-x-3">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100">Find Matches</Button>
                    <Button variant="outline" className="border-white text-white hover:bg-blue-400">
                      Share Skills
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      
      <MobileNav />
    </div>
  );
}