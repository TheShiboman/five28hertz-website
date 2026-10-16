import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';
import type { Match } from '@shared/schema';

interface ScoreUpdate {
  type: 'SCORE_UPDATE';
  matchId: number;
  score1: number;
  score2: number;
  frameNumber: number;
  status: Match['status'];
}

class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, { userId?: number }> = new Map();

  constructor(server: ReturnType<typeof createServer>) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      // Add new client
      this.clients.set(ws, {});

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'IDENTIFY') {
            this.clients.set(ws, { userId: data.userId });
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });
  }

  broadcastScoreUpdate(update: ScoreUpdate) {
    const message = JSON.stringify(update);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export let wsService: WebSocketService;

export function initializeWebSocket(server: ReturnType<typeof createServer>) {
  wsService = new WebSocketService(server);
  return wsService;
}
