import { User } from "@shared/schema";

// WebSocket message types
export type WebSocketAuthMessage = {
  type: 'auth';
  userId: number;
};

export type WebSocketNewMessage = {
  type: 'new_message';
  receiverId: number;
  content: string;
};

export type WebSocketMarkRead = {
  type: 'mark_read';
  messageId: number;
};

export type WebSocketMessage = 
  | WebSocketAuthMessage
  | WebSocketNewMessage
  | WebSocketMarkRead;

export type WebSocketAuthSuccessResponse = {
  type: 'auth_success';
  userId: number;
};

export type WebSocketErrorResponse = {
  type: 'error';
  message: string;
};

export type WebSocketMessageSentResponse = {
  type: 'message_sent';
  message: any; // Message with details
};

export type WebSocketNewMessageResponse = {
  type: 'new_message';
  message: any; // Message with details
};

export type WebSocketMessageReadResponse = {
  type: 'message_read';
  messageId: number;
};

export type WebSocketMarkReadStatusResponse = {
  type: 'mark_read_status';
  success: boolean;
  messageId: number;
};

export type WebSocketResponse = 
  | WebSocketAuthSuccessResponse
  | WebSocketErrorResponse
  | WebSocketMessageSentResponse
  | WebSocketNewMessageResponse
  | WebSocketMessageReadResponse
  | WebSocketMarkReadStatusResponse;

// WebSocket event callbacks
export type WebSocketEventMap = {
  open: () => void;
  close: () => void;
  error: (error: Event) => void;
  message: (message: WebSocketResponse) => void;
  newMessage: (message: any) => void;  // New message received
  messageSent: (message: any) => void; // Message sent confirmation
  messageRead: (messageId: number) => void; // Message marked as read
};

export class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private isAuthenticated = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventListeners: Partial<Record<keyof WebSocketEventMap, Array<(...args: any[]) => void>>> = {};
  private userId: number | null = null;
  
  constructor() {
    this.eventListeners = {
      open: [],
      close: [],
      error: [],
      message: [],
      newMessage: [],
      messageSent: [],
      messageRead: []
    };
  }
  
  // Connect to the WebSocket server
  connect() {
    if (this.socket) {
      return;
    }
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log('[WebSocket] Connection established');
      this.isConnected = true;
      this.eventListeners.open?.forEach(listener => listener());
      
      // Authenticate if userId is available
      if (this.userId) {
        this.authenticate(this.userId);
      }
    };
    
    this.socket.onclose = () => {
      console.log('[WebSocket] Connection closed');
      this.isConnected = false;
      this.isAuthenticated = false;
      this.socket = null;
      
      this.eventListeners.close?.forEach(listener => listener());
      
      // Attempt to reconnect after a delay
      this.reconnectTimeout = setTimeout(() => {
        if (this.userId) {
          this.connect();
        }
      }, 5000);
    };
    
    this.socket.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      this.eventListeners.error?.forEach(listener => listener(error));
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketResponse;
        console.log('[WebSocket] Received:', data);
        
        // Dispatch general message event
        this.eventListeners.message?.forEach(listener => listener(data));
        
        // Handle specific message types
        switch (data.type) {
          case 'auth_success':
            this.isAuthenticated = true;
            break;
            
          case 'new_message':
            this.eventListeners.newMessage?.forEach(listener => listener(data.message));
            break;
            
          case 'message_sent':
            this.eventListeners.messageSent?.forEach(listener => listener(data.message));
            break;
            
          case 'message_read':
            this.eventListeners.messageRead?.forEach(listener => listener(data.messageId));
            break;
            
          case 'error':
            console.error('[WebSocket] Error from server:', data.message);
            break;
        }
      } catch (error) {
        console.error('[WebSocket] Error parsing message:', error);
      }
    };
  }
  
  // Disconnect from the WebSocket server
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket && this.isConnected) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.isAuthenticated = false;
      this.userId = null;
    }
  }
  
  // Authenticate with the WebSocket server
  authenticate(userId: number) {
    this.userId = userId;
    
    if (!this.isConnected) {
      this.connect();
      return;
    }
    
    this.send({
      type: 'auth',
      userId,
    });
  }
  
  // Send a message to another user
  sendMessage(receiverId: number, content: string) {
    if (!this.isAuthenticated) {
      console.error('[WebSocket] Not authenticated');
      return;
    }
    
    this.send({
      type: 'new_message',
      receiverId,
      content,
    });
  }
  
  // Mark a message as read
  markMessageAsRead(messageId: number) {
    if (!this.isAuthenticated) {
      console.error('[WebSocket] Not authenticated');
      return;
    }
    
    this.send({
      type: 'mark_read',
      messageId,
    });
  }
  
  // Send a message to the WebSocket server
  private send(message: WebSocketMessage) {
    if (!this.socket || !this.isConnected) {
      console.error('[WebSocket] Not connected');
      return;
    }
    
    this.socket.send(JSON.stringify(message));
  }
  
  // Add an event listener
  on<T extends keyof WebSocketEventMap>(event: T, listener: WebSocketEventMap[T]) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    
    this.eventListeners[event]!.push(listener as any);
  }
  
  // Remove an event listener
  off<T extends keyof WebSocketEventMap>(event: T, listener: WebSocketEventMap[T]) {
    if (!this.eventListeners[event]) {
      return;
    }
    
    const index = this.eventListeners[event]!.indexOf(listener as any);
    if (index !== -1) {
      this.eventListeners[event]!.splice(index, 1);
    }
  }
}

// Singleton instance
export const websocketService = new WebSocketService();