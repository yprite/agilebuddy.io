import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface PointEstimationProps {
  onVote: (point: number) => void;
  hasVoted: boolean;
  selectedPoint?: number;
}

const points = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];
const COUNTDOWN_SECONDS = 5;

const PointEstimation: React.FC<PointEstimationProps> = ({ onVote, hasVoted, selectedPoint }) => {
  const [countdown, setCountdown] = useState<number>(0);
  const [canChangeVote, setCanChangeVote] = useState<boolean>(true);

  // 타이머 카운트다운
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
        if (countdown === 1) {
          setCanChangeVote(false);
        }
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

  const handleVote = (point: number) => {
    console.log('PointEstimation handleVote called with point:', point);
    onVote(point);
    // 투표할 때마다 타이머 시작
    setCountdown(COUNTDOWN_SECONDS);
    setCanChangeVote(true);
  };

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
          textAlign: 'center',
          mb: 3
        }}
      >
        포인트 추정
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {points.map((point) => (
          <Grid item key={point}>
            <Button
              variant={selectedPoint === point ? "contained" : "outlined"}
              onClick={() => {
                console.log('Button clicked with point:', point);
                handleVote(point);
              }}
              disabled={hasVoted && !canChangeVote}
              sx={{
                minWidth: '80px',
                height: '80px',
                borderRadius: '50%',
                fontSize: '1.5rem',
                fontWeight: 600,
                position: 'relative',
                backgroundColor: selectedPoint === point ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedPoint === point ? 'primary.dark' : 'primary.light',
                }
              }}
            >
              {point}
              {hasVoted && selectedPoint === point && (
                <CheckCircle 
                  sx={{ 
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    color: 'success.main'
                  }} 
                />
              )}
            </Button>
          </Grid>
        ))}
      </Grid>

      {hasVoted && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: countdown > 0 ? 'warning.main' : 'success.main',
              fontWeight: 500
            }}
          >
            {countdown > 0 
              ? `${countdown}초 후에 투표가 확정됩니다` 
              : '투표가 확정되었습니다'}
          </Typography>
          {countdown > 0 && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                mt: 1
              }}
            >
              다른 점수로 변경할 수 있습니다
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default PointEstimation; 