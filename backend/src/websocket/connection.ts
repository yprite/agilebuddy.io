import { WebSocket } from 'ws';
import { ConnectedClient, WebSocketMessage } from '../types';

class ConnectionManager {
  private clients: Map<WebSocket, Omit<ConnectedClient, 'ws'>> = new Map();

  addClient(ws: WebSocket, userId: string, userName: string, channelId: string) {
    this.clients.set(ws, { userId, userName, channelId });
  }

  removeClient(ws: WebSocket) {
    this.clients.delete(ws);
  }

  getClient(ws: WebSocket): (Omit<ConnectedClient, 'ws'> & { ws: WebSocket }) | undefined {
    const client = this.clients.get(ws);
    if (client) {
      return { ...client, ws };
    }
    return undefined;
  }

  getAllClients(): (Omit<ConnectedClient, 'ws'> & { ws: WebSocket })[] {
    return Array.from(this.clients.entries()).map(([ws, client]) => ({
      ...client,
      ws
    }));
  }

  getClientsByChannel(channelId: string): WebSocket[] {
    return Array.from(this.clients.entries())
      .filter(([_, client]) => client.channelId === channelId)
      .map(([ws]) => ws);
  }

  broadcastToChannel(channelId: string, message: WebSocketMessage) {
    const channelClients = this.getClientsByChannel(channelId);
    const messageStr = JSON.stringify(message);

    channelClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  broadcast(message: WebSocketMessage) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((_, ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
      }
    });
  }

  sendToUser(userId: string, message: WebSocketMessage) {
    for (const [ws, client] of this.clients.entries()) {
      if (client.userId === userId && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        break;
      }
    }
  }
}

export const connectionManager = new ConnectionManager(); 