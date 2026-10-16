import { useQuery } from "@tanstack/react-query";
import { Referral, User } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Award, Users } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface ReferralWithUserInfo extends Referral {
  referredUser: {
    id: number;
    fullName: string;
    avatarUrl?: string | null;
  } | null;
}

interface ReferralStats {
  referrals: ReferralWithUserInfo[];
  stats: {
    totalCount: number;
    successfulCount: number;
  };
}

interface ReferralStatsProps {
  userId: number;
}

export function ReferralStatsSection({ userId }: ReferralStatsProps) {
  const { data, isLoading, error } = useQuery<ReferralStats>({
    queryKey: ['/api/referral/my-referrals'],
    enabled: !!userId,
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>Loading your referral statistics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>Failed to load referral data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            There was an error loading your referral statistics. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { referrals, stats } = data;
  const completionRate = stats.totalCount > 0 
    ? Math.round((stats.successfulCount / stats.totalCount) * 100) 
    : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Referrals
        </CardTitle>
        <CardDescription>
          Track your referral performance and rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Total Referrals</span>
              <span className="text-2xl font-bold">{stats.totalCount}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Successful</span>
              <span className="text-2xl font-bold">{stats.successfulCount}</span>
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </div>
          
          {/* Recent Referrals */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Recent Referrals</h4>
            
            {referrals.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                <p>You haven't referred anyone yet.</p>
                <p className="mt-1">Share your referral code to start earning rewards!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {referrals.slice(0, 5).map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between py-2 gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {referral.referredUser?.avatarUrl ? (
                          <AvatarImage src={referral.referredUser.avatarUrl} alt={referral.referredUser.fullName} />
                        ) : null}
                        <AvatarFallback>{getInitials(referral.referredUser?.fullName || "Unknown User")}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium line-clamp-1">{referral.referredUser?.fullName || "Unknown User"}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(new Date(referral.createdAt))}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {referral.status === 'completed' && (
                        <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                          <Award className="h-3 w-3" />
                          <span className="text-xs">Completed</span>
                        </Badge>
                      )}
                      {referral.status === 'pending' && (
                        <Badge variant="outline" className="px-2 py-1 text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}