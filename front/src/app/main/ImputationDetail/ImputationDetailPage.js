import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Stack
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const ImputationDetailPage = () => {
  const { imputationId } = useParams();
  const [imputation, setImputation] = useState(null);
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    console.log("🪵 imputationId from route params:", imputationId);

    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API_URL}/imputations/${imputationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const imputationData = res.data;
        setImputation(imputationData);

        const taskRes = await axios.get(`${API_URL}/tasks/${imputationData.taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const taskData = taskRes.data;

        const phaseRes = await axios.get(`${API_URL}/phases/${taskData.phaseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const phaseData = phaseRes.data;

        const projectRes = await axios.get(`${API_URL}/projects/${phaseData.projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const projectData = projectRes.data;

        setTaskDetail({
          taskName: taskData.name,
          phaseName: phaseData.name,
          projectName: projectData.name,
        });
      } catch (err) {
        console.error(err);
        setError("Error fetching imputation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [imputationId]);

  const handleValidate = async () => {
  try {
    console.log("Validating imputation with ID:", imputationId);
    await axios.put(
      `${API_URL}/imputations/${imputationId}/validate`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setImputation((prev) => ({ ...prev, validated: true }));
    setSuccessMessage("Imputation validated successfully!");

    // ⏳ Attendre un petit moment pour afficher le message si tu veux
    setTimeout(() => {
      navigate(`/imputations/valid/${imputation.userId}`);
    }, 1000); // optionnel : attendre 1 seconde
  } catch (err) {
    setError("Failed to validate the imputation.");
  }
};


  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!imputation) return null;

  return (
    <Box px={10} py={4}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          📄 Imputation Details
        </Typography>

        <Typography paragraph><strong>Date:</strong> {dayjs(imputation.date).format('dddd, DD MMMM YYYY')}</Typography>
        <Typography paragraph><strong>Hours:</strong> {imputation.hours} h</Typography>

        <Typography paragraph><strong>Description:</strong></Typography>
        <Typography paragraph sx={{ whiteSpace: 'pre-line', ml: 2 }}>
          {imputation.description || 'Not provided'}
        </Typography>

        <Typography paragraph><strong>Status:</strong> {imputation.validated ? '✅ Validated' : '❌ Not validated'}</Typography>

        {taskDetail && (
          <>
            <Typography paragraph><strong>Task:</strong> {taskDetail.taskName}</Typography>
            <Typography paragraph><strong>Phase:</strong> {taskDetail.phaseName}</Typography>
            <Typography paragraph><strong>Project:</strong> {taskDetail.projectName}</Typography>
          </>
        )}

        <Stack direction="row" spacing={2} mb={3} justifyContent="flex-end">
          {!imputation.validated && (
            <Button variant="contained" color="primary" onClick={handleValidate}>
              Validate
            </Button>
          )}
        </Stack>

        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      </Paper>
    </Box>
  );
};

export default ImputationDetailPage;
