import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BucketListItem, insertBucketListItemSchema, Exchange } from '@shared/schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertCircle, 
  Plus, 
  Edit, 
  Check, 
  X, 
  Hourglass, 
  LinkIcon, 
  Calendar,
  Trophy 
} from 'lucide-react';

// Extend the bucket list item schema with validation
const bucketListItemSchema = insertBucketListItemSchema.extend({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  status: z.enum(['planned', 'in_progress', 'achieved']).default('planned'),
  exchangeId: z.number().nullable().optional(),
  description: z.string().optional().transform(val => val || ''),
});

type BucketListItemFormValues = z.infer<typeof bucketListItemSchema>;

interface BucketListTabProps {
  userId: number;
}

// Dream fulfillment tracking component for ExchangeSphere

export function BucketListTab({ userId }: BucketListTabProps) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [fulfilledDream, setFulfilledDream] = useState<BucketListItem | null>(null);

  const { data: bucketList, isLoading } = useQuery<BucketListItem[]>({
    queryKey: ['/api/bucket-list', userId],
    queryFn: async () => {
      const res = await fetch(`/api/bucket-list?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch bucket list');
      return res.json();
    },
  });
  
  // Fetch user's exchanges for linking
  const { data: userExchanges } = useQuery<Exchange[]>({
    queryKey: ['/api/exchanges', userId],
    queryFn: async () => {
      const res = await fetch(`/api/exchanges?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch exchanges');
      return res.json();
    },
    // Only fetch exchanges when editing
    enabled: !!editingItem,
  });

  // Add bucket list item mutation
  const addMutation = useMutation({
    mutationFn: async (data: BucketListItemFormValues) => {
      const res = await apiRequest('POST', '/api/bucket-list', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bucket-list', userId] });
      setIsAddDialogOpen(false);
      toast({
        title: 'Success!',
        description: 'Your aspiration has been added to your bucket list',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Edit bucket list item mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<BucketListItem> }) => {
      const res = await apiRequest('PATCH', `/api/bucket-list/${id}`, data);
      return await res.json();
    },
    onSuccess: (updatedItem: BucketListItem) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bucket-list', userId] });
      setEditingItem(null);
      
      // Check if this update resulted in a dream fulfillment (achieved + linked to exchange)
      if (updatedItem.status === 'achieved' && updatedItem.exchangeId) {
        // Create a notification for dream fulfillment
        apiRequest('POST', '/api/notifications', {
          userId,
          type: 'dream_fulfilled',
          title: 'Dream Fulfilled!',
          content: `You've achieved your dream: ${updatedItem.title}`,
          read: false,
          linkType: 'bucket_list',
          linkId: updatedItem.id
        }).catch(() => {
          // Silently fail on notification creation
        });
        
        // Set the fulfilled dream to show celebration
        setFulfilledDream(updatedItem);
        setShowCelebration(true);
        
        // Show toast for dream fulfillment
        toast({
          title: '🎉 Dream Fulfilled!',
          description: `Congratulations on achieving your dream: ${updatedItem.title}`,
          variant: 'default',
        });
      } else {
        // Regular update toast
        toast({
          title: 'Success!',
          description: 'Your bucket list item has been updated',
        });
      }
      
      // If this is a bucket list completion, update analytics
      if (updatedItem.status === 'achieved') {
        // Refresh admin analytics if they exist
        queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics/bucket-list'] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Add form
  const addForm = useForm<BucketListItemFormValues>({
    resolver: zodResolver(bucketListItemSchema),
    defaultValues: {
      userId,
      title: '',
      description: '',
      completed: false,
      status: 'planned',
      exchangeId: null,
    },
  });

  // Edit form
  const editForm = useForm<BucketListItemFormValues>({
    resolver: zodResolver(bucketListItemSchema),
    defaultValues: {
      userId,
      title: '',
      description: '',
      completed: false,
      status: 'planned',
      exchangeId: null,
    },
  });

  // Reset edit form when editing item changes
  React.useEffect(() => {
    if (editingItem) {
      editForm.reset({
        userId,
        title: editingItem.title,
        description: editingItem.description || '',
        completed: editingItem.completed,
        status: editingItem.status as 'planned' | 'in_progress' | 'achieved',
        exchangeId: editingItem.exchangeId,
      });
    }
  }, [editingItem, editForm, userId]);

  const onAddSubmit = (data: BucketListItemFormValues) => {
    // If status is achieved, automatically mark as completed
    if (data.status === 'achieved' && !data.completed) {
      data.completed = true;
    }
    
    addMutation.mutate(data);
  };

  const onEditSubmit = (data: BucketListItemFormValues) => {
    if (!editingItem) return;
    
    // If status is achieved, automatically mark as completed
    if (data.status === 'achieved' && !data.completed) {
      data.completed = true;
    }
    
    editMutation.mutate({
      id: editingItem.id,
      data: {
        title: data.title,
        description: data.description,
        completed: data.completed,
        status: data.status,
        exchangeId: data.exchangeId
      },
    });
  };

  const toggleCompleted = (item: BucketListItem) => {
    const newCompleted = !item.completed;
    const updates: Partial<BucketListItem> = {
      completed: newCompleted
    };
    
    // If marking as completed and status is still 'planned', update to 'achieved'
    if (newCompleted && item.status === 'planned') {
      updates.status = 'achieved';
    }
    // If marking as not completed and status is 'achieved', revert to 'in_progress'
    else if (!newCompleted && item.status === 'achieved') {
      updates.status = 'in_progress';
    }
    
    editMutation.mutate({
      id: item.id,
      data: updates
    });
  };

  // Calculate progress metrics
  const totalItems = bucketList?.length || 0;
  const achievedItems = bucketList?.filter(item => item.status === 'achieved').length || 0;
  const inProgressItems = bucketList?.filter(item => item.status === 'in_progress').length || 0;
  const plannedItems = bucketList?.filter(item => item.status === 'planned').length || 0;
  const fulfilledDreams = bucketList?.filter(item => item.status === 'achieved' && item.exchangeId).length || 0;
  
  return (
    <div className="space-y-6">
      {/* Dream Fulfillment Celebration Modal */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-5">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl mb-2">🎉 Dream Fulfilled! 🎉</DialogTitle>
            <p className="text-base text-gray-600 mb-4">
              Congratulations on achieving your dream:
            </p>
            <p className="text-lg font-semibold mb-6">
              {fulfilledDream?.title}
            </p>
            
            <div className="mb-4 px-6 py-4 bg-blue-50 rounded-md text-blue-700 text-sm">
              <p>You've received the "Dream Fulfilled" badge for connecting this achievement with an exchange!</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCelebration(false)}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowCelebration(false);
                  // Add a notification to share this achievement
                  apiRequest('POST', '/api/notifications', {
                    userId,
                    type: 'dream_share_prompt',
                    title: 'Share Your Achievement',
                    content: `Would you like to share how you achieved: ${fulfilledDream?.title}?`,
                    read: false,
                    linkType: 'bucket_list',
                    linkId: fulfilledDream?.id
                  }).catch(() => {
                    // Silently fail
                  });
                  
                  toast({
                    title: 'Share Your Story',
                    description: 'Check your notifications to share how you achieved this dream!',
                  });
                }}
              >
                Share My Story
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Bucket List Progress Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Dreams</h3>
              <p className="text-3xl font-bold">{totalItems}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">In Progress</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inProgressItems}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Achieved</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{achievedItems}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Dreams Fulfilled</h3>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{fulfilledDreams}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-1 text-sm">
              <span>Completion Progress</span>
              <span>{totalItems > 0 ? Math.round((achievedItems / totalItems) * 100) : 0}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                style={{width: `${totalItems > 0 ? (achievedItems / totalItems) * 100 : 0}%`}}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Bucket List</CardTitle>
            <CardDescription>
              Track your aspirations and things you'd like to accomplish
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Aspiration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Bucket List</DialogTitle>
                <DialogDescription>
                  What would you like to learn or experience?
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Learn to play guitar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="I want to learn enough to play my favorite songs"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="achieved">Achieved</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Track the current status of your aspiration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={addMutation.isPending}>
                      {addMutation.isPending ? 'Adding...' : 'Add to Bucket List'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-gray-500">Loading your bucket list...</p>
            </div>
          ) : bucketList && bucketList.length > 0 ? (
            <div className="space-y-4">
              {bucketList.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    item.status === 'in_progress' 
                      ? 'bg-blue-50 border-blue-200'
                      : item.status === 'achieved'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-background'
                  }`}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleCompleted(item)}
                    className={item.completed ? 'text-green-500 border-green-500' : ''}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={`font-medium text-lg ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.title}
                      </h3>
                      
                      {/* Status badge */}
                      {item.status === 'in_progress' ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 flex items-center gap-1">
                          <Hourglass className="h-3 w-3" />
                          In Progress
                        </Badge>
                      ) : item.status === 'achieved' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Achieved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Planned
                        </Badge>
                      )}
                      
                      {/* Exchange link badge */}
                      {item.exchangeId && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          Exchange
                        </Badge>
                      )}
                      
                      {/* Dream Fulfilled badge */}
                      {item.status === 'achieved' && item.exchangeId && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1 border-amber-200 font-medium">
                          <Trophy className="h-3 w-3" />
                          Dream Fulfilled
                        </Badge>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className={`mt-1 text-sm ${item.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                    className="text-gray-500 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">Your bucket list is empty</h3>
              <p className="text-gray-400 mb-4">
                Start adding aspirations, skills you want to learn, or experiences you'd like to have.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>Add Your First Aspiration</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bucket List Item</DialogTitle>
            <DialogDescription>
              Update your aspiration details
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="achieved">Achieved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Track the current status of your aspiration
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {userExchanges && userExchanges.length > 0 && (
                <FormField
                  control={editForm.control}
                  name="exchangeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link to Exchange</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                        defaultValue={field.value?.toString() || ''}
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Link to an exchange (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {userExchanges.map((exchange) => (
                            <SelectItem key={exchange.id} value={exchange.id.toString()}>
                              {exchange.title || `Exchange #${exchange.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Connect this aspiration to an exchange that helped you achieve it
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={editForm.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Mark as completed
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        {field.value 
                          ? "When marked as completed, your aspiration will get a completion badge"
                          : "Mark this when you've achieved your goal"}
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={editMutation.isPending}>
                  {editMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}