import { WebSocket } from 'ws';
import { ConnectedClient, WebSocketMessage } from '../types';

class ConnectionManager {
  private clients: Map<string, ConnectedClient> = new Map();

  addClient(ws: WebSocket, userId: string, userName: string) {
    this.clients.set(userId, { ws, userId, userName });
  }

  removeClient(userId: string) {
    this.clients.delete(userId);
  }

  getClient(userId: string): ConnectedClient | undefined {
    return this.clients.get(userId);
  }

  getAllClients(): ConnectedClient[] {
    return Array.from(this.clients.values());
  }

  broadcast(message: WebSocketMessage, excludeUserId?: string) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.userId !== excludeUserId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  sendToUser(userId: string, message: WebSocketMessage) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
}

export const connectionManager = new ConnectionManager(); 