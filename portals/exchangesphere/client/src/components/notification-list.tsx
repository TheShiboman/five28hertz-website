import React from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { Notification } from '@shared/schema';
import { formatDateTime } from '@/lib/utils';
import { Button } from './ui/button';
import { Loader2, X, ArrowRight } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface NotificationListProps {
  closePopover?: () => void;
}

export function NotificationList({ closePopover }: NotificationListProps) {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    deleteNotification,
    isMarkingAsRead,
    isDeleting
  } = useNotifications();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          closePopover={closePopover}
          isMarkingAsRead={isMarkingAsRead === notification.id}
          isDeleting={isDeleting === notification.id}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  closePopover?: () => void;
  isMarkingAsRead: boolean;
  isDeleting: boolean;
}

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete,
  closePopover,
  isMarkingAsRead,
  isDeleting
}: NotificationItemProps) {
  const handleMarkAsRead = () => {
    if (notification.read) return;
    onMarkAsRead(notification.id);
  };

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => {
    if (notification.link) {
      return (
        <Link 
          href={notification.link} 
          onClick={() => {
            handleMarkAsRead();
            if (closePopover) closePopover();
          }}
        >
          {children}
        </Link>
      );
    }

    return <>{children}</>;
  };

  return (
    <div 
      className={cn(
        "relative p-4 hover:bg-muted/40 transition-colors",
        !notification.read && "bg-muted/60"
      )}
    >
      <LinkWrapper>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-sm truncate">{notification.title}</h5>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {notification.message}
            </p>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <time dateTime={notification.createdAt.toString()}>
                {formatDateTime(new Date(notification.createdAt))}
              </time>
              {notification.link && (
                <span className="ml-2 flex items-center">
                  View <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleMarkAsRead();
                }}
                disabled={isMarkingAsRead}
                aria-label="Mark as read"
              >
                {isMarkingAsRead ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(notification.id, e);
              }}
              disabled={isDeleting}
              aria-label="Delete notification"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </LinkWrapper>
    </div>
  );
}