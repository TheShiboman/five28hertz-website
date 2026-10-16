import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { InsertMessage } from '@shared/schema';
import { useWebSocketContext } from '@/hooks/use-websocket';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Send, 
  User, 
  Search, 
  MoreVertical, 
  Check 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Extending the Message interface with sender and receiver details
interface MessageWithDetails {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean | null;
  createdAt: Date | string | null;
  sender?: {
    id: number;
    fullName?: string;
    username?: string;
  };
  receiver?: {
    id: number;
    fullName?: string;
    username?: string;
  };
}

interface Contact {
  id: number;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string | null;
  unreadCount: number;
  avatar?: string;
  role?: string;
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Helper to format date
const formatMessageTime = (dateString: string | Date | null): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    isConnected,
    sendMessage,
    markMessageAsRead,
    on,
    off
  } = useWebSocketContext();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages
  const { 
    data: messages = [], 
    isLoading,
    refetch: refetchMessages
  } = useQuery<MessageWithDetails[]>({
    queryKey: ['/api/messages'],
  });

  // Group messages by contact
  const contactsMap = new Map<number, Contact>();
  
  messages.forEach(message => {
    // Determine if the message is sent or received
    const isSender = message.senderId === user?.id;
    const contactId = isSender ? message.receiverId : message.senderId;
    const contactInfo = isSender ? message.receiver : message.sender;
    
    if (!contactInfo) return;
    
    // Create or update contact info
    if (!contactsMap.has(contactId)) {
      contactsMap.set(contactId, {
        id: contactId,
        name: contactInfo.fullName || contactInfo.username || `User #${contactId}`,
        lastMessage: message.content,
        lastMessageTime: formatMessageTime(message.createdAt),
        unreadCount: (!isSender && !message.isRead) ? 1 : 0,
      });
    } else {
      const contact = contactsMap.get(contactId)!;
      const messageTime = message.createdAt ? new Date(message.createdAt).getTime() : 0;
      const lastMessageTime = (contact.lastMessageTime && contact.lastMessageTime !== '') 
        ? new Date(contact.lastMessageTime).getTime() 
        : 0;
      
      // Update if this message is newer
      if (!lastMessageTime || messageTime > lastMessageTime) {
        contact.lastMessage = message.content;
        contact.lastMessageTime = formatMessageTime(message.createdAt);
      }
      
      // Increment unread count
      if (!isSender && !message.isRead) {
        contact.unreadCount += 1;
      }
    }
  });
  
  // Convert to array and sort by last message time (most recent first)
  const contacts = Array.from(contactsMap.values())
    .sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return b.lastMessageTime.localeCompare(a.lastMessageTime);
    });
  
  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get conversation between current user and selected contact
  const conversation = selectedContact 
    ? messages.filter(msg => 
        (msg.senderId === user?.id && msg.receiverId === selectedContact.id) ||
        (msg.receiverId === user?.id && msg.senderId === selectedContact.id)
      ).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      })
    : [];
  
  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      await apiRequest("PUT", `/api/messages/${messageId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: InsertMessage) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return res.json();
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      refetchMessages();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedContact) {
      conversation.forEach(message => {
        if (message.receiverId === user?.id && !message.isRead) {
          if (isConnected) {
            // Use WebSocket for real-time read receipts
            markMessageAsRead(message.id);
          } else {
            // Fallback to REST API
            markAsReadMutation.mutate(message.id);
          }
        }
      });
    }
  }, [selectedContact, conversation]);

  // WebSocket event handlers for real-time messaging
  useEffect(() => {
    // Handle new messages received via WebSocket
    const handleNewMessage = (message: any) => {
      // Refresh messages after receiving a new one
      refetchMessages();
      
      // Auto-scroll to bottom when new message arrives
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    
    // Handle message read status updates
    const handleMessageRead = (messageId: number) => {
      // Refresh messages to update read status
      refetchMessages();
    };
    
    // Register event listeners
    on('newMessage', handleNewMessage);
    on('messageRead', handleMessageRead);
    
    // Clean up listeners on unmount
    return () => {
      off('newMessage', handleNewMessage);
      off('messageRead', handleMessageRead);
    };
  }, [on, off, refetchMessages]);

  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    // If WebSocket is connected, use it for real-time messages
    if (isConnected && user) {
      sendMessage(selectedContact.id, newMessage);
      setNewMessage('');
    } else {
      // Fallback to REST API
      sendMessageMutation.mutate({
        senderId: user?.id as number,
        receiverId: selectedContact.id,
        content: newMessage,
        isRead: false,
      });
    }
  };

  // Handle selecting a contact
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Handle creating a new message
  const handleNewConversation = () => {
    toast({
      title: "New Conversation",
      description: "User selection modal will be implemented soon.",
    });
  };

  return (
    <SidebarLayout>
      <div className="h-full flex flex-col">
        <div className="px-4 sm:px-6 lg:px-8 py-4 border-b">
          <h1 className="text-2xl font-semibold text-charcoal">Messages</h1>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-80 border-r bg-white flex flex-col">
            <div className="p-4 border-b">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full text-sm" 
                onClick={handleNewConversation}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> New Conversation
              </Button>
            </div>
            
            <Tabs defaultValue="all" className="flex flex-col flex-1">
              <TabsList className="grid w-full grid-cols-2 px-2 py-2 border-b">
                <TabsTrigger value="all">All Messages</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="flex-1">
                <TabsContent value="all" className="m-0">
                  {isLoading ? (
                    <div className="p-4 space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 animate-pulse">
                          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="font-medium text-gray-900 mb-1">No messages</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {searchQuery 
                          ? "No contacts match your search" 
                          : "Start a conversation with property owners or vendors"}
                      </p>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={handleNewConversation}
                      >
                        Start Conversation
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {filteredContacts.map((contact) => (
                        <div 
                          key={contact.id}
                          className={`p-3 flex items-start cursor-pointer hover:bg-gray-50 ${
                            selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                          }`}
                          onClick={() => handleSelectContact(contact)}
                        >
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-blue-500 text-white">
                              {getInitials(contact.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900 truncate">
                                {contact.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {contact.lastMessageTime}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {contact.lastMessage}
                            </p>
                          </div>
                          {contact.unreadCount > 0 && (
                            <Badge className="ml-2 bg-blue-500">{contact.unreadCount}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="unread" className="m-0">
                  {filteredContacts.filter(c => c.unreadCount > 0).length === 0 ? (
                    <div className="p-8 text-center">
                      <Check className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="font-medium text-gray-900 mb-1">No unread messages</h3>
                      <p className="text-gray-500 text-sm">
                        You're all caught up!
                      </p>
                    </div>
                  ) : (
                    <div>
                      {filteredContacts
                        .filter(c => c.unreadCount > 0)
                        .map((contact) => (
                          <div 
                            key={contact.id}
                            className={`p-3 flex items-start cursor-pointer hover:bg-gray-50 ${
                              selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => handleSelectContact(contact)}
                          >
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="bg-blue-500 text-white">
                                {getInitials(contact.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 flex-1 overflow-hidden">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-900 truncate">
                                  {contact.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {contact.lastMessageTime}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {contact.lastMessage}
                              </p>
                            </div>
                            <Badge className="ml-2 bg-blue-500">{contact.unreadCount}</Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Conversation Area */}
          <div className="hidden md:flex flex-col flex-1 bg-gray-50">
            {selectedContact ? (
              <>
                {/* Conversation Header */}
                <div className="py-3 px-4 flex items-center justify-between bg-white border-b">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {getInitials(selectedContact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedContact.role || 'Last active: 2m ago'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Clear Conversation</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Block Contact</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {conversation.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="font-medium text-gray-900 mb-1">No messages yet</h3>
                        <p className="text-gray-500 text-sm">
                          Start the conversation with {selectedContact.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.map((message) => {
                        const isSentByMe = message.senderId === user?.id;
                        
                        return (
                          <div 
                            key={message.id} 
                            className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isSentByMe && (
                              <Avatar className="h-8 w-8 mr-2 flex-shrink-0 self-end">
                                <AvatarFallback className="bg-blue-500 text-white">
                                  {getInitials(selectedContact.name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div 
                              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                isSentByMe 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-white text-gray-800 border border-gray-200'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div 
                                className={`text-xs mt-1 ${
                                  isSentByMe ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {formatMessageTime(message.createdAt)}
                                {isSentByMe && (
                                  <span className="ml-2">
                                    {message.isRead ? (
                                      <>
                                        <Check className="inline h-3 w-3" />
                                        <Check className="inline h-3 w-3 -ml-1" />
                                      </>
                                    ) : (
                                      <Check className="inline h-3 w-3" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 bg-white border-t">
                  <div className="flex items-center">
                    <Input
                      placeholder="Type a message..."
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="ml-2 bg-blue-500 hover:bg-blue-600"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-sm mx-auto p-8">
                  <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-10 w-10 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Messages</h2>
                  <p className="text-gray-500 mb-6">
                    Select a conversation from the sidebar or start a new conversation with property owners or vendors.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleNewConversation}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Start a Conversation
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile "No Selection" screen */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 md:hidden">
            <div className="text-center p-8">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-500 mb-2 text-sm">
                Choose from your existing conversations or start a new one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Messages;
