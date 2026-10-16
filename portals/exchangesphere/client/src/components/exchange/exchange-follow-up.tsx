import { z } from 'zod';
import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Exchange } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

type MessageFormValues = z.infer<typeof messageFormSchema>;
type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ExchangeFollowUpProps {
  exchange: Exchange;
  userId: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function ExchangeFollowUp({ exchange, userId, onComplete, onSkip }: ExchangeFollowUpProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('message');
  
  // The partner's ID
  const partnerId = userId === exchange.requestorId ? exchange.providerId : exchange.requestorId;
  
  // Message form
  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: '',
      exchangeId: exchange.id,
      receiverId: partnerId
    }
  });
  
  // Schedule form
  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      date: new Date(),
      timeOfDay: 'afternoon',
      exchangeId: exchange.id,
      note: ''
    }
  });
  
  // Submit message mutation
  const messageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      const res = await apiRequest('POST', '/api/messages', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      onComplete();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Submit schedule mutation
  const scheduleMutation = useMutation({
    mutationFn: async (data: ScheduleFormValues) => {
      // For scheduling, we'll create a message with the schedule information
      const message = {
        content: `I'd like to schedule another exchange on ${format(data.date, 'PPP')} (${data.timeOfDay})${data.note ? '. Note: ' + data.note : ''}`,
        exchangeId: data.exchangeId,
        receiverId: partnerId
      };
      
      const res = await apiRequest('POST', '/api/messages', message);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Schedule shared',
        description: 'Your suggested schedule has been sent!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      onComplete();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error sharing schedule',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmitMessage = (data: MessageFormValues) => {
    messageMutation.mutate(data);
  };
  
  const onSubmitSchedule = (data: ScheduleFormValues) => {
    scheduleMutation.mutate(data);
  };
  
  return (
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
                  onClick={onSkip}
                >
                  Skip
                </Button>
                <Button 
                  type="submit"
                  disabled={messageMutation.isPending}
                >
                  {messageMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
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
                  onClick={onSkip}
                >
                  Skip
                </Button>
                <Button 
                  type="submit"
                  disabled={scheduleMutation.isPending}
                >
                  {scheduleMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Next Exchange'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  );
}