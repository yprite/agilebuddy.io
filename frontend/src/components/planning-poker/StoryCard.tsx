import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StoryCardProps {
  title: string;
  description: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ title, description }) => {
  return (
    <Card sx={{ 
      minWidth: 275,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap'
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StoryCard; 