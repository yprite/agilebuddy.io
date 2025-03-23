import { WebSocket } from 'ws';
import { connectionManager } from '../connection';
import { VoteMessage, JoinMessage, StoryUpdateMessage, WebSocketMessage } from '../../types';
import { channelService } from '../../services/channel';

export const handleMessage = (ws: WebSocket, data: Buffer) => {
  try {
    const message: WebSocketMessage = JSON.parse(data.toString());
    
    switch (message.type) {
      case 'VOTE':
        handleVote(ws, message.payload as VoteMessage);
        break;
      case 'JOIN':
        handleJoin(ws, message.payload as JoinMessage);
        break;
      case 'LEAVE':
        handleLeave(ws, message.payload as { userId: string });
        break;
      case 'REVEAL':
        handleReveal(ws);
        break;
      case 'STORY_UPDATE':
        handleStoryUpdate(ws, message.payload as StoryUpdateMessage);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

const handleVote = (ws: WebSocket, vote: VoteMessage) => {
  const client = connectionManager.getClient(ws);
  if (!client) return;

  channelService.updateVote(client.channelId, vote.userId, vote.point);
  connectionManager.broadcastToChannel(client.channelId, {
    type: 'VOTE',
    payload: vote
  });
};

const handleJoin = (ws: WebSocket, join: JoinMessage) => {
  const channel = channelService.getChannel(join.channelId);
  if (!channel) {
    ws.send(JSON.stringify({
      type: 'ERROR',
      payload: { message: '채널을 찾을 수 없습니다.' }
    }));
    return;
  }

  if (channelService.joinChannel(join.channelId, join)) {
    connectionManager.addClient(ws, join.userId, join.userName, join.channelId);
    connectionManager.broadcastToChannel(join.channelId, {
      type: 'JOIN',
      payload: join
    });
  }
};

const handleLeave = (ws: WebSocket, { userId }: { userId: string }) => {
  const client = connectionManager.getClient(ws);
  if (!client) return;

  channelService.leaveChannel(client.channelId, userId);
  connectionManager.removeClient(ws);
  connectionManager.broadcastToChannel(client.channelId, {
    type: 'LEAVE',
    payload: { userId }
  });
};

const handleReveal = (ws: WebSocket) => {
  const client = connectionManager.getClient(ws);
  if (!client) return;

  channelService.revealVotes(client.channelId);
  connectionManager.broadcastToChannel(client.channelId, {
    type: 'REVEAL',
    payload: {}
  });
};

const handleStoryUpdate = (ws: WebSocket, update: StoryUpdateMessage) => {
  const client = connectionManager.getClient(ws);
  if (!client) return;

  channelService.updateStory(client.channelId, update.story);
  connectionManager.broadcastToChannel(client.channelId, {
    type: 'STORY_UPDATE',
    payload: update
  });
}; 