import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Check, Download, Calendar, Award, UserPlus, Star, ListTodo } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF'];

export function ImpactAnalytics() {
  const { toast } = useToast();
  const [exchangePeriod, setExchangePeriod] = useState<'weekly' | 'monthly'>('monthly');
  
  // Exchange analytics query
  const { 
    data: exchangeData, 
    isLoading: exchangeLoading, 
    error: exchangeError 
  } = useQuery({
    queryKey: ['/api/admin/analytics/exchanges', exchangePeriod],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/exchanges?period=${exchangePeriod}`);
      if (!res.ok) throw new Error('Failed to fetch exchange analytics');
      return await res.json();
    }
  });
  
  // Badge analytics query
  const { 
    data: badgeData, 
    isLoading: badgeLoading, 
    error: badgeError 
  } = useQuery({
    queryKey: ['/api/admin/analytics/badges'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics/badges');
      if (!res.ok) throw new Error('Failed to fetch badge analytics');
      return await res.json();
    }
  });
  
  // Referral analytics query
  const { 
    data: referralData, 
    isLoading: referralLoading, 
    error: referralError 
  } = useQuery({
    queryKey: ['/api/admin/analytics/referrals'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics/referrals');
      if (!res.ok) throw new Error('Failed to fetch referral analytics');
      return await res.json();
    }
  });
  
  // Review analytics query
  const { 
    data: reviewData, 
    isLoading: reviewLoading, 
    error: reviewError 
  } = useQuery({
    queryKey: ['/api/admin/analytics/reviews'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics/reviews');
      if (!res.ok) throw new Error('Failed to fetch review analytics');
      return await res.json();
    }
  });
  
  // Bucket List analytics query
  const { 
    data: bucketListData, 
    isLoading: bucketListLoading, 
    error: bucketListError 
  } = useQuery({
    queryKey: ['/api/admin/analytics/bucket-list'],
    queryFn: async () => {
      const res = await fetch('/api/admin/analytics/bucket-list');
      if (!res.ok) throw new Error('Failed to fetch bucket list analytics');
      return await res.json();
    }
  });
  
  const handleExportCSV = (type: string) => {
    window.open(`/api/admin/analytics/export/${type}`, '_blank');
    toast({
      title: 'Export started',
      description: `The ${type} data is being downloaded.`,
    });
  };
  
  const isLoading = exchangeLoading || badgeLoading || referralLoading || reviewLoading || bucketListLoading;
  const hasError = exchangeError || badgeError || referralError || reviewError || bucketListError;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Impact Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track and visualize the platform's impact metrics</p>
        </div>
      </div>
      
      {hasError && (
        <div className="rounded-md bg-destructive/15 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Error loading analytics</h3>
              <div className="mt-2 text-sm text-destructive/80">
                <p>There was an error loading the analytics data. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Exchange Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Calendar className="h-5 w-5 text-primary" />
              Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exchangeLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{exchangeData?.totalExchanges || 0}</div>
                <div className="text-sm text-muted-foreground">
                  {exchangeData?.completedExchanges || 0} completed ({exchangeData ? 
                    Math.round((exchangeData.completedExchanges / exchangeData.totalExchanges) * 100) : 0}%)
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Badge Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Award className="h-5 w-5 text-primary" />
              Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badgeLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{badgeData?.totalBadges || 0}</div>
                <div className="text-sm text-muted-foreground">
                  Achievement badges awarded
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Bucket List Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <ListTodo className="h-5 w-5 text-primary" />
              Dreams
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bucketListLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{bucketListData?.totalItems || 0}</div>
                <div className="text-sm text-muted-foreground">
                  {bucketListData?.achievedItems || 0} achieved ({bucketListData ? 
                    Math.round((bucketListData.achievedItems / bucketListData.totalItems) * 100) : 0}%)
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Referrals Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <UserPlus className="h-5 w-5 text-primary" />
              Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referralLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{referralData?.totalReferrals || 0}</div>
                <div className="text-sm text-muted-foreground">
                  {referralData?.successfulReferrals || 0} successful ({referralData?.conversionRate.toFixed(1) || 0}%)
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Review Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Star className="h-5 w-5 text-primary" />
              Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviewLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">{reviewData?.totalReviews || 0}</div>
                <div className="text-sm text-muted-foreground">
                  Avg. {reviewData?.averageRating.toFixed(1) || 0}/5 rating
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="exchanges" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="bucket-list">Bucket List</TabsTrigger>
        </TabsList>
        
        {/* Exchanges Tab */}
        <TabsContent value="exchanges" className="space-y-4">
          <div className="flex justify-between">
            <Select value={exchangePeriod} onValueChange={(value) => setExchangePeriod(value as 'weekly' | 'monthly')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportCSV('exchanges')}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Exchange Trends</CardTitle>
                <CardDescription>Number of exchanges over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {exchangeLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : exchangeData?.exchangesByDate && exchangeData.exchangesByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exchangeData.exchangesByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Exchanges" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No exchange data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Exchange Users</CardTitle>
                <CardDescription>Users with the most exchanges</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {exchangeLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : exchangeData?.exchangesByUser && exchangeData.exchangesByUser.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={exchangeData.exchangesByUser.slice(0, 5)} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="fullName" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Exchanges" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No user exchange data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportCSV('badges')}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Badge Distribution</CardTitle>
                <CardDescription>Number of badges by type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {badgeLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : badgeData?.badgesByType && badgeData.badgesByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={badgeData.badgesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }: { name: string; percent: number }) => 
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="type"
                      >
                        {badgeData.badgesByType.map((entry: { type: string, count: number }, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No badge data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Badge Trends</CardTitle>
                <CardDescription>Badge approvals over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {badgeLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : badgeData?.badgesTrend && badgeData.badgesTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={badgeData.badgesTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Badges" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No badge trend data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportCSV('referrals')}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Referral Trends</CardTitle>
                <CardDescription>Number of referrals over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {referralLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : referralData?.referralsByDate && referralData.referralsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={referralData.referralsByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Referrals" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No referral data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
                <CardDescription>Users with the most successful referrals</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {referralLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : referralData?.topReferrers && referralData.topReferrers.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={referralData.topReferrers.slice(0, 5)} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="fullName" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Referrals" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No top referrer data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportCSV('reviews')}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Number of reviews by rating</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {reviewLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : reviewData?.ratingDistribution && reviewData.ratingDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reviewData.ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Reviews" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No rating data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Review Trends</CardTitle>
                <CardDescription>Number of reviews over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {reviewLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : reviewData?.reviewsByDate && reviewData.reviewsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reviewData.reviewsByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Reviews" stroke="#ff7300" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No review trend data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Bucket List Tab */}
        <TabsContent value="bucket-list" className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportCSV('bucket-list')}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bucket List Item Status</CardTitle>
                <CardDescription>Distribution of items by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {bucketListLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : bucketListData?.itemsByStatus && bucketListData.itemsByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bucketListData.itemsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }: { name: string; percent: number }) => 
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                      >
                        {bucketListData.itemsByStatus.map((entry: { status: string, count: number }, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No bucket list status data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dreams Achieved by Month</CardTitle>
                <CardDescription>Number of achieved bucket list items over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {bucketListLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : bucketListData?.achievedByMonth && bucketListData.achievedByMonth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bucketListData.achievedByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Achieved Dreams" stroke="#27ae60" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No achievement data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Active Dream Chasers</CardTitle>
                <CardDescription>Users with the most bucket list items</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {bucketListLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : bucketListData?.itemsByUser && bucketListData.itemsByUser.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={bucketListData.itemsByUser.slice(0, 5)} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="fullName" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Bucket List Items" fill="#48c9b0" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No user bucket list data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Dreams with Exchanges</CardTitle>
                <CardDescription>Statistics on dreams linked to exchanges</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {bucketListLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : bucketListData ? (
                  <div className="h-full flex flex-col justify-center space-y-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{bucketListData.linkedToExchanges}</div>
                      <div className="text-sm text-muted-foreground mt-1">Dreams linked to exchanges</div>
                      <div className="mt-2 text-sm">
                        {bucketListData.totalItems > 0 ? 
                          `${Math.round((bucketListData.linkedToExchanges / bucketListData.totalItems) * 100)}% of all dreams` : '0% of all dreams'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{bucketListData.dreamFulfilledBadges}</div>
                      <div className="text-sm text-muted-foreground mt-1">"Dream Fulfilled" badges awarded</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No exchange-linked dream data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}