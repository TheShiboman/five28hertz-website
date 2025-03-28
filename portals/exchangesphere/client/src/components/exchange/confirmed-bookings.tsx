import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isPast, isFuture } from 'date-fns';
import { Exchange, User } from '@shared/schema';
import { cn } from '@/lib/utils';

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
import { UserAvatar } from '@/components/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, Calendar as CalendarIcon, MessageSquare, Eye } from 'lucide-react';
import { ExchangeCompletion } from './exchange-completion';

interface ConfirmedBookingsProps {
  userId: number;
}

export function ConfirmedBookings({ userId }: ConfirmedBookingsProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  
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
  
  // Filter exchanges for upcoming (confirmed) and completed bookings
  const upcomingExchanges = exchanges?.filter(
    exchange => (exchange.requestorId === userId || exchange.providerId === userId) && 
               exchange.status === 'accepted' &&
               exchange.scheduledDate && 
               isFuture(new Date(exchange.scheduledDate))
  ) || [];
  
  const completedExchanges = exchanges?.filter(
    exchange => (exchange.requestorId === userId || exchange.providerId === userId) && 
               (exchange.status === 'completed' || 
                (exchange.status === 'accepted' && 
                 exchange.scheduledDate && 
                 isPast(new Date(exchange.scheduledDate))))
  ) || [];
  
  // Helper function to find user by ID
  const getUserById = (id: number): User | undefined => {
    return users?.find(user => user.id === id);
  };
  
  // Handle marking an exchange as complete
  const handleMarkComplete = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setCompletionDialogOpen(true);
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
  
  // Get status badge styling based on exchange status
  const getStatusBadge = (exchange: Exchange) => {
    let status = exchange.status;
    let color = '';
    
    // If accepted but in the past, treat as needs completion
    if (status === 'accepted' && exchange.scheduledDate && isPast(new Date(exchange.scheduledDate))) {
      status = 'needs completion';
      color = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-400';
    } else if (status === 'accepted') {
      status = 'confirmed';
      color = 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400';
    } else if (status === 'completed') {
      color = 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400';
    } else {
      color = 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300';
    }
    
    return (
      <Badge className={cn("font-normal capitalize", color)}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };
  
  // Get the other participant in the exchange
  const getExchangePartner = (exchange: Exchange): User | undefined => {
    const partnerId = exchange.requestorId === userId ? exchange.providerId : exchange.requestorId;
    return getUserById(partnerId);
  };
  
  // Render the list view of exchanges
  const renderExchangeListItem = (exchange: Exchange, isCompleted: boolean = false) => {
    const partner = getExchangePartner(exchange);
    const canComplete = !isCompleted && 
                       exchange.status === 'accepted' && 
                       exchange.scheduledDate && 
                       isPast(new Date(exchange.scheduledDate));
    
    return (
      <div 
        key={exchange.id}
        className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4 justify-between"
      >
        <div className="flex items-start gap-4">
          <UserAvatar
            src={partner?.avatarUrl || undefined}
            name={partner?.fullName || 'User'}
            size="md"
          />
          <div>
            <h3 className="font-medium text-base">
              {exchange.title}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span className="font-medium text-foreground">
                With:
              </span>&nbsp;
              {partner?.fullName || 'Unknown User'}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formatExchangeDate(exchange.scheduledDate)}
              {exchange.duration && (
                <>
                  <span className="mx-1">•</span>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {formatDuration(exchange.duration)}
                </>
              )}
            </div>
            <div className="flex items-center mt-2">
              {getStatusBadge(exchange)}
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:min-w-[140px]">
          {canComplete && (
            <Button 
              size="sm" 
              onClick={() => handleMarkComplete(exchange)}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Simple calendar view (for demonstration)
  const renderCalendarView = (exchanges: Exchange[]) => {
    // Group exchanges by date
    const groupedExchanges: Record<string, Exchange[]> = {};
    
    exchanges.forEach(exchange => {
      if (exchange.scheduledDate) {
        const dateKey = format(new Date(exchange.scheduledDate), 'yyyy-MM-dd');
        if (!groupedExchanges[dateKey]) {
          groupedExchanges[dateKey] = [];
        }
        groupedExchanges[dateKey].push(exchange);
      }
    });
    
    // Get all dates within the next 30 days
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = format(date, 'yyyy-MM-dd');
      dates.push({
        date,
        dateKey,
        exchanges: groupedExchanges[dateKey] || [],
      });
    }
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {dates.map((dateInfo) => (
          <div key={dateInfo.dateKey} className="border rounded-lg p-2 h-32 overflow-y-auto">
            <div className="text-sm font-medium">
              {format(dateInfo.date, 'EEE')}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {format(dateInfo.date, 'MMM d')}
            </div>
            <div className="space-y-1">
              {dateInfo.exchanges.map((exchange) => {
                const partner = getExchangePartner(exchange);
                return (
                  <div 
                    key={exchange.id} 
                    className="text-xs p-1 rounded bg-primary/10 cursor-pointer"
                    onClick={() => handleMarkComplete(exchange)}
                  >
                    <div className="font-medium truncate">{exchange.title}</div>
                    <div className="text-muted-foreground truncate">
                      {format(new Date(exchange.scheduledDate!), 'h:mm a')} · {partner?.fullName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Bookings</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('calendar')}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Calendar
          </Button>
        </div>
      </div>
      
      {view === 'list' ? (
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming {upcomingExchanges.length > 0 && `(${upcomingExchanges.length})`}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed {completedExchanges.length > 0 && `(${completedExchanges.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exchanges</CardTitle>
                <CardDescription>
                  These are your confirmed upcoming exchanges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading || loadingUsers ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading exchanges...
                  </div>
                ) : upcomingExchanges.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any upcoming exchanges at the moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingExchanges.map((exchange) => renderExchangeListItem(exchange))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed & Past Exchanges</CardTitle>
                <CardDescription>
                  These are your completed exchanges and exchanges that need completion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading || loadingUsers ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading exchanges...
                  </div>
                ) : completedExchanges.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any completed exchanges yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedExchanges.map((exchange) => 
                      renderExchangeListItem(exchange, exchange.status === 'completed')
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              View your upcoming exchanges in a weekly calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || loadingUsers ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading calendar...
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Next 7 Days</h3>
                </div>
                {renderCalendarView([...upcomingExchanges, ...completedExchanges])}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Exchange Completion Dialog */}
      {selectedExchange && (
        <ExchangeCompletion 
          exchange={selectedExchange}
          userId={userId}
          open={completionDialogOpen}
          onOpenChange={setCompletionDialogOpen}
        />
      )}
    </div>
  );
}