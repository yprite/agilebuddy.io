import React from 'react';
import { Box, TextField, Paper, Typography } from '@mui/material';

interface StoryInputProps {
  story: string;
  onStoryChange: (story: string) => void;
}

const StoryInput: React.FC<StoryInputProps> = ({ story, onStoryChange }) => {
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
          fontWeight: 600
        }}
      >
        스토리 입력
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="스토리 내용을 입력하세요..."
        value={story}
        onChange={(e) => onStoryChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
    </Paper>
  );
};

export default StoryInput; 