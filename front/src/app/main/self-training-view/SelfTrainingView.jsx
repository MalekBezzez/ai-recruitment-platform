import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, CircularProgress, Alert, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

// Fonction utilitaire pour transformer "self_training" en "Self Training"
function formatTitle(text) {
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


  const API_URL = process.env.REACT_APP_API_URL ;
const SelfTrainingView = ({ planId }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  useEffect(() => {
    const fetchSelfTrainings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/training-recommendation-plans/${planId}/self-trainings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data);
      } catch (err) {
        setError('Failed to load self trainings');
      } finally {
        setLoading(false);
      }
    };
    fetchSelfTrainings();
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

  if (Object.entries(data).length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">No self trainings found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Self Training Details – Plan ID: {planId}
      </Typography>

      {Object.entries(data).map(([category, employees]) => (
        <Box key={category} mb={5}>
        
          {employees.map((employee) => (
            <Accordion key={employee.idEmployee} sx={{ mb: 3, boxShadow: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="medium">
                  {employee.employeeName} (ID: {employee.idEmployee})
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                {employee.selfTrainingSessions.length === 0 ? (
                  <Typography color="textSecondary" fontStyle="italic">
                    No sessions available
                  </Typography>
                ) : (
                  employee.selfTrainingSessions.map((session, idx) => (
                    <Box
                      key={idx}
                      mb={4}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        p: 3,
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" mb={2} color="secondary">
                        {session.trainingTitle}
                      </Typography>

                      <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Included Skills
                        </Typography>
                        <Typography>
                          {session.includedSkills.length > 0 ? session.includedSkills.join(', ') : 'None'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Skills Justification
                        </Typography>
                        <Typography>{session.skillsJustification || 'N/A'}</Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Training Justification
                        </Typography>
                        <Typography>{session.trainingJustification || 'N/A'}</Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box mb={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Priority
                        </Typography>
                        <Typography>{session.priority || 'N/A'}</Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Priority Justification
                        </Typography>
                        <Typography>{session.priorityJustification || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default SelfTrainingView;
