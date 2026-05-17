import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box, Typography, Accordion, AccordionSummary,
  AccordionDetails, CircularProgress, Alert, Divider, Chip, Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BuildIcon from '@mui/icons-material/Build';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function formatTitle(text) {
  return text
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


  const API_URL = process.env.REACT_APP_API_URL ;
const CareerPathingResults = () => {
  const { planId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/career-pathing-plans/plan/${planId}/results`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(response.data);
      } catch (err) {
        setError('Failed to load career pathing results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
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

  if (results.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" align="center">
          No career pathing results found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Career Pathing Results – Plan ID: {planId}
      </Typography>

      {results.map((employee) => (
        <Accordion key={employee.employeeId} sx={{ mb: 3, boxShadow: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight="medium">
              {employee.employeeFullName} (ID: {employee.employeeId})
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {employee.recommendedJobs.length === 0 ? (
              <Typography color="textSecondary" fontStyle="italic">
                No recommended jobs available
              </Typography>
            ) : (
              employee.recommendedJobs.map((job, idx) => (
                <Box
                  key={idx}
                  mb={4}
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 3,
                    backgroundColor: idx % 2 === 0 ? '#fafafa' : '#fff'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" mb={1} color="secondary">
                    {job.title} – {job.matchPercentage}% match
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Justification
                    </Typography>
                    <Typography>{job.justification || 'N/A'}</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box mb={2}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Related Skills
                    </Typography>
                    {job.relatedJobSkills.length > 0 ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
  {job.relatedJobSkills.map((skill, skillIdx) => (
    <Chip
      key={skillIdx}
      icon={
        skill.isExistingSkill 
          ? <CheckCircleIcon color="success" /> 
          : <CancelIcon color="error" />
      }
      label={skill.relatedSkillName}
      color={skill.isExistingSkill ? 'success' : 'warning'}
      variant="outlined"
    />
  ))}
</Stack>
                    ) : (
                      <Typography color="textSecondary">None</Typography>
                    )}
                  </Box>

                  {job.fromCompanyNeeds && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography>This job comes from company needs.</Typography>
                    </>
                  )}
                </Box>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CareerPathingResults;
