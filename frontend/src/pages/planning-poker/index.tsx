import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import StoryInput from '../../components/planning-poker/StoryInput';
import PointEstimation from '../../components/planning-poker/PointEstimation';
import VoteResult from '../../components/planning-poker/VoteResult';
import { VotingState, Vote } from '../../types/voting';

const PlanningPoker: React.FC = () => {
  const [story, setStory] = useState<string>('');
  const [votingState, setVotingState] = useState<VotingState>({
    votes: {},
    isRevealed: false,
    participants: ['참가자 1', '참가자 2', '참가자 3'],
    currentUserId: '참가자 1'
  });

  const handleVote = (point: number) => {
    setVotingState(prev => ({
      ...prev,
      votes: {
        ...prev.votes,
        [prev.currentUserId]: { 
          userId: prev.currentUserId,
          point,
          timestamp: Date.now()
        }
      }
    }));
  };

  const handleReveal = () => {
    setVotingState(prev => ({
      ...prev,
      isRevealed: true
    }));
  };

  const currentVote = votingState.votes[votingState.currentUserId];
  const selectedPoint = currentVote?.point;

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
          onStoryChange={setStory}
        />

        <Box sx={{ my: 4 }}>
          <PointEstimation 
            onVote={handleVote}
            hasVoted={!!currentVote}
            selectedPoint={selectedPoint}
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