import { useState } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { User, Exchange, insertExchangeSchema } from '@shared/schema';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';

// The exchange request form schema
const exchangeRequestSchema = z.object({
  providerId: z.number(),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  scheduledDate: z.date({ required_error: 'Please select a date' }),
  timeSlot: z.string({ required_error: 'Please select a time slot' }),
  duration: z.number().min(15, { message: 'Duration must be at least 15 minutes' }),
  message: z.string().optional(),
});

type ExchangeRequestFormValues = z.infer<typeof exchangeRequestSchema>;

interface ExchangeRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: User; // The user whose skill is being requested
  currentUserId: number;
}

export function ExchangeRequestModal({ 
  open, 
  onOpenChange, 
  provider, 
  currentUserId 
}: ExchangeRequestModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  
  // Fetch the selected provider's availability
  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: [`/api/availability/time-slots`, { userId: provider.id }],
    queryFn: async () => {
      // Fetch the user's available time slots
      // In a real implementation, this would use the userId from the route params
      const today = new Date();
      const url = `/api/availability/time-slots?userId=${provider.id}&date=${today.toISOString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      return await response.json();
    },
    enabled: open && !!provider.id,
  });
  
  // Predefined time slots for demonstration
  const availableTimeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
  ];
  
  // Predefined durations
  const availableDurations = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1 hour 30 minutes' },
    { value: 120, label: '2 hours' },
  ];

  // Setup form with default values
  const form = useForm<ExchangeRequestFormValues>({
    resolver: zodResolver(exchangeRequestSchema),
    defaultValues: {
      providerId: provider.id,
      title: `Exchange with ${provider.fullName}`,
      description: '',
      scheduledDate: new Date(),
      timeSlot: '',
      duration: 60,
      message: '',
    },
  });
  
  // Handle the exchange request creation
  const exchangeMutation = useMutation({
    mutationFn: async (values: ExchangeRequestFormValues) => {
      // Convert form values to API format
      const combinedDate = new Date(values.scheduledDate);
      const [hours, minutes] = values.timeSlot.split(':').map(Number);
      combinedDate.setHours(hours, minutes, 0, 0);
      
      const exchangeData = {
        providerId: values.providerId,
        title: values.title,
        description: values.description || `Exchange with ${provider.fullName}`,
        scheduledDate: combinedDate.toISOString(),
        duration: values.duration,
        status: 'requested',
        requestorConfirmed: false,
        providerConfirmed: false,
      };
      
      const res = await apiRequest('POST', '/api/exchanges', exchangeData);
      return await res.json();
    },
    onSuccess: (exchange: Exchange) => {
      toast({
        title: 'Request Sent',
        description: 'Your exchange request has been sent successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exchanges'] });
      onReset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create exchange request',
        variant: 'destructive',
      });
      setStep('details');
    },
  });
  
  // Handle form submission
  const onSubmit = (values: ExchangeRequestFormValues) => {
    if (step === 'details') {
      setStep('confirmation');
    } else {
      exchangeMutation.mutate(values);
    }
  };
  
  // Reset the form and modal state
  const onReset = () => {
    form.reset();
    setStep('details');
  };
  
  // Handle modal close
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      onReset();
    }
  };
  
  // Format the selected date and time for display
  const getFormattedDateTime = () => {
    const date = form.watch('scheduledDate');
    const timeSlot = form.watch('timeSlot');
    
    if (!date || !timeSlot) return 'No date/time selected';
    
    const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
    const formattedTime = timeSlot.split(':').map(Number)[0] >= 12 
      ? `${timeSlot.split(':').map(Number)[0] > 12 ? timeSlot.split(':').map(Number)[0] - 12 : timeSlot.split(':').map(Number)[0]}:${timeSlot.split(':')[1]} PM`
      : `${timeSlot} AM`;
    
    return `${formattedDate} at ${formattedTime}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'details' ? 'Request Exchange' : 'Confirm Exchange Request'}
          </DialogTitle>
          <DialogDescription>
            {step === 'details' 
              ? `Request an exchange with ${provider.fullName}`
              : 'Please review your exchange request details before submitting'
            }
          </DialogDescription>
        </DialogHeader>
        
        {step === 'details' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <UserAvatar 
                  src={provider.avatarUrl || undefined} 
                  name={provider.fullName}
                  size="lg"
                />
                <div>
                  <h3 className="font-medium">{provider.fullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {provider.location || 'No location specified'}
                  </p>
                </div>
              </div>
                
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Title</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What skill do you want to learn or share?" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
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
                        <Calendar
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
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a time that works for both of you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDurations.map((duration) => (
                          <SelectItem key={duration.value} value={duration.value.toString()}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a personal message to your request..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Let the other person know why you're interested in this exchange
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="ml-2">
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <h3 className="font-medium">Exchange Details</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="min-w-[100px] text-sm text-muted-foreground">Title:</div>
                  <div className="text-sm font-medium">{form.watch('title')}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="min-w-[100px] text-sm text-muted-foreground">With:</div>
                  <div className="text-sm font-medium">{provider.fullName}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="min-w-[100px] text-sm text-muted-foreground">When:</div>
                  <div className="text-sm font-medium">{getFormattedDateTime()}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="min-w-[100px] text-sm text-muted-foreground">Duration:</div>
                  <div className="text-sm font-medium">
                    {form.watch('duration')} minutes
                  </div>
                </div>
                
                {form.watch('message') && (
                  <div className="flex items-start">
                    <div className="min-w-[100px] text-sm text-muted-foreground">Message:</div>
                    <div className="text-sm">{form.watch('message')}</div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button 
                type="button" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={exchangeMutation.isPending}
                className="ml-2"
              >
                {exchangeMutation.isPending ? 'Sending Request...' : 'Send Request'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}