import { WebSocket } from 'ws';
import { WebSocketMessage, VoteMessage, JoinMessage, StoryUpdateMessage } from '../../types';
import { connectionManager } from '../connection';

export function handleMessage(ws: WebSocket, data: Buffer) {
  try {
    const message: WebSocketMessage = JSON.parse(data.toString());

    switch (message.type) {
      case 'VOTE':
        handleVote(message.payload as VoteMessage);
        break;
      case 'JOIN':
        handleJoin(ws, message.payload as JoinMessage);
        break;
      case 'LEAVE':
        handleLeave(message.payload.userId);
        break;
      case 'REVEAL':
        handleReveal();
        break;
      case 'STORY_UPDATE':
        handleStoryUpdate(message.payload as StoryUpdateMessage);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

function handleVote(vote: VoteMessage) {
  connectionManager.broadcast({
    type: 'VOTE',
    payload: vote
  });
}

function handleJoin(ws: WebSocket, join: JoinMessage) {
  connectionManager.addClient(ws, join.userId, join.userName);
  connectionManager.broadcast({
    type: 'JOIN',
    payload: join
  });
}

function handleLeave(userId: string) {
  connectionManager.removeClient(userId);
  connectionManager.broadcast({
    type: 'LEAVE',
    payload: { userId }
  });
}

function handleReveal() {
  connectionManager.broadcast({
    type: 'REVEAL',
    payload: {}
  });
}

function handleStoryUpdate(update: StoryUpdateMessage) {
  connectionManager.broadcast({
    type: 'STORY_UPDATE',
    payload: update
  });
} 