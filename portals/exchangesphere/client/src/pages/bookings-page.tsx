import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { useAuth } from '@/hooks/use-auth';
import { PendingRequests } from '@/components/exchange/pending-requests';
import { ConfirmedBookings } from '@/components/exchange/confirmed-bookings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { Exchange } from '@shared/schema';

export default function BookingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('confirmed');
  
  // Fetch all exchanges for the current user to badge tabs with counts
  const { data: exchanges } = useQuery<Exchange[]>({
    queryKey: ['/api/exchanges'],
    enabled: !!user?.id,
  });
  
  // Count pending requests (both incoming and outgoing)
  const pendingRequestsCount = exchanges?.filter(
    exchange => 
      ((exchange.providerId === user?.id && exchange.status === 'requested') ||
       (exchange.requestorId === user?.id && exchange.status === 'requested'))
  ).length || 0;
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileNav />
      
      <main className="max-w-6xl mx-auto pb-10 pt-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Exchange Bookings</h1>
        
        <Tabs defaultValue="confirmed" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="confirmed">
              Confirmed Bookings
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Requests {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="confirmed">
            <ConfirmedBookings userId={user.id} />
          </TabsContent>
          
          <TabsContent value="pending">
            <PendingRequests userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}