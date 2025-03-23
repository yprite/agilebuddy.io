import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

interface VoteResultProps {
  votes: { [key: string]: number };
  average: number;
}

const VoteResult: React.FC<VoteResultProps> = ({ votes, average }) => {
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'primary.main',
          fontWeight: 600,
          mb: 2
        }}
      >
        투표 결과
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2,
        mb: 3
      }}>
        {Object.entries(votes).map(([voter, point]) => (
          <Paper
            key={voter}
            sx={{
              p: 1.5,
              backgroundColor: 'primary.light',
              color: 'white',
              borderRadius: 1,
              minWidth: '120px',
              textAlign: 'center'
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {voter}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {point}점
            </Typography>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ 
        textAlign: 'center',
        mt: 2
      }}>
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
    </Paper>
  );
};

export default VoteResult; 