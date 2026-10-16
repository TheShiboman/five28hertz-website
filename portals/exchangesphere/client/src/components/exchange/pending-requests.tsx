import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Exchange, User } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserAvatar } from '@/components/user-avatar';
import { Calendar, Clock, CheckCircle2, XCircle, CalendarClock } from 'lucide-react';
import { ExchangeRequestModal } from './exchange-request-modal';

interface PendingRequestsProps {
  userId: number;
}

export function PendingRequests({ userId }: PendingRequestsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('incoming');
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState<boolean>(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState<boolean>(false);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  
  // Fetch all exchanges for the current user
  const { data: exchanges, isLoading } = useQuery<Exchange[]>({
    queryKey: ['/api/exchanges'],
    enabled: !!userId,
  });
  
  // Fetch all users for mapping to exchanges
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: !!userId,
  });
  
  // Filter exchanges for incoming and outgoing requests
  const incomingRequests = exchanges?.filter(
    exchange => exchange.providerId === userId && exchange.status === 'requested'
  ) || [];
  
  const outgoingRequests = exchanges?.filter(
    exchange => exchange.requestorId === userId && exchange.status === 'requested'
  ) || [];
  
  // Accept exchange request mutation
  const acceptMutation = useMutation({
    mutationFn: async (exchangeId: number) => {
      const res = await apiRequest('PATCH', `/api/exchanges/${exchangeId}`, {
        status: 'accepted',
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Request Accepted',
        description: 'You have accepted the exchange request.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exchanges'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to accept request',
        variant: 'destructive',
      });
    },
  });
  
  // Decline exchange request mutation
  const declineMutation = useMutation({
    mutationFn: async (exchangeId: number) => {
      const res = await apiRequest('PATCH', `/api/exchanges/${exchangeId}`, {
        status: 'declined',
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Request Declined',
        description: 'You have declined the exchange request.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exchanges'] });
      setDeclineDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to decline request',
        variant: 'destructive',
      });
    },
  });
  
  // Cancel exchange request mutation
  const cancelMutation = useMutation({
    mutationFn: async (exchangeId: number) => {
      const res = await apiRequest('PATCH', `/api/exchanges/${exchangeId}`, {
        status: 'cancelled',
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Request Cancelled',
        description: 'You have cancelled your exchange request.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exchanges'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel request',
        variant: 'destructive',
      });
    },
  });
  
  // Helper function to find user by ID
  const getUserById = (id: number): User | undefined => {
    return users?.find(user => user.id === id);
  };
  
  // Handle declining a request
  const handleDeclineRequest = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setDeclineDialogOpen(true);
  };
  
  // Handle rescheduling a request
  const handleRescheduleRequest = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    
    // Find the provider of the exchange (the other user)
    const providerId = exchange.requestorId === userId 
      ? exchange.providerId 
      : exchange.requestorId;
    
    const provider = getUserById(providerId);
    if (provider) {
      setSelectedProvider(provider);
      setRescheduleModalOpen(true);
    } else {
      toast({
        title: 'Error',
        description: 'Could not find the exchange partner',
        variant: 'destructive',
      });
    }
  };
  
  // Format date for display
  const formatExchangeDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Not scheduled';
    return format(new Date(date), 'MMM d, yyyy - h:mm a');
  };
  
  // Format duration for display
  const formatDuration = (minutes: number | null | undefined): string => {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} min`;
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="incoming" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="incoming">
            Incoming Requests {incomingRequests.length > 0 && `(${incomingRequests.length})`}
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing Requests {outgoingRequests.length > 0 && `(${outgoingRequests.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="incoming">
          <Card>
            <CardHeader>
              <CardTitle>Incoming Exchange Requests</CardTitle>
              <CardDescription>
                These are the requests you have received from other users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || loadingUsers ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading requests...
                </div>
              ) : incomingRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any incoming requests at the moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((request) => {
                    const requestor = getUserById(request.requestorId);
                    
                    return (
                      <div 
                        key={request.id}
                        className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4 justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <UserAvatar
                            src={requestor?.avatarUrl || undefined}
                            name={requestor?.fullName || 'User'}
                            size="md"
                          />
                          <div>
                            <h3 className="font-medium text-base">
                              {request.title}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <span className="font-medium text-foreground">
                                From:
                              </span>&nbsp;
                              {requestor?.fullName || 'Unknown User'}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {formatExchangeDate(request.scheduledDate)}
                              {request.duration && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {formatDuration(request.duration)}
                                </>
                              )}
                            </div>
                            {request.description && (
                              <p className="text-sm mt-2 line-clamp-2">
                                {request.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:min-w-[140px]">
                          <Button 
                            size="sm" 
                            className="w-full sm:w-auto"
                            onClick={() => acceptMutation.mutate(request.id)}
                            disabled={acceptMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => handleRescheduleRequest(request)}
                          >
                            <CalendarClock className="h-4 w-4 mr-1" />
                            Reschedule
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full sm:w-auto"
                            onClick={() => handleDeclineRequest(request)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outgoing">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Exchange Requests</CardTitle>
              <CardDescription>
                These are the requests you have sent to other users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || loadingUsers ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading requests...
                </div>
              ) : outgoingRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't sent any exchange requests yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((request) => {
                    const provider = getUserById(request.providerId);
                    
                    return (
                      <div 
                        key={request.id}
                        className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4 justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <UserAvatar
                            src={provider?.avatarUrl || undefined}
                            name={provider?.fullName || 'User'}
                            size="md"
                          />
                          <div>
                            <h3 className="font-medium text-base">
                              {request.title}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <span className="font-medium text-foreground">
                                To:
                              </span>&nbsp;
                              {provider?.fullName || 'Unknown User'}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {formatExchangeDate(request.scheduledDate)}
                              {request.duration && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {formatDuration(request.duration)}
                                </>
                              )}
                            </div>
                            <div className="flex items-center text-sm mt-1">
                              <span className="font-medium">Status:</span>&nbsp;
                              <span className="text-amber-600">Pending</span>
                            </div>
                            {request.description && (
                              <p className="text-sm mt-2 line-clamp-2">
                                {request.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end items-center min-w-[100px]">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-destructive"
                            onClick={() => cancelMutation.mutate(request.id)}
                            disabled={cancelMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel Request
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Decline Confirmation Dialog */}
      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Exchange Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this exchange request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeclineDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedExchange && declineMutation.mutate(selectedExchange.id)}
              disabled={declineMutation.isPending}
            >
              {declineMutation.isPending ? 'Declining...' : 'Decline Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Modal */}
      {selectedProvider && (
        <ExchangeRequestModal
          open={rescheduleModalOpen}
          onOpenChange={setRescheduleModalOpen}
          provider={selectedProvider}
          currentUserId={userId}
        />
      )}
    </div>
  );
}