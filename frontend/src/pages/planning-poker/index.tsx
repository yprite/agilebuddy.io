import React, { useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import StoryCard from '../../components/planning-poker/StoryCard';
import PointSelector from '../../components/planning-poker/PointSelector';
import VoteResult from '../../components/planning-poker/VoteResult';
import StoryInput from '../../components/planning-poker/StoryInput';

interface Story {
  title: string;
  description: string;
}

const PlanningPoker: React.FC = () => {
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [selectedPoint, setSelectedPoint] = useState<number>();
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  const handlePointSelect = (point: number) => {
    setSelectedPoint(point);
    setVotes(prev => ({
      ...prev,
      '현재 사용자': point
    }));
  };

  const handleStorySubmit = (story: Story) => {
    setCurrentStory(story);
    // 새로운 스토리가 입력되면 투표 초기화
    setVotes({});
    setSelectedPoint(undefined);
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <StoryInput onStorySubmit={handleStorySubmit} />
        </Box>

        {currentStory && (
          <StoryCard
            title={currentStory.title}
            description={currentStory.description}
          />
        )}

        <PointSelector
          onSelect={handlePointSelect}
          selectedPoint={selectedPoint}
        />

        {Object.keys(votes).length > 0 && (
          <VoteResult
            votes={votes}
            average={average}
          />
        )}
      </Box>
    </Container>
  );
};

export default PlanningPoker; 