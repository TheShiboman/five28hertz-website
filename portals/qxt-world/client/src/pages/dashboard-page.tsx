import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Calendar, Bell, Activity, Timer, MessageSquare, ShoppingBag } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* User Profile Overview */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.fullName}</h1>
        <p className="text-muted-foreground">Your personal QXT World dashboard</p>
      </div>

      {/* My Statistics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">My Statistics</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Win Rate</p>
                <p className="text-3xl font-bold">76%</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Tournaments Won</p>
                <p className="text-3xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">This season</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Timer className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Average Break</p>
                <p className="text-3xl font-bold">45</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">Matches Played</p>
                <p className="text-3xl font-bold">28</p>
                <p className="text-xs text-muted-foreground">This season</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Recent Tournaments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">QXT Spring Championship</p>
                  <p className="text-sm text-muted-foreground">Quarter-finalist</p>
                </div>
                <span className="text-sm text-muted-foreground">2 days ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Club Masters Series</p>
                  <p className="text-sm text-muted-foreground">Winner</p>
                </div>
                <span className="text-sm text-muted-foreground">1 week ago</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 py-2 border-b">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">New Discussion Reply</p>
                  <p className="text-sm text-muted-foreground">Your post received a response</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-2 border-b">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Order Shipped</p>
                  <p className="text-sm text-muted-foreground">Your equipment order is on its way</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Summary, Current Rankings, and Training Progress sections are reorganized */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Current Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Global Rank</p>
                <p className="text-2xl font-bold">#156</p>
              </div>
              <div>
                <p className="text-sm font-medium">National Rank</p>
                <p className="text-2xl font-bold">#12</p>
              </div>
              <div>
                <p className="text-sm font-medium">Club Rank</p>
                <p className="text-2xl font-bold">#3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Training Sessions</p>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
              <div>
                <p className="text-sm font-medium">Drills Completed</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Out of 50 assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No new notifications</p>
        </CardContent>
      </Card>


    </div>
  );
}