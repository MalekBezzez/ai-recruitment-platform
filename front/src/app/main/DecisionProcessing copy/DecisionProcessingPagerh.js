import React, { useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, TextField, Typography, Paper, Grid,Snackbar, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const DecisionProcessingPagerh = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');

  const token = localStorage.getItem("accessToken");
  const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
const API_URL = process.env.REACT_APP_API_URL; 
const [snack, setSnack] = useState({
  open: false,
  message: '',
  severity: 'info', // 'success' | 'info' | 'warning' | 'error'
});

const showSnack = (message, severity = 'info') =>
  setSnack({ open: true, message, severity });

const handleSnackClose = (_, reason) => {
  if (reason === 'clickaway') return;
  setSnack(s => ({ ...s, open: false }));
}; 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/conge/taches/details/${id}`, {
          headers: {
            Authorization: `Bearer ${tokenWithoutQuotes}`,
          },
        });
        setTaskDetails(response.data);
      } catch (error) {
        console.error("Error loading task details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, tokenWithoutQuotes]);

  const handleDecisionSubmit = async () => {
    try {
      await axios.post(`${API_URL}/conge/traiter/${id}`, {
        decision,
        commentaire: comment,
      }, {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      });
      showSnack("Decision submitted successfully!");
      navigate('/demande-conge-listrh');
    } catch (error) {
      console.error("Error submitting decision:", error);
      showSnack("Failed to submit decision.");
    }
  };

  if (loading) return <CircularProgress />;
  if (!taskDetails) return <Typography>No task details found.</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Process Decision for Leave Request</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
         <Snackbar
          open={snack.open}
          autoHideDuration={4000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            zIndex: 9999,           // reste au-dessus du footer et du contenu
            mt: { xs: 7, sm: 10 }   // décale vers le bas (margin-top en Material-UI)
          }}
        >
          <Alert
            onClose={handleSnackClose}
            severity={snack.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Employee:</Typography>
            <Typography>{taskDetails.employeId}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Leave Type:</Typography>
            <Typography>{taskDetails.typeConge}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Start Date:</Typography>
            <Typography>{dayjs(taskDetails.dateDebut).format('YYYY-MM-DD')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">End Date:</Typography>
            <Typography>{dayjs(taskDetails.dateFin).format('YYYY-MM-DD')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Creation Date:</Typography>
            <Typography>{dayjs(taskDetails.createTime).format('DD/MM/YYYY HH:mm')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Comment:</Typography>
            <Typography>{taskDetails.commentaire || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <TextField
        select
        label="Select Decision"
        value={decision}
        onChange={(e) => setDecision(e.target.value)}
        fullWidth
        SelectProps={{ native: true }}
      >
        <option value="">Select Decision</option>
        <option value="APPROUVER">Approve</option>
        <option value="REJETER">Reject</option>
      </TextField>

      <TextField
        label="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        margin="normal"
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDecisionSubmit}
        >
          Submit Decision
        </Button>
      </Box>

    </Box>
  );
};

export default DecisionProcessingPagerh;
