import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Exchange } from '@shared/schema';
import { ExchangeReview } from './exchange-review';
import { ExchangeFollowUp } from './exchange-follow-up';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Clock, AlertCircle, Calendar, MessageSquare, Star, Award, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ExchangeCompletionProps {
  exchange: Exchange;
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExchangeCompletion({ exchange, userId, open, onOpenChange }: ExchangeCompletionProps) {
  const { toast } = useToast();
  
  // Determine if the current user is the requestor or provider
  const isRequestor = userId === exchange.requestorId;
  
  // Different steps of the exchange completion flow
  const [step, setStep] = useState<'confirmation' | 'celebration' | 'review' | 'follow-up'>('confirmation');
  const [showTimeCredits, setShowTimeCredits] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(0);
  
  // Check if user has already confirmed
  const hasUserConfirmed = isRequestor 
    ? exchange.requestorConfirmed === true
    : exchange.providerConfirmed === true;
  
  // Check if both users have confirmed
  const bothConfirmed = exchange.requestorConfirmed === true && exchange.providerConfirmed === true;

  // Get user data to check if there are any bucket list items to link and to display current credits
  const { data: bucketListItems = [] } = useQuery<any[]>({
    queryKey: ['/api/bucket-list', userId],
    enabled: !!userId && open,
  });
  
  // Get user details to display current time credits
  interface UserData {
    id: number;
    username: string;
    fullName: string;
    avatarUrl?: string;
    location?: string;
    bio?: string;
    timeCredits: number;
  }
  
  const { data: userData } = useQuery<UserData>({
    queryKey: ['/api/users', userId],
    enabled: !!userId && open && step === 'celebration',
  });
  
  // Update current credits when user data is fetched
  useEffect(() => {
    if (userData && userData.timeCredits !== undefined) {
      setCurrentCredits(userData.timeCredits);
    }
  }, [userData]);
  
  // Track if any bucket list item was linked to this exchange
  const [linkedBucketItem, setLinkedBucketItem] = useState(false);
  
  // Confirm exchange completion mutation
  const confirmMutation = useMutation({
    mutationFn: async () => {
      // First, update exchange status
      let updates: any = {
        ...(isRequestor ? { requestorConfirmed: true } : { providerConfirmed: true }),
      };
      
      // If both will be confirmed, update status to completed
      if ((isRequestor && exchange.providerConfirmed) || (!isRequestor && exchange.requestorConfirmed)) {
        updates.status = 'completed';
      }
        
      const res = await apiRequest('PATCH', `/api/exchanges/${exchange.id}`, updates);
      return await res.json();
    },
    onSuccess: (updatedExchange) => {
      const wasCompleted = updatedExchange.status === 'completed';
      
      toast({
        title: wasCompleted ? 'Exchange completed!' : 'Exchange confirmed',
        description: wasCompleted 
          ? 'You and your partner have completed this exchange.' 
          : 'You have confirmed this exchange completion',
      });
      
      queryClient.setQueryData(['/api/exchanges', exchange.id], updatedExchange);
      queryClient.invalidateQueries({ queryKey: ['/api/exchanges'] });
      
      // If exchange is completed, award time credits and update metrics
      if (wasCompleted) {
        awardTimeCredits();
      }
      
      // Move to celebration step first if exchange is completed
      if (wasCompleted) {
        setStep('celebration');
        
        // Show confetti effect for celebration
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            
            const randomInRange = (min: number, max: number) => {
              return Math.random() * (max - min) + min;
            };
            
            const interval = setInterval(() => {
              const timeLeft = animationEnd - Date.now();
              
              if (timeLeft <= 0) {
                return clearInterval(interval);
              }
              
              const particleCount = 50 * (timeLeft / duration);
              
              // Create confetti from random positions
              confetti({
                particleCount: Math.floor(randomInRange(20, 50)),
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.2, 0.4) },
                colors: ['#27AE60', '#48C9B0', '#F5B041'],
              });
            }, 250);
          }
        }, 300);
      } else {
        // Move to review step if just confirming
        setStep('review');
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error confirming exchange',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Award time credits and update user metrics
  const awardTimeCredits = async () => {
    if (!exchange.duration) return;
    
    try {
      // Award time credits based on exchange duration
      const timeCredits = Math.ceil(exchange.duration / 15); // 1 credit per 15 minutes
      
      // Update user metrics for both participants
      await apiRequest('POST', '/api/user-metrics/time-credits', {
        userId: exchange.requestorId,
        credits: timeCredits,
        exchangeId: exchange.id
      });
      
      await apiRequest('POST', '/api/user-metrics/time-credits', {
        userId: exchange.providerId,
        credits: timeCredits,
        exchangeId: exchange.id
      });
      
      // Create a notification for time credits
      await apiRequest('POST', '/api/notifications', {
        userId,
        type: 'time_credits',
        title: 'Time Credits Earned',
        message: `You earned ${timeCredits} time credits for completing "${exchange.title}"`,
        relatedId: exchange.id,
        relatedType: 'exchange'
      });
      
      // Trigger metrics updates
      queryClient.invalidateQueries({ queryKey: ['/api/user-metrics'] });
      
      // Show time credits toast
      setShowTimeCredits(true);
      
      toast({
        title: 'Time Credits Earned',
        description: `You've earned ${timeCredits} time credits for this exchange!`,
      });
      
      // Check if this exchange can fulfill any bucket list items
      checkBucketListFulfillment();
      
    } catch (error) {
      console.error('Error awarding time credits:', error);
    }
  };
  
  // Check if any bucket list items can be fulfilled by this exchange
  const checkBucketListFulfillment = async () => {
    if (!bucketListItems || bucketListItems.length === 0) return;
    
    // Find bucket list items that are in progress and not linked to any exchange
    const inProgressItems = bucketListItems.filter(
      (item: any) => item.status === 'in_progress' && !item.exchangeId
    );
    
    if (inProgressItems.length > 0) {
      try {
        // Update the first in-progress item to link it to this exchange
        const item = inProgressItems[0];
        await apiRequest('PATCH', `/api/bucket-list/${item.id}`, {
          exchangeId: exchange.id
        });
        
        setLinkedBucketItem(true);
        queryClient.invalidateQueries({ queryKey: ['/api/bucket-list'] });
        
        toast({
          title: 'Bucket List Updated',
          description: `Your exchange was linked to "${item.title}" in your bucket list.`,
        });
      } catch (error) {
        console.error('Error linking bucket list item:', error);
      }
    }
  };
  
  const confirmExchange = () => {
    confirmMutation.mutate();
  };
  
  const handleCelebrationContinue = () => {
    setStep('review');
  };
  
  const handleReviewComplete = () => {
    setStep('follow-up');
  };
  
  const handleReviewSkip = () => {
    setStep('follow-up');
  };
  
  const handleFollowUpComplete = () => {
    onOpenChange(false);
    // Reset step for next time
    setTimeout(() => setStep('confirmation'), 500);
  };
  
  const handleFollowUpSkip = () => {
    onOpenChange(false);
    // Reset step for next time
    setTimeout(() => setStep('confirmation'), 500);
  };
  
  const resetOnClose = () => {
    if (!open) {
      // Wait for the dialog animation to complete before resetting the step
      setTimeout(() => {
        if (step !== 'confirmation') {
          setStep('confirmation');
        }
        setShowTimeCredits(false);
        setLinkedBucketItem(false);
      }, 300);
    }
  };
  
  // Format the date
  const formattedDate = exchange.scheduledDate 
    ? formatDate(new Date(exchange.scheduledDate)) 
    : 'No date specified';
  
  // Format the duration
  const formattedDuration = exchange.duration 
    ? `${exchange.duration} minutes` 
    : 'No duration specified';
  
  // Calculate time credits (1 credit per 15 minutes)
  const estimatedTimeCredits = exchange.duration ? Math.ceil(exchange.duration / 15) : 0;
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetOnClose();
    }}>
      <DialogContent className="max-w-md sm:max-w-lg overflow-y-auto max-h-[90vh]">
        {step === 'confirmation' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getStatusColor(exchange.status)
              )}>
                {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
              </span>
              <h2 className="text-2xl font-bold text-center">{exchange.title}</h2>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Exchange Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{formattedDuration}</p>
                  </div>
                </div>
                
                {exchange.description && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">{exchange.description}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <Zap className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Estimated Time Credits</p>
                    <p className="text-sm text-muted-foreground">
                      {estimatedTimeCredits} credits (awarded upon completion)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Star className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Confirmation Status</p>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1">
                        {exchange.requestorConfirmed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <p className="text-sm">
                          Requestor: {exchange.requestorConfirmed ? 'Confirmed' : 'Not confirmed'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {exchange.providerConfirmed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <p className="text-sm">
                          Provider: {exchange.providerConfirmed ? 'Confirmed' : 'Not confirmed'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-col gap-4 sm:flex-row">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={confirmExchange}
                  disabled={confirmMutation.isPending || hasUserConfirmed}
                >
                  {confirmMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : hasUserConfirmed ? (
                    'Already Confirmed'
                  ) : (
                    'Confirm Completion'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {step === 'celebration' && (
          <div className="flex flex-col items-center py-6 space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Exchange Complete!</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              Congratulations! You've successfully completed this exchange.
            </p>
            
            {showTimeCredits && (
              <Card className="w-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/50 dark:to-teal-950/50 border-teal-200 dark:border-teal-800">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="flex items-center mt-2 mb-1">
                    <Zap className="h-6 w-6 text-amber-500 mr-2" />
                    <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {estimatedTimeCredits} Time Credits Earned
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    These credits have been added to your account
                  </p>
                  
                  {userData && (
                    <div className="flex items-center mt-2 border-t border-teal-200 dark:border-teal-800 pt-3 w-full justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Balance: <span className="font-bold text-amber-600 dark:text-amber-400">{currentCredits} Credits</span>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {linkedBucketItem && (
              <Card className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border-indigo-200 dark:border-indigo-800">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="flex items-center mt-2 mb-1">
                    <CheckCircle className="h-6 w-6 text-indigo-500 mr-2" />
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      Bucket List Update
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This exchange was linked to an item in your bucket list!
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Button 
              onClick={handleCelebrationContinue} 
              className="mt-4"
              size="lg"
            >
              Continue
            </Button>
          </div>
        )}
        
        {step === 'review' && (
          <ExchangeReview 
            exchange={exchange} 
            userId={userId} 
            onComplete={handleReviewComplete}
            onSkip={handleReviewSkip} 
          />
        )}
        
        {step === 'follow-up' && (
          <ExchangeFollowUp 
            exchange={exchange} 
            userId={userId} 
            onComplete={handleFollowUpComplete}
            onSkip={handleFollowUpSkip}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}