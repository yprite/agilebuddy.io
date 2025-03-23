import React from 'react';
import { Button, Typography, Box, Paper, Grid } from '@mui/material';

interface PointSelectorProps {
  onSelect: (point: number) => void;
  selectedPoint?: number;
}

const points = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100];

const PointSelector: React.FC<PointSelectorProps> = ({ onSelect, selectedPoint }) => {
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            mb: 2
          }}
        >
          포인트 선택
        </Typography>
        <Grid 
          container 
          spacing={2} 
          justifyContent="center"
          sx={{ 
            maxWidth: '600px',
            width: '100%'
          }}
        >
          {points.map((point) => (
            <Grid item xs={4} sm={3} md={2} key={point}>
              <Button
                fullWidth
                onClick={() => onSelect(point)}
                sx={{
                  height: '60px',
                  fontSize: '1.1rem',
                  transition: 'all 0.2s',
                  backgroundColor: selectedPoint === point ? 'primary.main' : 'white',
                  color: selectedPoint === point ? 'white' : 'primary.main',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: selectedPoint === point ? 'primary.dark' : 'primary.light',
                    color: 'white'
                  }
                }}
              >
                {point}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default PointSelector; 