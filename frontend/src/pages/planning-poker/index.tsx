import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import StoryInput from '../../components/planning-poker/StoryInput';
import PointEstimation from '../../components/planning-poker/PointEstimation';
import VoteResult from '../../components/planning-poker/VoteResult';
import { VotingState, Vote, WebSocketMessage } from '../../types/voting';
import { websocketService } from '../../services/websocket';

const PlanningPoker: React.FC = () => {
  const [story, setStory] = useState<string>('');
  const [votingState, setVotingState] = useState<VotingState>({
    votes: {},
    isRevealed: false,
    participants: [],
    currentUserId: `user_${Math.random().toString(36).substr(2, 9)}`
  });

  useEffect(() => {
    // WebSocket 연결
    websocketService.connect();

    // 세션 참가
    websocketService.joinSession({
      userId: votingState.currentUserId,
      userName: `참가자 ${votingState.currentUserId.slice(-4)}`
    });

    // 메시지 핸들러 등록
    const unsubscribe = websocketService.subscribe((message: WebSocketMessage) => {
      switch (message.type) {
        case 'VOTE':
          setVotingState(prev => ({
            ...prev,
            votes: {
              ...prev.votes,
              [message.payload.userId]: {
                userId: message.payload.userId,
                point: message.payload.point,
                timestamp: Date.now()
              }
            }
          }));
          break;
        case 'JOIN':
          setVotingState(prev => ({
            ...prev,
            participants: [...prev.participants, message.payload.userId]
          }));
          break;
        case 'LEAVE':
          setVotingState(prev => ({
            ...prev,
            participants: prev.participants.filter(id => id !== message.payload.userId)
          }));
          break;
        case 'REVEAL':
          setVotingState(prev => ({
            ...prev,
            isRevealed: true
          }));
          break;
        case 'STORY_UPDATE':
          setStory(message.payload.story);
          break;
      }
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      unsubscribe();
      websocketService.leaveSession(votingState.currentUserId);
      websocketService.disconnect();
    };
  }, []);

  const handleVote = (point: number) => {
    websocketService.sendVote({
      userId: votingState.currentUserId,
      point
    });
  };

  const handleReveal = () => {
    websocketService.revealVotes();
  };

  const handleStoryChange = (newStory: string) => {
    setStory(newStory);
    websocketService.updateStory(newStory);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            color: 'primary.main',
            fontWeight: 600
          }}
        >
          Planning Poker
        </Typography>

        <StoryInput 
          story={story}
          onStoryChange={handleStoryChange}
        />

        <Box sx={{ my: 4 }}>
          <PointEstimation 
            onVote={handleVote}
            hasVoted={!!votingState.votes[votingState.currentUserId]}
            selectedPoint={votingState.votes[votingState.currentUserId]?.point}
          />
        </Box>

        <VoteResult 
          votingState={votingState}
          onReveal={handleReveal}
        />
      </Box>
    </Container>
  );
};

export default PlanningPoker; 