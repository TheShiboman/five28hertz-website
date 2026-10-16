import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { Exchange } from '@shared/schema';
import { format, addDays, isPast } from 'date-fns';
import { Eye, CheckCircle, Clock } from 'lucide-react';
import { ExchangeCompletion } from '@/components/exchange/exchange-completion';

// Custom MessageCircle component to avoid import issues
function MessageCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
import { Link } from 'wouter';

interface UpcomingExchangesProps {
  userId: number;
}

export function UpcomingExchanges({ userId }: UpcomingExchangesProps) {
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  
  const { data: exchanges, isLoading } = useQuery<Exchange[]>({
    queryKey: ['/api/exchanges'],
    enabled: !!userId,
  });
  
  // Filter for upcoming exchanges (accepted but not completed)
  const upcomingExchanges = React.useMemo(() => {
    if (!exchanges) return [];
    
    return exchanges
      .filter(exchange => exchange.status === 'accepted')
      .sort((a, b) => {
        if (!a.scheduledDate || !b.scheduledDate) return 0;
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      })
      .slice(0, 2); // Only show the first 2
  }, [exchanges]);
  
  // For MVP, we'll use dummy data for some of the user info that would
  // normally come from additional API calls
  const dummyUsers = [
    {
      id: 2,
      fullName: 'Tom Wilson',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 3,
      fullName: 'Sarah Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];
  
  // If no actual exchanges yet, show sample ones for UI
  const displayExchanges = upcomingExchanges.length > 0 ? upcomingExchanges : [
    {
      id: 1,
      requestorId: userId,
      providerId: 2,
      title: 'Photography Workshop',
      description: 'Learning portrait photography techniques',
      status: 'accepted',
      scheduledDate: addDays(new Date(), 1),
      duration: 120, // 2 hours
      createdAt: new Date(),
      requestorConfirmed: false,
      providerConfirmed: false
    },
    {
      id: 2,
      requestorId: userId,
      providerId: 3,
      title: 'Spanish Conversation',
      description: 'Practice conversational Spanish',
      status: 'accepted',
      scheduledDate: addDays(new Date(), 3),
      duration: 60, // 1 hour
      createdAt: new Date(),
      requestorConfirmed: false,
      providerConfirmed: false
    }
  ];
  
  const getPartnerInfo = (exchange: Exchange) => {
    const partnerId = exchange.requestorId === userId ? exchange.providerId : exchange.requestorId;
    return dummyUsers.find(user => user.id === partnerId) || {
      id: partnerId, 
      fullName: `User ${partnerId}`,
      avatarUrl: undefined
    };
  };
  
  const formatExchangeTime = (exchange: Exchange) => {
    if (!exchange.scheduledDate) return 'Not scheduled';
    
    const date = new Date(exchange.scheduledDate);
    const isToday = new Date().toDateString() === date.toDateString();
    const isTomorrow = addDays(new Date(), 1).toDateString() === date.toDateString();
    
    const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : format(date, 'EEEE');
    const timeLabel = format(date, 'h:mm a');
    const durationHours = exchange.duration ? Math.floor(exchange.duration / 60) : 0;
    const durationMinutes = exchange.duration ? exchange.duration % 60 : 0;
    const durationLabel = durationHours > 0 
      ? `${durationHours} hour${durationHours > 1 ? 's' : ''}${durationMinutes > 0 ? ` ${durationMinutes} min` : ''}`
      : `${durationMinutes} minutes`;
    
    return `${dayLabel}, ${timeLabel} • ${durationLabel}`;
  };
  
  // Check if exchange can be marked as completed (date is in the past)
  const canMarkCompleted = (exchange: Exchange) => {
    return exchange.scheduledDate && isPast(new Date(exchange.scheduledDate));
  };
  
  // Handle opening the completion dialog
  const handleMarkCompleted = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setCompletionDialogOpen(true);
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <CardContent className="p-0">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Upcoming Exchanges</h2>
        
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading your exchanges...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {displayExchanges.map((exchange) => {
              const partner = getPartnerInfo(exchange);
              const canComplete = canMarkCompleted(exchange);
              
              return (
                <div key={exchange.id} className="py-4 flex justify-between items-start">
                  <div className="flex items-center">
                    <UserAvatar
                      src={partner.avatarUrl}
                      name={partner.fullName}
                      size="md"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{exchange.title} with {partner.fullName}</p>
                      <p className="text-xs text-gray-500">{formatExchangeTime(exchange)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 items-end">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                    {canComplete && (
                      <Button 
                        size="sm" 
                        className="text-xs px-2 py-1 h-auto bg-primary text-white hover:bg-primary/90"
                        onClick={() => handleMarkCompleted(exchange)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                    {!canComplete && exchange.scheduledDate && (
                      <div className="flex items-center text-xs text-amber-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Not yet time
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <Link href="/exchanges">
          <a className="w-full">
            <Button variant="outline" className="mt-4 w-full">
              View All Exchanges
            </Button>
          </a>
        </Link>
      </CardContent>
      
      {/* Exchange Completion Dialog */}
      {selectedExchange && (
        <ExchangeCompletion 
          exchange={selectedExchange}
          userId={userId}
          open={completionDialogOpen}
          onOpenChange={setCompletionDialogOpen}
        />
      )}
    </Card>
  );
}
