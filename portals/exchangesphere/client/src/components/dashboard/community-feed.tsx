import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { CommunityPost } from '@shared/schema';
import { Link } from 'wouter';
import { Heart } from 'lucide-react';
// Create our own MessageSquare component to avoid import issues
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
import { format } from 'date-fns';

interface CommunityFeedProps {
  limit?: number;
}

export function CommunityFeed({ limit = 2 }: CommunityFeedProps) {
  const { data: posts, isLoading } = useQuery<CommunityPost[]>({
    queryKey: ['/api/community-posts'],
  });
  
  // For MVP, we'll use dummy user data for the posts
  // In a real app, we would fetch the actual user data for each post
  const dummyUsers = [
    {
      id: 1,
      fullName: 'Emma Wilson',
      username: 'emmasmith',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: 2,
      fullName: 'David Kim',
      username: 'davidkim',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];
  
  // Get user info for a post
  const getUserInfo = (userId: number) => {
    return dummyUsers.find(user => user.id === userId) || {
      id: userId,
      fullName: `User ${userId}`,
      username: `user${userId}`,
      avatarUrl: undefined
    };
  };
  
  // If no actual posts, show sample ones for UI display
  const displayPosts = (posts && posts.length > 0) ? posts.slice(0, limit) : [
    {
      id: 1,
      userId: 1,
      content: "Just completed an amazing photography session with @michael! Check out some of our shots from Golden Gate Park.",
      images: [
        "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1560762484-813fc97650a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
      ],
      createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() // 2 days ago
    },
    {
      id: 2,
      userId: 2,
      content: "I'm looking for someone who can teach me Italian cooking basics in exchange for drone photography lessons. Anyone interested?",
      images: [],
      createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString() // 4 days ago
    }
  ];
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Community Highlights</h2>
          <Link href="/community">
            <a className="text-primary hover:text-green-700 text-sm font-medium">View All</a>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading community posts...</div>
        ) : (
          <div className="space-y-6">
            {displayPosts.map((post, index) => {
              const user = getUserInfo(post.userId);
              const postDate = new Date(post.createdAt);
              const timeSince = format(postDate, 'MMM d');
              const isLastPost = index === displayPosts.length - 1;
              
              return (
                <div key={post.id} className={`${!isLastPost ? 'border-b border-gray-200 pb-6' : ''}`}>
                  <div className="flex items-center mb-3">
                    <UserAvatar
                      src={user.avatarUrl}
                      name={user.fullName}
                      size="sm"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{timeSince}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{post.content}</p>
                  
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {post.images.map((image, idx) => (
                        <img
                          key={idx}
                          className="h-32 w-full object-cover rounded-lg"
                          src={image}
                          alt="Post attachment"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.id === 1 ? '24' : '16'} Likes</span>
                    </button>
                    <button className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.id === 1 ? '8' : '12'} Comments</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
