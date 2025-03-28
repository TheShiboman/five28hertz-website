import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { NotificationsProvider } from "./hooks/use-notifications";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useIsFetching } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import ProfilePage from "@/pages/profile-page";
import CommunityPage from "@/pages/community-page";
import MessagesPage from "@/pages/messages-page";
import ImpactDashboardPage from "@/pages/impact-dashboard-page";
import ExplorePage from "@/pages/explore-page";
import AdminPage from "@/pages/admin-page";
import BookingsPage from "@/pages/bookings-page";
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "@/components/theme-provider";
import { SplashScreen } from "@/components/splash-screen";

function Router() {
  const { isLoading: isAuthLoading } = useAuth();
  const isFetching = useIsFetching();
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    // If no auth loading and no queries are fetching, hide splash after a short delay
    if (!isAuthLoading && isFetching === 0) {
      const timer = setTimeout(() => setShowSplash(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoading, isFetching]);

  if (showSplash) {
    return <SplashScreen message="Preparing your experience..." />;
  }

  return (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/community" component={CommunityPage} />
      <ProtectedRoute path="/messages" component={MessagesPage} />
      <ProtectedRoute path="/impact" component={ImpactDashboardPage} />
      <ProtectedRoute path="/explore" component={ExplorePage} />
      <ProtectedRoute path="/bookings" component={BookingsPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function AppContent() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <Router />
        <Toaster />
      </NotificationsProvider>
    </AuthProvider>
  );
}

function App() {
  // Initial splash screen to show while the app is booting up
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  if (initialLoading) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="exchangesphere-theme">
        <SplashScreen message="Welcome to ExchangeSphere" />
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="exchangesphere-theme">
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
