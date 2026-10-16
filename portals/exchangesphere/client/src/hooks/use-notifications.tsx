import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Notification } from '@shared/schema';

const QUERY_KEY = '/api/notifications';
const UNREAD_COUNT_KEY = '/api/notifications/unread/count';

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number, e?: React.MouseEvent) => void;
  isMarkingAsRead: number | null;
  isMarkingAllAsRead: boolean;
  isDeleting: number | null;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isMarkingAsRead, setIsMarkingAsRead] = React.useState<number | null>(null);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<number | null>(null);

  // Get all notifications
  const { 
    data: notifications = [], 
    isLoading: isLoadingNotifications,
    error: notificationsError 
  } = useQuery<Notification[], Error>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const response = await fetch(QUERY_KEY);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to fetch notifications');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get unread count
  const { 
    data: unreadCountData,
    isLoading: isLoadingCount
  } = useQuery<{ count: number }, Error>({
    queryKey: [UNREAD_COUNT_KEY],
    queryFn: async () => {
      const response = await fetch(UNREAD_COUNT_KEY);
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      return response.json();
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      setIsMarkingAsRead(id);
      const response = await apiRequest('PATCH', `${QUERY_KEY}/${id}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to mark notification as read: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsMarkingAsRead(null);
    }
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      setIsMarkingAllAsRead(true);
      await apiRequest('PATCH', `${QUERY_KEY}/read-all`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to mark all notifications as read: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsMarkingAllAsRead(false);
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      setIsDeleting(id);
      await apiRequest('DELETE', `${QUERY_KEY}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_KEY] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete notification: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsDeleting(null);
    }
  });

  // Handler functions
  const markAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotification = (id: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    deleteNotificationMutation.mutate(id);
  };

  const value = {
    notifications,
    unreadCount: unreadCountData?.count || 0,
    isLoading: isLoadingNotifications || isLoadingCount,
    error: notificationsError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeleting
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}