import { WebSocketServer, WebSocket } from 'ws';
import { handleMessage } from './handlers';
import { connectionManager } from './connection';
import { ConnectedClient } from '../types';

interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
}

const wss = new WebSocketServer({ 
  port: 3001,
  maxPayload: 10 * 1024 * 1024 // 10MB
});

console.log('WebSocket server is running on port 3001');

wss.on('connection', (ws: ExtendedWebSocket) => {
  console.log('Client connected');

  // 연결 유지를 위한 ping/pong 설정
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

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

// 연결 유지를 위한 ping 체크
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const extendedWs = ws as ExtendedWebSocket;
    if (extendedWs.isAlive === false) {
      console.log('Terminating inactive connection');
      return extendedWs.terminate();
    }
    extendedWs.isAlive = false;
    extendedWs.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
}); 