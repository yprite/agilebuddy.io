import { WebSocketServer } from 'ws';
import { handleMessage } from './handlers';
import { connectionManager } from './connection';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    handleMessage(ws, data);
  });

  ws.on('close', () => {
    // 연결이 종료된 클라이언트 찾기
    const clients = connectionManager.getAllClients();
    const disconnectedClient = clients.find(client => client.ws === ws);
    
    if (disconnectedClient) {
      connectionManager.removeClient(disconnectedClient.userId);
      connectionManager.broadcast({
        type: 'LEAVE',
        payload: { userId: disconnectedClient.userId }
      });
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket Server running on port 3001'); 