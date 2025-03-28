export interface Vote {
  userId: string;
  point: number;
  timestamp: number;
}

export interface VotingState {
  votes: { [key: string]: Vote };
  isRevealed: boolean;
  participants: string[];
  currentUserId: string;
}

export type WebSocketMessage = {
  type: 'VOTE' | 'JOIN' | 'LEAVE' | 'REVEAL' | 'STORY_UPDATE' | 'ERROR' | 'RESET' | 'CHANNEL_STATE';
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

export interface VotingSession {
  channelId: string;
  participants: string[];
  votes: { [key: string]: Vote };
  story: string;
  isRevealed: boolean;
} 