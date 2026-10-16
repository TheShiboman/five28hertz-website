import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { UserAvatar } from '@/components/user-avatar';
import { CommunityPost, PostComment } from '@shared/schema';
import { AchievementBadges } from '@/components/achievement-badges';
import { AchievementType } from '@/components/achievement-badge';
import { Heart, Image, SendHorizontal, AlertCircle } from 'lucide-react';

// Custom MessageSquare component to avoid import issues
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
  );
}
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPostContent, setNewPostContent] = useState('');
  const [showCommentInput, setShowCommentInput] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  // Query for community posts
  const { data: postsData, isLoading } = useQuery<CommunityPost[]>({
    queryKey: ['/api/community-posts'],
  });
  
  // Enhanced posts with user achievements
  const posts = React.useMemo(() => {
    if (!postsData) return [];
    
    return postsData.map(post => {
      // Example achievements based on user ID
      // In a real implementation, this would come from the API
      const achievements: AchievementType[] = [];
      
      // Assign different achievement combinations based on user ID
      if (post.userId === 1) {
        achievements.push('mentor', 'trusted');
      } else if (post.userId === 2) {
        achievements.push('cultural', 'time');
      } else if (post.userId === 3) {
        achievements.push('mentor', 'cultural', 'trusted', 'time');
      } else if (post.userId % 2 === 0) {
        achievements.push('mentor');
      } else if (post.userId % 3 === 0) {
        achievements.push('cultural');
      }
      
      return {
        ...post,
        achievements
      };
    });
  }, [postsData]);

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest('POST', '/api/community-posts', { content, userId: user?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
      setNewPostContent('');
      toast({
        title: 'Post created',
        description: 'Your post has been shared with the community',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return await apiRequest('POST', `/api/posts/${postId}/likes`, {});
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
      toast({
        title: 'Post liked',
        description: 'You liked this post',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to like post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      return await apiRequest('POST', `/api/posts/${postId}/comments`, { content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
      setCommentText('');
      setShowCommentInput(null);
      toast({
        title: 'Comment added',
        description: 'Your comment has been added to the post',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add comment',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    createPostMutation.mutate(newPostContent);
  };

  const handleLikePost = (postId: number) => {
    if (!user) return;
    likePostMutation.mutate(postId);
  };

  const handleAddComment = (postId: number) => {
    if (!commentText.trim() || !user) return;
    addCommentMutation.mutate({ postId, content: commentText });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Community Feed</h1>
          
          {/* Create Post Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <UserAvatar 
                  src={user.avatarUrl || undefined}
                  name={user.fullName}
                  size="md"
                />
                <div className="flex-1">
                  <Textarea
                    placeholder="Share something with the community..."
                    className="mb-3 resize-none"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Image className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() || createPostMutation.isPending}
                    >
                      {createPostMutation.isPending ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Posts Feed */}
          {isLoading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <UserAvatar 
                        src={post.userId === user.id ? (user.avatarUrl || undefined) : undefined}
                        name={post.userId === user.id ? user.fullName : 'User'}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800">
                            {post.userId === user.id ? user.fullName : 'User'}
                          </p>
                          {post.achievements && post.achievements.length > 0 && (
                            <div className="ml-2">
                              <AchievementBadges
                                achievements={post.achievements}
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {post.images.map((image, idx) => (
                          <img 
                            key={idx} 
                            src={image} 
                            alt="Post attachment" 
                            className="h-32 w-full object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-4 text-sm text-gray-500 border-t pt-3">
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>24 Likes</span>
                      </button>
                      <button 
                        className="flex items-center space-x-1"
                        onClick={() => setShowCommentInput(post.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>8 Comments</span>
                      </button>
                    </div>
                    
                    {showCommentInput === post.id && (
                      <div className="mt-4 flex items-center space-x-2">
                        <UserAvatar 
                          src={user.avatarUrl || undefined}
                          name={user.fullName}
                          size="sm"
                        />
                        <div className="flex-1 relative">
                          <Textarea
                            placeholder="Write a comment..."
                            className="pr-10 resize-none"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentText.trim() || addCommentMutation.isPending}
                          >
                            <SendHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-4">Be the first to share something with the community.</p>
            </div>
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
