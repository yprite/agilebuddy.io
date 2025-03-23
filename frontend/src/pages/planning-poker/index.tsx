import React, { useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import StoryCard from '../../components/planning-poker/StoryCard';
import PointSelector from '../../components/planning-poker/PointSelector';
import VoteResult from '../../components/planning-poker/VoteResult';

const PlanningPoker: React.FC = () => {
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [selectedPoint, setSelectedPoint] = useState<number>();

  const handlePointSelect = (point: number) => {
    setSelectedPoint(point);
    setVotes(prev => ({
      ...prev,
      '현재 사용자': point
    }));
  };

  const average = Object.values(votes).reduce((acc, curr) => acc + curr, 0) / Object.keys(votes).length || 0;

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            스토리 포인트 산정
          </Typography>
          <Typography variant="body1" color="text.secondary">
            스토리를 읽고 적절한 포인트를 선택해주세요
          </Typography>
        </Paper>

        <StoryCard
          title="샘플 스토리"
          description="이것은 스토리 포인트 산정을 위한 샘플 스토리입니다."
        />
        <PointSelector
          onSelect={handlePointSelect}
          selectedPoint={selectedPoint}
        />
        <VoteResult
          votes={votes}
          average={average}
        />
      </Box>
    </Container>
  );
};

export default PlanningPoker; 