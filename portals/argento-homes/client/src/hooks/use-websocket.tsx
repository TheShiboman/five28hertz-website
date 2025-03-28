import { useEffect, useState } from 'react';
import { websocketService, WebSocketResponse } from '@/lib/websocket-service';
import { useAuth } from '@/hooks/use-auth';

export function useWebSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketResponse | null>(null);
  
  useEffect(() => {
    // Connect to WebSocket server when component mounts
    websocketService.connect();
    
    const handleOpen = () => {
      setIsConnected(true);
    };
    
    const handleClose = () => {
      setIsConnected(false);
      setIsAuthenticated(false);
    };
    
    const handleMessage = (message: WebSocketResponse) => {
      setLastMessage(message);
      
      if (message.type === 'auth_success') {
        setIsAuthenticated(true);
      }
    };
    
    // Register WebSocket event listeners
    websocketService.on('open', handleOpen);
    websocketService.on('close', handleClose);
    websocketService.on('message', handleMessage);
    
    // Authenticate with WebSocket server if user is logged in
    if (user) {
      websocketService.authenticate(user.id);
    }
    
    // Cleanup on component unmount
    return () => {
      websocketService.off('open', handleOpen);
      websocketService.off('close', handleClose);
      websocketService.off('message', handleMessage);
    };
  }, [user]);
  
  return {
    isConnected,
    isAuthenticated,
    lastMessage,
    sendMessage: websocketService.sendMessage.bind(websocketService),
    markMessageAsRead: websocketService.markMessageAsRead.bind(websocketService),
    // Expose other methods as needed
    on: websocketService.on.bind(websocketService),
    off: websocketService.off.bind(websocketService),
  };
}

// Create a WebSocket context provider for global usage
import { createContext, ReactNode, useContext } from 'react';

type WebSocketContextType = ReturnType<typeof useWebSocket>;

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const websocket = useWebSocket();
  
  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}