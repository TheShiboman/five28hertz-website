import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import TournamentPage from "@/pages/tournament-page";
import LiveScoring from "@/pages/live-scoring";
import DashboardPage from "@/pages/dashboard-page";
import ProfilePage from "@/pages/profile-page";
import TrainingPage from "@/pages/training-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import CommunityPage from "@/pages/community-page";
import AcademyPage from "@/pages/academy-page";
import StorePage from "@/pages/store-page";
import LiveStreamingPage from "@/pages/live-streaming-page";
import { ProtectedRoute } from "./lib/protected-route";
import HelpWidget from "@/components/layout/help-widget";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/tournaments" component={TournamentPage} />
      <ProtectedRoute path="/tournaments/:id/live-scoring" component={LiveScoring} />
      <ProtectedRoute path="/training" component={TrainingPage} />
      <ProtectedRoute path="/leaderboards" component={LeaderboardPage} />
      <ProtectedRoute path="/community" component={CommunityPage} />
      <ProtectedRoute path="/academy" component={AcademyPage} />
      <ProtectedRoute path="/store" component={StorePage} />
      <ProtectedRoute path="/live-streaming" component={LiveStreamingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="container mx-auto py-4 px-4">
            <Router />
          </main>
          <Toaster />
          <HelpWidget />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}