import { z } from 'zod';
import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Exchange } from '@shared/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Loader2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

// Review form schema
const reviewFormSchema = z.object({
  reviewerId: z.number(),
  receiverId: z.number(),
  exchangeId: z.number(),
  rating: z.number().min(1, 'Please select a rating'),
  comment: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ExchangeReviewProps {
  exchange: Exchange;
  userId: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function ExchangeReview({ exchange, userId, onComplete, onSkip }: ExchangeReviewProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);

  // The partner's ID
  const partnerId = userId === exchange.requestorId ? exchange.providerId : exchange.requestorId;

  // Review form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      reviewerId: userId,
      receiverId: partnerId,
      exchangeId: exchange.id,
      comment: '',
      rating: 0,
      tags: [],
    },
  });
  
  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const res = await apiRequest('POST', '/api/reviews', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Review submitted',
        description: 'Your review has been submitted successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      onComplete();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error submitting review',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: ReviewFormValues) => {
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating for your exchange partner',
        variant: 'destructive',
      });
      return;
    }
    
    reviewMutation.mutate({
      ...data,
      rating,
    });
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
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Review Exchange</DialogTitle>
        <DialogDescription className="text-center">
          How was your exchange with your partner?
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    form.setValue('rating', value);
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
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>
            )}
          </div>

          {/* Tags */}
          <FormField
            control={form.control}
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
                      control={form.control}
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
            control={form.control}
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
              onClick={onSkip}
            >
              Skip
            </Button>
            <Button 
              type="submit"
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}