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