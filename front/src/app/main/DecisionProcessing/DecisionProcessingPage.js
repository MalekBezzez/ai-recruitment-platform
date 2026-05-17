import React, { useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress,Snackbar , Alert , TextField, Typography, Paper, Grid
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const DecisionProcessingPage = () => {
  const { id } = useParams(); // taskId
  const navigate = useNavigate();
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
  const [taskDetails, setTaskDetails] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');

  // Retrieve JWT token and user info from localStorage
  const rawToken = localStorage.getItem('accessToken');
  const token = rawToken?.replace(/"/g, '') || '';
  const rawUser = JSON.parse(localStorage.getItem('user') || '{}');
  const role = rawUser.user?.role;
  const API_URL = process.env.REACT_APP_API_URL;

  // Logged-in employee ID
  const loggedEmpId = rawUser.user?.id;

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/conge/taches/details/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        setTaskDetails(data);
        // Determine employeeId: from task details or fallback to logged-in user
        const eId = data.employeId ?? loggedEmpId;
        setEmployeeId(eId);
      } catch (error) {
        console.error('Error loading task details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, token, loggedEmpId, API_URL]);

  const handleDecisionSubmit = async () => {
    try {
      await axios.post(
        `${API_URL}/conge/traiter/${id}`,
        {
          decision,
          commentaire: comment,
          employeId: employeeId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnack('Decision submitted successfully!');
      // Redirect based on user role
      if (role === 'RH' ) {
        navigate('/demande-conge-listrh');
      } else if (role === 'MANAGER' ) {
        navigate('/demande-conge-list');
      } else {
        // default fallback
        navigate('/demande-conge-list');
      }
    } catch (error) {
      console.error('Error submitting decision:', error);
      showSnack('Failed to submit decision.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!taskDetails) {
    return <Typography align="center">No task details found.</Typography>;
  }

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
          {/* Task info cards */}
          <Grid item xs={12} sm={6}>
            <Typography fontWeight="bold">Employee ID:</Typography>
            <Typography>{employeeId}</Typography>
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

      {/* Decision input */}
      <TextField
        select
        label="Select Decision"
        value={decision}
        onChange={(e) => setDecision(e.target.value)}
        fullWidth
        SelectProps={{ native: true }}
        margin="normal"
      >
        <option value="">Select Decision</option>
        <option value="APPROUVER">Approve</option>
        <option value="REJETER">Reject</option>
      </TextField>

      {/* Comment input */}
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

      {/* Submit button */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDecisionSubmit}
          disabled={!decision}
        >
          Submit Decision
        </Button>
      </Box>
    </Box>
  );
};

export default DecisionProcessingPage;
