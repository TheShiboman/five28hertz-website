import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/use-notifications';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from '@/components/notification-list';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface NotificationIconProps {
  className?: string;
}

export function NotificationIcon({ className }: NotificationIconProps) {
  const { unreadCount, markAllAsRead, isMarkingAllAsRead, isLoading } = useNotifications();
  const [open, setOpen] = React.useState(false);

  const hasUnread = unreadCount > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("relative", className)}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {hasUnread && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
              disabled={isMarkingAllAsRead || isLoading}
            >
              {isMarkingAllAsRead ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          <NotificationList closePopover={() => setOpen(false)} />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}