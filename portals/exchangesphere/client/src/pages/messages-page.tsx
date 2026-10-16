import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { MobileNav } from '@/components/mobile-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { UserAvatar } from '@/components/user-avatar';
import { Message, User } from '@shared/schema';
import { Search, SendHorizontal, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type GroupedMessage = {
  userId: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
};

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    enabled: !!user,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      return await apiRequest('POST', '/api/messages', { receiverId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setMessageText('');
      toast({
        title: 'Message sent',
        description: 'Your message has been sent',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !user || !selectedContact) return;
    sendMessageMutation.mutate({ receiverId: selectedContact.id, content: messageText });
  };

  // Group messages by user to show conversation previews
  const groupedMessages = React.useMemo(() => {
    if (!messages || !user) return [];
    
    const contactsMap = new Map<number, GroupedMessage>();
    
    messages.forEach(message => {
      const contactId = message.senderId === user.id ? message.receiverId : message.senderId;
      const isFromContact = message.senderId !== user.id;
      
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          userId: contactId,
          username: 'user' + contactId, // Placeholder, would need to fetch real user data
          fullName: 'User ' + contactId, // Placeholder, would need to fetch real user data
          lastMessage: message.content,
          lastMessageTime: new Date(message.createdAt),
          unreadCount: isFromContact && !message.read ? 1 : 0
        });
      } else {
        const existing = contactsMap.get(contactId)!;
        const messageTime = new Date(message.createdAt);
        
        if (messageTime > existing.lastMessageTime) {
          existing.lastMessage = message.content;
          existing.lastMessageTime = messageTime;
        }
        
        if (isFromContact && !message.read) {
          existing.unreadCount += 1;
        }
      }
    });
    
    return Array.from(contactsMap.values()).sort((a, b) => 
      b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
    );
  }, [messages, user]);

  // Filter selected contact messages
  const contactMessages = React.useMemo(() => {
    if (!messages || !selectedContact) return [];
    
    return messages.filter(message => 
      (message.senderId === user?.id && message.receiverId === selectedContact.id) ||
      (message.receiverId === user?.id && message.senderId === selectedContact.id)
    ).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages, selectedContact, user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
          {/* Contact List */}
          <div className="w-full md:w-1/3 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-9" 
                  placeholder="Search messages" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="divide-y">
                {messagesLoading ? (
                  <div className="p-4 text-center">Loading conversations...</div>
                ) : groupedMessages.length > 0 ? (
                  groupedMessages.map(contact => (
                    <div 
                      key={contact.userId}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedContact?.id === contact.userId ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => setSelectedContact({
                        id: contact.userId,
                        username: contact.username,
                        fullName: contact.fullName,
                        avatarUrl: contact.avatarUrl,
                      } as User)}
                    >
                      <div className="flex items-center space-x-3">
                        <UserAvatar 
                          name={contact.fullName}
                          src={contact.avatarUrl}
                          size="md"
                          showStatus
                          status="online"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-800 truncate">{contact.fullName}</p>
                            <span className="text-xs text-gray-500">
                              {format(contact.lastMessageTime, 'h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                        </div>
                        {contact.unreadCount > 0 && (
                          <span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No messages yet</div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <UserAvatar 
                      name={selectedContact.fullName}
                      src={selectedContact.avatarUrl}
                      size="sm"
                      showStatus
                      status="online"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{selectedContact.fullName}</p>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {contactMessages.map(message => {
                      const isFromMe = message.senderId === user.id;
                      
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[75%] rounded-lg px-4 py-2 ${
                              isFromMe 
                                ? 'bg-primary text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>
                              {format(new Date(message.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input 
                        placeholder="Type a message..." 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                    >
                      <SendHorizontal className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Your Messages</h3>
                <p className="text-gray-500 mb-4">Select a conversation or start a new one</p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );

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
}
