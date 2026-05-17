import React from 'react';
import { Box, Typography, LinearProgress, List, ListItem, ListItemText } from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';

const ScoreBar = ({ label, value, causes }) => {
  const normalizedValue = value != null ? value : 0;

const getColor = (score, label) => {
  switch (label.toLowerCase()) {
    case 'satisfaction score':
    case 'satisfaction global score':
      return score >= 70 ? '#4caf50' : score >= 40 ? '#ff9800' : '#f44336'; // 🟢 🟠 🔴

    case 'unsatisfaction score':
      return score >= 70 ? '#f44336' : score >= 40 ? '#ff9800' : '#4caf50'; // 🔴 🟠 🟢

    default:
      return '#4caf50';
  }
};

const getIcon = (score, label) => {
  switch (label.toLowerCase()) {
    case 'satisfaction score':
    case 'satisfaction global score':
      return score >= 70
        ? <EmojiObjectsIcon sx={{ color: '#4caf50', mr: 1 }} />
        : score >= 40
        ? <WarningAmberIcon sx={{ color: '#ff9800', mr: 1 }} />
        : <ErrorIcon sx={{ color: '#f44336', mr: 1 }} />;

    case 'unsatisfaction score':
      return score >= 70
        ? <ErrorIcon sx={{ color: '#f44336', mr: 1 }} />
        : score >= 40
        ? <WarningAmberIcon sx={{ color: '#ff9800', mr: 1 }} />
        : <EmojiObjectsIcon sx={{ color: '#4caf50', mr: 1 }} />;

    default:
      return <EmojiObjectsIcon sx={{ color: '#4caf50', mr: 1 }} />;
  }
};


  return (
    <Box mb={4} p={3} sx={{ borderRadius: 3, backgroundColor: '#ffffff', boxShadow: '0px 4px 12px rgba(0,0,0,0.06)', border: '1px solid #e0e0e0' }}>
      <Box display="flex" alignItems="center" mb={1}>
        {getIcon(normalizedValue, label)}
        <Typography variant="h6" fontWeight="600" ml={1}>{label}</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant="determinate"
            value={normalizedValue}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getColor(normalizedValue, label),
              },
            }}
          />
        </Box>
        <Box minWidth={40}>
          <Typography variant="body2" color="textSecondary">
            {`${normalizedValue} %`}
          </Typography>
        </Box>
      </Box>
      {Array.isArray(causes) && causes.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>Responses:</Typography>
          <List dense sx={{ pl: 2 }}>
            {causes.map((cause, idx) => (
              <ListItem key={idx} sx={{ py: 0 }}>
                <ListItemText primary={`• ${cause}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default ScoreBar;