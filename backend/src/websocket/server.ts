import { WebSocketServer, WebSocket } from 'ws';
import { handleMessage } from './handlers';
import { connectionManager } from './connection';
import { ConnectedClient } from '../types';

const wss = new WebSocketServer({ port: 3001 });

console.log('WebSocket server is running on port 3001');

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (data: Buffer) => handleMessage(ws, data));

  ws.on('close', () => {
    console.log('Client disconnected');
    const clients = connectionManager.getAllClients();
    const disconnectedClient = clients.find((client) => client.ws === ws);
    
    if (disconnectedClient) {
      connectionManager.broadcastToChannel(disconnectedClient.channelId, {
        type: 'LEAVE',
        payload: { userId: disconnectedClient.userId }
      });
      connectionManager.removeClient(ws);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}); 