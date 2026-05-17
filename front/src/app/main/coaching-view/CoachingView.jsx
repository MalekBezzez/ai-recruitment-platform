import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, CircularProgress, Alert, List,
  ListItem, ListItemText, Divider, Avatar, Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

// Transforme snake_case en Title Case
function formatTitle(text) {
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
  

  const API_URL = process.env.REACT_APP_API_URL ;
const CoachingView = ({ planId }) => {
  const [coachings, setCoachings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  useEffect(() => {
    const fetchCoachings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/training-recommendation-plans/${planId}/coachings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCoachings(response.data);
      } catch (err) {
        setError('Failed to load coaching sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchCoachings();
  }, [planId, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (coachings.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          No coaching sessions found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Coaching Sessions – Plan ID: {planId}
      </Typography>

      {coachings.map((session, idx) => (
        <Accordion key={idx} sx={{ mb: 3, boxShadow: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="medium" color="secondary">
              {session.training_title}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {/* Coach Section */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {session.coach.fullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Coach
                </Typography>
                <Typography>{session.coach.fullName}</Typography>
                <Typography variant="body2" color="textSecondary" mt={0.5}>
                  {session.coach_justification || 'No justification provided.'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Participants */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Participants ({session.participants.length})
              </Typography>
              <List dense>
                {session.participants.map((participant, i) => (
                  <ListItem key={i} sx={{ pl: 0 }}>
                    <ListItemText primary={participant.fullName || participant.name || 'Unnamed Participant'} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Included Skills */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Included Skills
              </Typography>
              <Typography>
                {session.included_skills.length > 0
                  ? session.included_skills.join(', ')
                  : 'None'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Justifications and Priority */}
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Skills Justification
                </Typography>
                <Typography>{session.skills_justification || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Training Justification
                </Typography>
                <Typography>{session.training_justification || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Priority
                </Typography>
                <Typography>{session.priority || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Priority Justification
                </Typography>
                <Typography>{session.priority_justification || 'N/A'}</Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CoachingView;
