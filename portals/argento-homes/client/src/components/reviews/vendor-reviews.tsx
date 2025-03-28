import React, { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Review, InsertReview } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Star, Plus, Trash2, Wrench, Calendar, X } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface VendorReviewsProps {
  vendorId: number;
  taskId?: number; // Optional task ID if reviewing after a completed task
  showAddReview?: boolean;
  className?: string;
}

interface ReviewWithAuthor extends Review {
  authorName?: string;
  authorImage?: string;
}

export function VendorReviews({ vendorId, taskId, showAddReview = true, className = '' }: VendorReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  
  // Fetch vendor reviews
  const { data: reviews, isLoading } = useQuery<ReviewWithAuthor[]>({
    queryKey: ['/api/reviews/vendor', vendorId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/reviews/vendor/${vendorId}`);
      return res.json();
    },
    enabled: !!vendorId,
  });
  
  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: InsertReview) => {
      const res = await apiRequest('POST', '/api/reviews', reviewData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setComment('');
      setRating(5);
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/vendor', vendorId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest('DELETE', `/api/reviews/${reviewId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review deleted",
        description: "Your review has been removed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/vendor', vendorId] });
      setReviewToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete review",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle submit review
  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }
    
    if (rating < 1 || rating > 5) {
      toast({
        title: "Invalid rating",
        description: "Please provide a rating between 1 and 5",
        variant: "destructive",
      });
      return;
    }
    
    const reviewData: InsertReview = {
      type: 'VENDOR',
      vendorId,
      rating,
      comment: comment.trim() || null,
      userId: user.id,
      taskId: taskId || null,
      propertyId: null,
      bookingId: null,
    };
    
    createReviewMutation.mutate(reviewData);
  };
  
  // Handle delete review
  const handleDeleteReview = (reviewId: number) => {
    setReviewToDelete(reviewId);
  };
  
  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      deleteReviewMutation.mutate(reviewToDelete);
    }
  };
  
  // Handle rating click
  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };
  
  // Check if user has already submitted a review
  const hasUserReviewed = reviews?.some(review => review.userId === user?.id);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Service Reviews</h3>
        {showAddReview && user && !hasUserReviewed && !isFormOpen && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        )}
      </div>
      
      {/* Review Form */}
      {isFormOpen && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Write a Review</CardTitle>
            <CardDescription>Share your experience with this service provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center mt-1 space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comment">Comments (optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this service provider..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsFormOpen(false)}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={createReviewMutation.isPending}
              className="flex items-center gap-1"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading reviews...</p>
        </div>
      ) : reviews?.length ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={review.authorImage || ""} alt={review.authorName || "Property Owner"} />
                      <AvatarFallback>{(review.authorName || "P").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{review.authorName || "Anonymous Property Owner"}</CardTitle>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                    
                    {/* Delete button (only shown for user's own reviews or admins) */}
                    {user && (user.id === review.userId || user.role.toLowerCase() === 'admin') && (
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="ml-4 text-destructive hover:text-destructive/70"
                        aria-label="Delete review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {review.comment && (
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </CardContent>
              )}
              
              {review.taskId && (
                <CardFooter className="pt-0 text-xs text-muted-foreground border-t">
                  <div className="flex items-center">
                    <Wrench className="h-3 w-3 mr-1" />
                    <span>Verified Service</span>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No reviews yet for this vendor.</p>
          {showAddReview && user && !hasUserReviewed && !isFormOpen && (
            <Button 
              variant="link" 
              onClick={() => setIsFormOpen(true)}
              className="mt-2"
            >
              Be the first to leave a review!
            </Button>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!reviewToDelete} onOpenChange={(open) => !open && setReviewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your review. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteReview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}