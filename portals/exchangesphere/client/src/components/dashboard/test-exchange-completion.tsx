import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Exchange } from '@shared/schema';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Loader2, CheckCircle, Clock, AlertCircle, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { z } from 'zod';

// Review form schema
const reviewFormSchema = z.object({
  reviewerId: z.number(),
  receiverId: z.number(),
  exchangeId: z.number(),
  rating: z.number().min(1, 'Please select a rating'),
  comment: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Message form schema
const messageFormSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  exchangeId: z.number(),
  receiverId: z.number()
});

// Schedule form schema
const scheduleFormSchema = z.object({
  date: z.date(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening']),
  exchangeId: z.number(),
  note: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;
type MessageFormValues = z.infer<typeof messageFormSchema>;
type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface TestExchangeCompletionProps {
  userId: number;
}

export function TestExchangeCompletion({ userId }: TestExchangeCompletionProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'confirmation' | 'review' | 'follow-up'>('confirmation');
  const [rating, setRating] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('message');
  
  // Use existing exchanges instead of creating a new one
  const [isLoading, setIsLoading] = useState(true);
  const [sampleExchange, setSampleExchange] = useState<Exchange>({
    id: 1, // Default ID
    requestorId: userId,
    providerId: 2, // Another user's ID
    title: "Test Photography Session",
    description: "This is a test exchange for testing the exchange completion flow",
    status: "active",
    scheduledDate: new Date(),
    duration: 60,
    requestorConfirmed: false,
    providerConfirmed: false,
    createdAt: new Date()
  });

  // Fetch existing exchanges or create a mock one
  useEffect(() => {
    async function fetchExistingExchanges() {
      if (!userId || isLoading === false) return;
      
      setIsLoading(true);
      try {
        // Try to fetch all exchanges first
        const allExchangesResponse = await fetch('/api/exchanges/all');
        
        if (allExchangesResponse.ok) {
          const allExchanges = await allExchangesResponse.json();
          
          // Use the first exchange if available
          if (allExchanges && allExchanges.length > 0) {
            // Find an exchange where the current user is either requestor or provider
            const userExchange = allExchanges.find((exchange: Exchange) => 
              exchange.requestorId === userId || exchange.providerId === userId
            );
            
            if (userExchange) {
              // Use a user exchange if found
              const preparedExchange = {
                ...userExchange,
                // Make sure it's active and not already confirmed
                status: "active",
                requestorConfirmed: false,
                providerConfirmed: false
              };
              setSampleExchange(preparedExchange);
              console.log('Using existing exchange with ID:', preparedExchange.id);
              setIsLoading(false);
              return;
            } else {
              // If no user exchange found, use the first exchange from the list
              // (This helps demonstrate with any existing exchange)
              const preparedExchange = {
                ...allExchanges[0],
                status: "active",
                requestorConfirmed: false,
                providerConfirmed: false
              };
              setSampleExchange(preparedExchange);
              console.log('Using another exchange with ID:', preparedExchange.id);
              setIsLoading(false);
              return;
            }
          }
        }
        
        // Fallback to user's exchanges if all exchanges fails
        const userExchangesResponse = await fetch('/api/exchanges');
        
        if (userExchangesResponse.ok) {
          const userExchanges = await userExchangesResponse.json();
          
          // Use the first exchange if available
          if (userExchanges && userExchanges.length > 0) {
            const latestExchange = {
              ...userExchanges[0],
              // Make sure it's active and not already confirmed
              status: "active",
              requestorConfirmed: false,
              providerConfirmed: false
            };
            setSampleExchange(latestExchange);
            console.log('Using user exchange with ID:', latestExchange.id);
          } else {
            // No exchanges found, create a new one
            console.log('No existing exchanges found, creating a new exchange');
            
            // Get a user to exchange with (not the current user)
            const usersResponse = await fetch('/api/users');
            
            if (!usersResponse.ok) {
              throw new Error('Failed to fetch users');
            }
            
            const users = await usersResponse.json();
            
            // Find a user that is not the current user
            const otherUser = users.find((user: any) => user.id !== userId);
            
            if (otherUser) {
              // Create a new exchange
              const createResponse = await fetch('/api/exchanges', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  providerId: otherUser.id,
                  title: "Test Photography Session",
                  description: "This is a test exchange for the notification flow",
                  scheduledDate: new Date(),
                  duration: 60,
                }),
              });
              
              if (createResponse.ok) {
                const newExchange = await createResponse.json();
                setSampleExchange(newExchange);
                console.log('Created new exchange with ID:', newExchange.id);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching exchanges:', error);
        // Keep using the mock exchange
      } finally {
        setIsLoading(false);
      }
    }
    
    if (userId) {
      fetchExistingExchanges();
    }
  }, [userId]);
  
  // Check if user is the requestor
  const isRequestor = userId === sampleExchange.requestorId;
  
  // Format the date
  const formattedDate = sampleExchange.scheduledDate 
    ? format(new Date(sampleExchange.scheduledDate), 'PPP') 
    : 'No date specified';
  
  // Format the duration
  const formattedDuration = sampleExchange.duration 
    ? `${sampleExchange.duration} minutes` 
    : 'No duration specified';
    
  // Partner's ID
  const partnerId = userId === sampleExchange.requestorId ? sampleExchange.providerId : sampleExchange.requestorId;
  
  // Confirm exchange - now triggers real API
  const confirmExchange = async () => {
    try {
      // Make actual API call to update exchange status
      const response = await fetch(`/api/exchanges/${sampleExchange.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          ...(isRequestor ? { requestorConfirmed: true } : { providerConfirmed: true })
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update exchange');
      }
      
      const updatedExchange = await response.json();
      
      // Update local state with response data
      setSampleExchange(updatedExchange);
      
      toast({
        title: 'Exchange confirmed',
        description: 'You have confirmed this exchange completion. This will trigger a notification.',
      });
      
      // Move to review step
      setStep('review');
    } catch (error) {
      console.error('Error confirming exchange:', error);
      toast({
        title: 'Error',
        description: 'Failed to confirm exchange completion',
        variant: 'destructive',
      });
    }
  };
  
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
  
  // Review form
  const reviewForm = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewerId: userId,
      receiverId: partnerId,
      exchangeId: sampleExchange.id,
      comment: '',
      rating: 0,
      tags: [],
    },
  });
  
  // Message form
  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: '',
      exchangeId: sampleExchange.id,
      receiverId: partnerId
    }
  });
  
  // Schedule form
  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      date: new Date(),
      timeOfDay: 'afternoon',
      exchangeId: sampleExchange.id,
      note: ''
    }
  });
  
  // Update form values when exchange ID changes
  useEffect(() => {
    if (sampleExchange.id > 0) {
      reviewForm.setValue('exchangeId', sampleExchange.id);
      messageForm.setValue('exchangeId', sampleExchange.id);
      scheduleForm.setValue('exchangeId', sampleExchange.id);
      
      reviewForm.setValue('receiverId', partnerId);
      messageForm.setValue('receiverId', partnerId);
    }
  }, [sampleExchange.id, reviewForm, messageForm, scheduleForm, partnerId]);
  
  // Submit review - now triggers real API
  const onSubmitReview = async (data: ReviewFormValues) => {
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating for your exchange partner',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Make actual API call to create review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          rating: rating,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      
      const review = await response.json();
      
      toast({
        title: 'Review submitted',
        description: 'Your review has been submitted successfully! This will generate a notification.',
      });
      
      // Move to follow-up step
      setStep('follow-up');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };
  
  // List of possible tags for the review
  const tagOptions = [
    { id: 'knowledgeable', label: 'Knowledgeable' },
    { id: 'helpful', label: 'Helpful' },
    { id: 'punctual', label: 'Punctual' },
    { id: 'patient', label: 'Patient' },
    { id: 'clear', label: 'Clear Communicator' },
    { id: 'respectful', label: 'Respectful' },
    { id: 'engaging', label: 'Engaging' },
    { id: 'prepared', label: 'Well-prepared' },
  ];
  
  // Handle skipping review
  const skipReview = () => {
    setStep('follow-up');
  };
  
  // Submit message - now triggers real API
  const onSubmitMessage = async (data: MessageFormValues) => {
    try {
      // Make actual API call to send message
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const message = await response.json();
      
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully! This will generate a notification.',
      });
      closeDialog();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };
  
  // Submit schedule - now triggers real API
  const onSubmitSchedule = async (data: ScheduleFormValues) => {
    try {
      // Create a new exchange with the selected schedule
      // For exchanges, the server sets the requestorId from the logged-in user
      const response = await fetch('/api/exchanges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Follow-up to ${sampleExchange.title}`,
          description: data.note || `Scheduled follow-up session for ${sampleExchange.title}`,
          providerId: isRequestor ? sampleExchange.providerId : userId,
          scheduledDate: data.date,
          duration: 60, // Default 1 hour
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create follow-up exchange');
      }
      
      const newExchange = await response.json();
      
      // Send a message notifying about the new schedule
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `I've scheduled a follow-up exchange for ${format(data.date, 'PPP')} during the ${data.timeOfDay}. Looking forward to meeting again!`,
          exchangeId: newExchange.id,
          receiverId: partnerId
        }),
      });
      
      toast({
        title: 'Schedule shared',
        description: 'Your suggested schedule has been sent! This will generate a notification.',
      });
      closeDialog();
    } catch (error) {
      console.error('Error creating follow-up exchange:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule follow-up exchange',
        variant: 'destructive',
      });
    }
  };
  
  // Skip follow-up
  const skipFollowUp = () => {
    closeDialog();
  };
  
  // Close dialog and reset state
  const closeDialog = () => {
    setIsOpen(false);
    
    // Reset state after dialog closes
    setTimeout(() => {
      setStep('confirmation');
      setRating(0);
      setActiveTab('message');
      setSampleExchange({
        ...sampleExchange,
        requestorConfirmed: false,
        providerConfirmed: false
      });
      reviewForm.reset();
      messageForm.reset();
      scheduleForm.reset();
    }, 300);
  };
  
  // Check if user has already confirmed
  const hasUserConfirmed = isRequestor 
    ? sampleExchange.requestorConfirmed === true
    : sampleExchange.providerConfirmed === true;
  
  // Check if both users have confirmed
  const bothConfirmed = sampleExchange.requestorConfirmed === true && sampleExchange.providerConfirmed === true;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Exchange Completion Flow Test</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This is a test component to demonstrate the exchange completion flow, including the confirmation, 
          review, and follow-up steps. <span className="font-semibold">Live mode:</span> This will make real API calls
          and generate actual notifications for testing purposes.
        </p>
        <Button 
          onClick={() => setIsOpen(true)} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading Exchange...
            </>
          ) : (
            "Test Exchange Completion"
          )}
        </Button>
        
        {isLoading && (
          <p className="text-xs text-muted-foreground mt-2">
            Loading exchange data...
          </p>
        )}
        
        <Dialog open={isOpen} onOpenChange={(isOpen) => {
          if (!isOpen) closeDialog();
          else setIsOpen(true);
        }}>
          <DialogContent className="max-w-md sm:max-w-lg overflow-y-auto max-h-[90vh]">
            {step === 'confirmation' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getStatusColor(sampleExchange.status)
                  )}>
                    {sampleExchange.status.charAt(0).toUpperCase() + sampleExchange.status.slice(1)}
                  </span>
                  <h2 className="text-2xl font-bold text-center">{sampleExchange.title}</h2>
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
                    
                    {sampleExchange.description && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">{sampleExchange.description}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2">
                      <Star className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Confirmation Status</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1">
                            {sampleExchange.requestorConfirmed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            <p className="text-sm">
                              Requestor: {sampleExchange.requestorConfirmed ? 'Confirmed' : 'Not confirmed'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {sampleExchange.providerConfirmed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            <p className="text-sm">
                              Provider: {sampleExchange.providerConfirmed ? 'Confirmed' : 'Not confirmed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <DialogFooter className="flex justify-between flex-col gap-4 sm:flex-row">
                    <Button 
                      variant="outline" 
                      onClick={() => closeDialog()}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={confirmExchange}
                      disabled={hasUserConfirmed}
                    >
                      {hasUserConfirmed ? 'Already Confirmed' : 'Confirm Completion'}
                    </Button>
                  </DialogFooter>
                </Card>
              </div>
            )}
            
            {step === 'review' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-center">Review Exchange</DialogTitle>
                  <DialogDescription className="text-center">
                    How was your exchange with your partner?
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...reviewForm}>
                  <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-2">
                      <FormLabel>Rating</FormLabel>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className="rounded-md p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                            onClick={() => {
                              setRating(value);
                              reviewForm.setValue('rating', value);
                            }}
                          >
                            <Star
                              className={`h-8 w-8 ${
                                value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {reviewForm.formState.errors.rating && (
                        <p className="text-sm text-destructive">{reviewForm.formState.errors.rating.message}</p>
                      )}
                    </div>

                    {/* Tags */}
                    <FormField
                      control={reviewForm.control}
                      name="tags"
                      render={() => (
                        <FormItem>
                          <div className="mb-2">
                            <FormLabel>Skills & Qualities</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {tagOptions.map((option) => (
                              <FormField
                                key={option.id}
                                control={reviewForm.control}
                                name="tags"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], option.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Comment */}
                    <FormField
                      control={reviewForm.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              value={field.value || ''}
                              placeholder="Share what you liked about the exchange or provide feedback..."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={skipReview}
                      >
                        Skip
                      </Button>
                      <Button type="submit">
                        Submit Review
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            )}
            
            {step === 'follow-up' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-center">Would you like to follow up?</DialogTitle>
                  <DialogDescription className="text-center">
                    Send a message to your exchange partner or schedule another exchange
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="message" value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="message">Send Message</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule Again</TabsTrigger>
                  </TabsList>
                  
                  {/* Message Tab */}
                  <TabsContent value="message" className="mt-4">
                    <Form {...messageForm}>
                      <form onSubmit={messageForm.handleSubmit(onSubmitMessage)} className="space-y-4">
                        <FormField
                          control={messageForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Type your message here..." 
                                  className="min-h-[150px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={skipFollowUp}
                          >
                            Skip
                          </Button>
                          <Button type="submit">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  {/* Schedule Tab */}
                  <TabsContent value="schedule" className="mt-4">
                    <Form {...scheduleForm}>
                      <form onSubmit={scheduleForm.handleSubmit(onSubmitSchedule)} className="space-y-4">
                        <FormField
                          control={scheduleForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={scheduleForm.control}
                          name="timeOfDay"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Time of Day</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="morning" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Morning (8am - 12pm)
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="afternoon" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Afternoon (12pm - 5pm)
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="evening" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Evening (5pm - 10pm)
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={scheduleForm.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Note (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  value={field.value || ''}
                                  placeholder="Any specific details about the schedule..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={skipFollowUp}
                          >
                            Skip
                          </Button>
                          <Button type="submit">
                            Schedule Next Exchange
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}