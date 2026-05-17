import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Typography, CircularProgress, Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EmployeeAnswersPage = () => {
  const { questionnaireId, employeId } = useParams();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` },
        };
        const res = await axios.get(
          `${API_URL}/answers/${questionnaireId}/employee/${employeId}`,
          config
        );
        setAnswers(res.data);
      } catch (err) {
        console.error('Error fetching answers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionnaireId, employeId]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Employee's Answers</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {answers.length > 0 ? (
            <>
              <Typography variant="h6" mb={2}>
                Employee: {answers[0].employeFullName}
              </Typography>

              {answers.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1">
                    <strong>Q{index + 1}:</strong> {item.questionText}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Answer:</strong> {item.responseText}
                  </Typography>
                </Paper>
              ))}
            </>
          ) : (
            <Typography>No answers found for this employee.</Typography>
          )}

          <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            ← Back
          </Button>
        </>
      )}
    </Box>
  );
};

export default EmployeeAnswersPage;
