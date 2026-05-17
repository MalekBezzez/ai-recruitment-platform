import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const ScoreBar = ({ label, value }) => {
  const getColor = (score) => {
    if (score >= 75) return '#4caf50';      // vert
    if (score >= 50) return '#ff9800';      // orange
    return '#f44336';                       // rouge
  };
    
  return (
    <Box mb={2}>
      <Typography variant="body1" fontWeight="bold">{label}</Typography>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getColor(value),
              },
            }}
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">
            {`${value}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ScoreBar;