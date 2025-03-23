import React from 'react';
import { Box, Typography, Paper, Divider, Button, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Vote, VotingState } from '../../types/voting';

interface VoteResultProps {
  votingState: VotingState;
  onReveal: () => void;
  onReset: () => void;
}

const VoteResult: React.FC<VoteResultProps> = ({ votingState, onReveal, onReset }) => {
  const { votes, isRevealed, participants, currentUserId } = votingState;
  
  const allVoted = participants.every(participant => votes[participant]);
  const average = Object.values(votes).reduce((acc, curr) => acc + curr.point, 0) / Object.keys(votes).length || 0;

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600
          }}
        >
          투표 결과
        </Typography>
        <Box>
          {allVoted && !isRevealed && (
            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={onReveal}
              color="primary"
              sx={{ mr: 1 }}
            >
              결과 공개
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={onReset}
            color="primary"
          >
            다시 투표
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        {participants.map((participant) => (
          <Grid item xs={12} sm={6} md={4} key={participant}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: isRevealed ? 'primary.light' : 'grey.100',
                color: isRevealed ? 'white' : 'text.primary',
                borderRadius: 1,
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {participant}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {votes[participant] ? `${votes[participant].point}점` : '투표 완료'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {Object.keys(votes).length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 600
              }}
            >
              평균: {average.toFixed(1)}점
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default VoteResult; 