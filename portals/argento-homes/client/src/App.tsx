import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import AddProperty from "@/pages/add-property";
import PropertyDetails from "@/pages/property-details";
import PropertyCertification from "@/pages/property-certification";
import Marketplace from "@/pages/marketplace";
import VendorProfile from "@/pages/vendor-profile";
import VendorRegistration from "@/pages/vendor-registration";
import Messages from "@/pages/messages";
import Bookings from "@/pages/bookings";
import AdminPanel from "@/pages/admin-panel";
import GuestPortal from "@/pages/guest-portal";
import Tasks from "@/pages/tasks";
import Sustainability from "@/pages/sustainability";
import SmartHome from "@/pages/smart-home";
import PaymentTest from "@/pages/payment-test";
import { ProtectedRoute } from "./lib/protected-route";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { WebSocketProvider } from "./hooks/use-websocket";

// Public routes with auth provider just for the auth page
function PublicRoutes() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/guest-portal" component={GuestPortal} />
        <Route path="/guest" component={GuestPortal} />
        <Route path="/property/:id" component={PropertyDetails} />
        <Route path="/payment-public" component={PaymentTest} />
        <Route component={NotFound} />
      </Switch>
    </AuthProvider>
  );
}

// Protected routes that require authentication
function AuthenticatedRoutes() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/properties/add" component={AddProperty} />
      <ProtectedRoute path="/property-certification" component={PropertyCertification} />
      <ProtectedRoute path="/properties/:id" component={PropertyDetails} />
      <ProtectedRoute path="/properties" component={Properties} />
      <ProtectedRoute path="/bookings" component={Bookings} />
      <ProtectedRoute path="/marketplace" component={Marketplace} />
      <ProtectedRoute path="/vendor-profile" component={VendorProfile} />
      <ProtectedRoute path="/vendor-registration" component={VendorRegistration} />
      <ProtectedRoute path="/messages" component={Messages} />
      <ProtectedRoute path="/tasks" component={Tasks} />
      <ProtectedRoute path="/sustainability" component={Sustainability} />
      <ProtectedRoute path="/smart-home" component={SmartHome} />
      <ProtectedRoute path="/admin" component={AdminPanel} />
      <ProtectedRoute path="/payment-test" component={PaymentTest} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string) 
  : null;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Elements stripe={stripePromise}>
          <Switch>
            <Route path="/auth">
              <PublicRoutes />
            </Route>
            <Route path="/guest-portal">
              <PublicRoutes />
            </Route>
            <Route path="/guest">
              <PublicRoutes />
            </Route>
            <Route path="/property/:id">
              <PublicRoutes />
            </Route>
            <Route path="/payment-public">
              <PublicRoutes />
            </Route>
            <Route>
              <AuthProvider>
                <WebSocketProvider>
                  <AuthenticatedRoutes />
                </WebSocketProvider>
              </AuthProvider>
            </Route>
          </Switch>
        </Elements>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
