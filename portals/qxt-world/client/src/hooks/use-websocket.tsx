import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        toast({
          title: "Connected to server",
          description: "Real-time scoring is now active",
        });
      };

      socketRef.current.onclose = () => {
        toast({
          title: "Disconnected from server",
          description: "Real-time scoring is temporarily unavailable",
          variant: "destructive",
        });

        // Try to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection error",
          description: "Failed to connect to scoring server",
          variant: "destructive",
        });
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      toast({
        title: "Connection lost",
        description: "Unable to update score. Trying to reconnect...",
        variant: "destructive",
      });
      connect();
    }
  };

  const subscribeToScore = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SCORE_UPDATED') {
            callback(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }
  };

  return {
    sendMessage,
    subscribeToScore,
  };
}