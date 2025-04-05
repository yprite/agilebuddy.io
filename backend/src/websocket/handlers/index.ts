import { WebSocket } from 'ws';
import { connectionManager } from '../connection';
import { VoteMessage, JoinMessage, StoryUpdateMessage, WebSocketMessage } from '../../types';
import { channelService } from '../../services/channel';
import { clickupService } from '../../services/clickup';

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
      case 'RESET':
        handleReset(ws);
        break;
      case 'FETCH_SPRINT_TASKS':
        handleFetchSprintTasks(ws, message.payload as { folderId: string });
        break;
      case 'FETCH_TASK':
        handleFetchTask(ws, message.payload as { taskId: string });
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

const handleVote = (ws: WebSocket, vote: VoteMessage) => {
  console.log('handleVote called with:', vote);
  const client = connectionManager.getClient(ws);
  console.log('Found client:', client);
  
  if (!client) {
    console.log('No client found for WebSocket');
    return;
  }

  console.log('Updating vote for channel:', client.channelId);
  channelService.updateVote(client.channelId, vote.userId, vote.point);
  
  console.log('Broadcasting vote to channel:', client.channelId);
  connectionManager.broadcastToChannel(client.channelId, {
    type: 'VOTE',
    payload: vote
  });

  // 모든 참가자가 투표를 완료했는지 확인
  const channel = channelService.getChannel(client.channelId);
  if (channel) {
    const allVoted = channel.participants.every(participant => channel.votes[participant]);
    if (allVoted) {
      console.log('All participants have voted, revealing results');
      handleReveal(ws);
    }
  }
};

const handleJoin = (ws: WebSocket, join: JoinMessage) => {
  let channel = channelService.getChannel(join.channelId);
  
  // 채널이 없으면 새로 생성
  if (!channel) {
    channel = channelService.createChannel(join.userName, join.channelId);
  }

  if (channelService.joinChannel(join.channelId, join)) {
    connectionManager.addClient(ws, join.userId, join.userName, join.channelId);
    
    // 새로 참가하는 클라이언트에게 현재 채널의 상태 전송
    ws.send(JSON.stringify({
      type: 'CHANNEL_STATE',
      payload: {
        participants: channel.participants,
        votes: channel.votes,
        story: channel.story,
        isRevealed: channel.isRevealed
      }
    }));

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

const handleReset = (ws: WebSocket) => {
  const client = connectionManager.getClient(ws);
  if (!client) return;

  channelService.resetChannel(client.channelId);
  connectionManager.broadcastToChannel(client.channelId, {
    type: 'RESET',
    payload: {}
  });
};

const handleFetchSprintTasks = async (ws: WebSocket, payload: { folderId: string }) => {
  try {
    const tasks = await clickupService.getSprintTasks(payload.folderId);
    const client = connectionManager.getClient(ws);
    if (client) {
      connectionManager.sendToUser(client.userId, {
        type: 'SPRINT_TASKS',
        payload: tasks
      });
    }
  } catch (error) {
    console.error('Error fetching sprint tasks:', error);
    const client = connectionManager.getClient(ws);
    if (client) {
      connectionManager.sendToUser(client.userId, {
        type: 'ERROR',
        payload: { message: 'Failed to fetch sprint tasks' }
      });
    }
  }
};

const handleFetchTask = async (ws: WebSocket, payload: { taskId: string }) => {
  try {
    const task = await clickupService.getTask(payload.taskId);
    const client = connectionManager.getClient(ws);
    if (client) {
      connectionManager.sendToUser(client.userId, {
        type: 'TASK_DETAILS',
        payload: task
      });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    const client = connectionManager.getClient(ws);
    if (client) {
      connectionManager.sendToUser(client.userId, {
        type: 'ERROR',
        payload: { message: 'Failed to fetch task details' }
      });
    }
  }
};