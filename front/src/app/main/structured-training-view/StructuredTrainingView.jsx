import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, CircularProgress, Alert, List,
  ListItem, ListItemText, Divider, Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const StructuredTrainingView = ({ planId }) => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const API_URL = process.env.REACT_APP_API_URL ;
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  useEffect(() => {
    if (!planId) return;
    setLoading(true);
    const fetchStructuredTrainings = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/training-recommendation-plans/${planId}/structured-trainings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTrainings(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load structured trainings');
      } finally {
        setLoading(false);
      }
    };
    fetchStructuredTrainings();
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

  if (trainings.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          No structured trainings found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Structured Trainings – Plan ID: {planId}
      </Typography>

      {trainings.map((session, idx) => (
        <Accordion key={idx} sx={{ mb: 3, boxShadow: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="medium" color="secondary">
              {session.trainingTitle}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Participants ({session.participants.length})
              </Typography>
              <List dense>
                {session.participants.map((participant) => (
                  <ListItem key={participant.id} sx={{ pl: 0 }}>
                    <ListItemText primary={participant.fullName || 'Unnamed Participant'} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Included Skills
              </Typography>
              <Typography>
                {session.includedSkills.length > 0
                  ? session.includedSkills.join(', ')
                  : 'None'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Skills Justification
                </Typography>
                <Typography>{session.skillsJustification || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Training Justification
                </Typography>
                <Typography>{session.trainingJustification || 'N/A'}</Typography>
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
                <Typography>{session.priorityJustification || 'N/A'}</Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default StructuredTrainingView;
