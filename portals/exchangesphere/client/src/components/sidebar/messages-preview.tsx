import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { UserAvatar } from '@/components/user-avatar';
import { useQuery } from '@tanstack/react-query';
import { Message } from '@shared/schema';
import { format } from 'date-fns';

// Custom MessageIcon component to replace lucide-react's Message
function MessageIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

// Group messages by sender to show as conversations
interface GroupedMessage {
  senderId: number;
  senderName: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: Date;
  online: boolean;
}

interface MessagesPreviewProps {
  userId: number;
}

export function MessagesPreview({ userId }: MessagesPreviewProps) {
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    enabled: !!userId,
  });
  
  // Process messages to show most recent per conversation
  const conversations = React.useMemo(() => {
    if (!messages || !userId) return [];
    
    const conversationMap = new Map<number, GroupedMessage>();
    
    messages.forEach(message => {
      // Determine if this message is from another user or from the current user
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const isFromOther = message.senderId !== userId;
      
      // Create a placeholder name based on user ID (this would be replaced with actual user data from API)
      const senderName = isFromOther ? `User ${message.senderId}` : 'You';
      
      if (!conversationMap.has(otherUserId) || 
          new Date(message.createdAt) > conversationMap.get(otherUserId)!.timestamp) {
        conversationMap.set(otherUserId, {
          senderId: otherUserId,
          senderName: senderName,
          lastMessage: message.content,
          timestamp: new Date(message.createdAt),
          online: Math.random() > 0.5, // Randomly set online status (would be from real data)
        });
      }
    });
    
    // Sort by most recent message
    return Array.from(conversationMap.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3); // Only show 3 most recent conversations
  }, [messages, userId]);
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Messages</h3>
          <Link href="/messages">
            <a className="text-primary hover:text-green-700 text-sm font-medium">See All</a>
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="py-3 text-center text-sm text-gray-500">Loading messages...</div>
          ) : conversations.length > 0 ? (
            conversations.map((convo) => (
              <div key={convo.senderId} className="py-3 flex items-center space-x-3">
                <div className="relative">
                  <UserAvatar
                    name={convo.senderName}
                    src={convo.avatarUrl}
                    size="md"
                    showStatus
                    status={convo.online ? "online" : "offline"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{convo.senderName}</p>
                  <p className="text-xs text-gray-500 truncate">{convo.lastMessage}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {format(convo.timestamp, 'h:mm a')}
                </div>
              </div>
            ))
          ) : (
            <div className="py-3 text-center text-sm text-gray-500">No messages yet</div>
          )}
        </div>
        
        <Link href="/messages">
          <a className="w-full">
            <Button className="mt-4 w-full">
              <MessageIcon className="h-5 w-5 mr-2" />
              New Message
            </Button>
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}
