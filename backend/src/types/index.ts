import { WebSocket } from 'ws';

export interface WebSocketMessage {
  type: 'VOTE' | 'JOIN' | 'LEAVE' | 'REVEAL' | 'STORY_UPDATE';
  payload: any;
}

export interface VoteMessage {
  userId: string;
  point: number;
}

export interface JoinMessage {
  userId: string;
  userName: string;
  channelId: string;
}

export interface StoryUpdateMessage {
  story: string;
}

export interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  userName: string;
  channelId: string;
}

export interface VotingSession {
  votes: { [key: string]: VoteMessage };
  isRevealed: boolean;
  participants: string[];
  story: string;
  channelId: string;
} 