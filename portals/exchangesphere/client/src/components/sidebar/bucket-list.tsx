import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BucketListItem } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface BucketListProps {
  userId: number;
}

const bucketListItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type BucketListItemFormValues = z.infer<typeof bucketListItemSchema>;

export function BucketList({ userId }: BucketListProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const form = useForm<BucketListItemFormValues>({
    resolver: zodResolver(bucketListItemSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  
  const { data: bucketList, isLoading } = useQuery<BucketListItem[]>({
    queryKey: ['/api/bucket-list'],
    enabled: !!userId,
  });
  
  const createItemMutation = useMutation({
    mutationFn: async (data: BucketListItemFormValues) => {
      return await apiRequest('POST', '/api/bucket-list', { ...data, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bucket-list'] });
      toast({
        title: 'Dream added',
        description: 'Your bucket list item has been added',
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Failed to add item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: BucketListItemFormValues) => {
    createItemMutation.mutate(data);
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Your Bucket List</h3>
          <Button variant="link" className="text-primary hover:text-green-700 p-0">Edit</Button>
        </div>
        
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading bucket list...</p>
        ) : (
          <ul className="space-y-3">
            {bucketList && bucketList.length > 0 ? (
              bucketList.slice(0, 3).map(item => (
                <li key={item.id} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-700">{item.title}</p>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">Your bucket list is empty</li>
            )}
          </ul>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 w-full">
              <Plus className="h-5 w-5 mr-2 text-gray-500" />
              Add New Dream
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Your Bucket List</DialogTitle>
              <DialogDescription>
                Add a new dream or experience you'd like to achieve
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="What would you like to experience?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add more details about this experience"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createItemMutation.isPending}
                  >
                    {createItemMutation.isPending ? 'Adding...' : 'Add to Bucket List'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
