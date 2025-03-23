import { WebSocket } from 'ws';

export type WebSocketMessage = {
  type: 'VOTE' | 'JOIN' | 'LEAVE' | 'REVEAL' | 'STORY_UPDATE' | 'ERROR' | 'RESET';
  payload: any;
};

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

export interface Vote {
  userId: string;
  point: number;
  timestamp: number;
}

export interface Channel {
  id: string;
  name: string;
  participants: string[];
  votes: { [key: string]: Vote };
  story: string;
  isRevealed: boolean;
  createdAt: number;
}

export interface VotingSession {
  channelId: string;
  participants: string[];
  votes: { [key: string]: Vote };
  story: string;
  isRevealed: boolean;
}

export interface ConnectedClient {
  userId: string;
  userName: string;
  channelId: string;
} 