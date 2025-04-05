
import { Vote } from './voting';

export interface JoinMessage {
    userId: string;
    userName: string;
    channelId: string;
}

export interface VotingSession {
    channelId: string;
    participants: string[];
    votes: { [key: string]: Vote };
    story: string;
    isRevealed: boolean;
}